import AWS from 'aws-sdk'
import knex from 'knex'
import { stringify as qsStringify } from 'qs'

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
  ].join('&')
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
