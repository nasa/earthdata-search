import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const SIT_JWK_URL = 'https://sit.urs.earthdata.nasa.gov/.well-known/edl_sit_jwks.json'
const UAT_JWK_URL = 'https://uat.urs.earthdata.nasa.gov/.well-known/edl_uat_jwks.json'
const PROD_JWK_URL = 'https://urs.earthdata.nasa.gov/.well-known/edl_ops_jwks.json'

const pubKey = async (keyFilePath, kid) => {
  const client = jwksClient({
    strictSsl: true,
    jwksUri: keyFilePath
  })

  const key = await client.getSigningKey(kid)

  return key.getPublicKey()
}

let sitKey
let uatKey
let prodKey

const getKey = async (environment) => {
  switch (environment) {
    case 'sit':
      if (!sitKey) {
        sitKey = await pubKey(SIT_JWK_URL, 'edljwtpubkey_sit')
      }

      return sitKey
    case 'uat':
      if (!uatKey) {
        uatKey = await pubKey(UAT_JWK_URL, 'edljwtpubkey_uat')
      }

      return uatKey
    case 'prod':
      if (!prodKey) {
        prodKey = await pubKey(PROD_JWK_URL, 'edljwtpubkey_ops')
      }

      return prodKey
    default:
      throw new Error(`Unknown environment: ${environment}`)
  }
}

const sitIssuer = 'https://sit.urs.earthdata.nasa.gov'
const uatIssuer = 'https://uat.urs.earthdata.nasa.gov'
const prodIssuer = 'https://urs.earthdata.nasa.gov'

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

  const key = await getKey(earthdataEnvironment)
  let issuer = prodIssuer
  if (earthdataEnvironment === 'sit') {
    issuer = sitIssuer
  }

  if (earthdataEnvironment === 'uat') {
    issuer = uatIssuer
  }

  if (earthdataEnvironment === 'prod') {
    issuer = prodIssuer
  }

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
