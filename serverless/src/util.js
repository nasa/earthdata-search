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
 * Split an array into an array of smaller arrays
 * @param {Array} myArray The array to be split up into chunks
 * @param {Number} chunkSize The size of the chunks to split the array into
 * @return {Array} An array of arrays split up into the requested sizes
 */
export const chunkArray = (myArray, chunkSize) => {
  let index = 0
  const arrayLength = myArray.length
  const tempArray = []

  for (index = 0; index < arrayLength; index += chunkSize) {
    const myChunk = myArray.slice(index, index + chunkSize)

    tempArray.push(myChunk)
  }

  return tempArray
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
