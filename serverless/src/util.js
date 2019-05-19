import AWS from 'aws-sdk'
import knex from 'knex'
import { stringify as qsStringify } from 'qs'
import request from 'request-promise'
import jwt from 'jsonwebtoken'
import fs from 'fs'

const config = JSON.parse(fs.readFileSync('config.json'))

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
  ].filter(str => str !== '').join('&')
}

/**
 * Returns the decrypted database credentials from Secrets Manager
 */
export const getDbCredentials = () => {
  const params = { SecretId: process.env.configSecretId }
  let creds = null
  secretsmanager.getSecretValue(params, (err, data) => {
    if (err) {
      console.log(err, err.stack)
    } else {
      creds = JSON.parse(data.SecretString)
    }
  })
  return creds
}

/**
 * Returns a Knex database connection object to the EDSC RDS database
 */
export const getDbConnection = () => {
  const dbCredentials = getDbCredentials()
  const connection = knex({
    client: 'pg',
    connection: {
      host: process.env.dbEndpoint,
      user: dbCredentials.username,
      password: dbCredentials.password,
      database: process.env.dbName,
      port: 5432
    }
  })
  return connection
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

  const url = `${process.env.cmrHost}`
      + `${path}?${queryParams}`

  console.log(`CMR Query: ${url}`)

  return url
}

export const prepareExposeHeaders = (headers) => {
  // Add 'jwt-token' to access-control-expose-headers, so the client app can read the JWT
  const { 'access-control-expose-headers': exposeHeaders = '' } = headers
  const exposeHeadersList = exposeHeaders.split(',').filter(header => header !== '')
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
  const token = jwt.verify(jwtToken, config.secret)
  const { id: clientId } = config.oauth.client

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
        body: e.response.body
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Oh No!' })
    }
  }
}
