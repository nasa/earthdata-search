import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { getEarthdataConfig } from '../../../../sharedUtils/config'

/**
 * Retrieves the public key for a given key ID from a JWKS endpoint
 */
const pubKey = async (uri, keyId) => {
  const client = jwksClient({
    strictSsl: true,
    jwksUri: uri
  })

  const key = await client.getSigningKey(keyId)

  return key.getPublicKey()
}

const keys = {
  sit: null,
  uat: null,
  prod: null
}

/**
 * Validates a users EDL token, attempts to refresh the token if needed
 * @param {String} jwtToken Authorization token from request
 * @returns {String} username associated with the valid EDL token
 */
export const validateToken = async (edlToken, earthdataEnvironment) => {
  const decodedJwtToken = jwt.decode(edlToken)

  if (!decodedJwtToken) {
    return false
  }

  const {
    edlHost: issuer,
    edlJwk,
    edlJwkId
  } = getEarthdataConfig(earthdataEnvironment)

  if (!keys[earthdataEnvironment]) {
    keys[earthdataEnvironment] = await pubKey(edlJwk, edlJwkId)
  }

  const key = keys[earthdataEnvironment]

  jwt.verify(
    edlToken,
    key,
    {
      algorithms: ['RS256'],
      issuer
    },
    (error, decoded) => {
      if (error) throw new Error(error)

      const { uid: username } = decoded

      return username
    }
  )

  const { uid: username } = decodedJwtToken

  return { username }
}
