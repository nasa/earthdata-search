import AWS from 'aws-sdk'
import knex from 'knex'
import { stringify as qsStringify } from 'qs'
import request from 'request-promise'
import jwt from 'jsonwebtoken'
import { getEarthdataConfig, getSecretEarthdataConfig } from '../../sharedUtils/config'
import { getEdlConfig } from './configUtil'

// for fetching configuration
const secretsmanager = new AWS.SecretsManager()

/**
 * Select only desired keys from a provided object.
 * @param {object} providedObj - An object containing any keys.
 * @param {array} keys - An array of strings that represent the keys to be picked.
 * @return {obj} An object containing only the desired keys.
 */
export const pick = (providedObj = {}, keys) => {
  let obj = null

  // if `null` is provided the default parameter will not be
  // set so we'll handle it manually
  if (providedObj == null) {
    obj = {}
  } else {
    obj = providedObj
  }

  Object.keys(obj).forEach((k) => {
    if (!keys.includes(k)) {
      delete obj[k]
    }
  })

  return obj
}


/**
 * Create a query string containing both indexed and non-indexed keys.
 * @param {object} queryParams - An object containing all queryParams.
 * @param {array} nonIndexedKeys - An array of strings that represent the keys which should not be indexed.
 * @return {string} A query string containing both indexed and non-indexed keys.
 */
export const cmrStringify = (queryParams, nonIndexedKeys = []) => {
  const nonIndexedAttrs = {}
  const indexedAttrs = { ...queryParams }

  nonIndexedKeys.forEach((key) => {
    nonIndexedAttrs[key] = indexedAttrs[key]
    delete indexedAttrs[key]
  })

  return [
    qsStringify(indexedAttrs),
    qsStringify(nonIndexedAttrs, { indices: false, arrayFormat: 'brackets' })
  ].filter(Boolean).join('&')
}

/**
 * Returns the decrypted database credentials from Secrets Manager
 */
export const getDbCredentials = async (dbCredentials) => {
  if (dbCredentials === null) {
    if (process.env.NODE_ENV === 'development') {
      const { dbUsername, dbPassword } = getSecretEarthdataConfig()

      return {
        username: dbUsername,
        password: dbPassword
      }
    }

    // If not running in development mode fetch secrets from AWS
    const params = {
      SecretId: process.env.configSecretId
    }

    const secretValue = await secretsmanager.getSecretValue(params).promise()

    return JSON.parse(secretValue.SecretString)
  }

  return dbCredentials
}

/**
 * Returns an object representing a database configuration
 */
export const getDbConnectionConfig = async (connectionConfig) => {
  if (connectionConfig) {
    return connectionConfig
  }

  const dbCredentials = await getDbCredentials(null)

  const configObject = {
    user: dbCredentials.username,
    password: dbCredentials.password
  }

  if (process.env.NODE_ENV === 'development') {
    const { dbHost, dbName, dbPort } = getEarthdataConfig()

    Object.assign(configObject, {
      host: dbHost,
      database: dbName,
      port: dbPort
    })
  } else {
    Object.assign(configObject, {
      host: process.env.dbEndpoint,
      database: process.env.dbName,
      port: process.env.dbPort
    })
  }

  return configObject
}

/**
 * Returns a Knex database connection object to the EDSC RDS database
 */
export const getDbConnection = async (dbConnection) => {
  if (dbConnection === null) {
    const dbConnectionConfig = await getDbConnectionConfig(null)

    return knex({
      client: 'pg',
      connection: dbConnectionConfig
    })
  }

  return dbConnection
}

/**
 * Builds a URL used to perform a search request
 * @param {object} paramObj Parameters needed to build a search request URL
 */
export const buildURL = (paramObj) => {
  const {
    body,
    nonIndexedKeys,
    path,
    permittedCmrKeys
  } = paramObj

  const { params = {} } = JSON.parse(body)

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedCmrKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  // Transform the query string hash to an encoded url string
  const queryParams = cmrStringify(obj, nonIndexedKeys)

  const url = `${getEarthdataConfig('prod').cmrHost}${path}?${queryParams}`

  console.log(`CMR Query: ${url}`)

  return url
}

export const prepareExposeHeaders = (headers) => {
  // Add 'jwt-token' to access-control-expose-headers, so the client app can read the JWT
  const { 'access-control-expose-headers': exposeHeaders = '' } = headers
  const exposeHeadersList = exposeHeaders.split(',').filter(Boolean)
  exposeHeadersList.push('jwt-token')
  return exposeHeadersList.join(', ')
}

/**
 * Performs a search request and returns the result body and the JWT
 * @param {string} jwtToken JWT returned from edlAuthorizer
 * @param {string} url URL for to perform search
 */
export const doSearchRequest = async (jwtToken, url) => {
  // Get the access token and clientId to build the Echo-Token header
  const { clientId, secret } = getSecretEarthdataConfig('prod')

  const token = jwt.verify(jwtToken, secret)

  try {
    const response = await request.get({
      uri: url,
      resolveWithFullResponse: true,
      headers: {
        'Echo-Token': `${token.token.access_token}:${clientId}`
      }
    })

    const { body, headers } = response

    return {
      statusCode: response.statusCode,
      headers: {
        ...headers,
        'access-control-expose-headers': prepareExposeHeaders(headers),
        'jwt-token': jwtToken
      },
      body
    }
  } catch (e) {
    console.log('error', e)

    if (e.response) {
      return {
        statusCode: e.statusCode,
        body: JSON.stringify({ errors: [e.response.body] })
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ errors: ['Unexpected error encountered!', e] })
    }
  }
}

/**
 * Returns the JWT Token from our custom authorizer context
 * @param {object} event Lambda function event parameter
 */
export const getJwtToken = (event) => {
  const { requestContext } = event
  const { authorizer } = requestContext
  const { jwtToken } = authorizer
  return jwtToken
}

/**
 * Returns the decrypted urs system credentials from Secrets Manager
 */
export const getUrsSystemCredentials = async (ursSystemCredentials) => {
  if (ursSystemCredentials === null) {
    if (process.env.NODE_ENV === 'development') {
      const { cmrSystemUsername, cmrSystemPassword } = getSecretEarthdataConfig()

      return {
        username: cmrSystemUsername,
        password: cmrSystemPassword
      }
    }

    // If not running in development mode fetch secrets from AWS
    const params = {
      SecretId: 'UrsSystemPasswordSecret'
    }

    const secretValue = await secretsmanager.getSecretValue(params).promise()

    return JSON.parse(secretValue.SecretString)
  }

  return ursSystemCredentials
}

/**
 * Returns a token from URS
 */
export const getSystemToken = async (providedToken) => {
  if (providedToken) {
    return providedToken
  }

  const dbCredentials = await getUrsSystemCredentials(null)
  const { username: dbUsername, password: dbPassword } = dbCredentials

  // The client id is part of our Earthdata Login credentials
  const edlConfig = await getEdlConfig(null)
  const { client } = edlConfig
  const { id: clientId } = client

  const authenticationParams = {
    username: dbUsername,
    password: dbPassword,
    client_id: clientId,
    user_ip_address: '127.0.0.1'
  }

  const authenticationUrl = `${getEarthdataConfig('prod').cmrHost}/legacy-services/rest/tokens.json`
  const tokenResponse = await request.post({
    uri: authenticationUrl,
    body: {
      token: authenticationParams
    },
    json: true,
    resolveWithFullResponse: true
  })

  const { body } = tokenResponse

  if (tokenResponse.statusCode !== 201) {
    // On error return whatever body is provided and let
    // the caller deal with it
    return body
  }

  const { token } = body
  const { id, username } = token

  console.log(`Successfully retrieved a token for '${username}'`)

  // The actual token is returned as `id`
  return id
}
