import jwt from 'jsonwebtoken'
import fs from 'fs'
import simpleOAuth2 from 'simple-oauth2'
import getEdlConfig from './configUtil'

const config = JSON.parse(fs.readFileSync('config.json'))

/**
 * Generate AuthPolicy for the Authorizer, and attach the JWT
 * @param {*} username username of authenticated uset
 * @param {*} jwtToken JWT containing EDL token
 * @param {*} effect
 * @param {*} resource
 */
const generatePolicy = (username, jwtToken, effect, resource) => {
  const authResponse = {}
  authResponse.principalId = username
  authResponse.context = { jwtToken }
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne

    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

let oauthConfig = null

// eslint-disable-next-line no-unused-expressions
const getOauthConfig = async () => {
// async function getOauthConfig() {
  try {
    if (oauthConfig === null) {
      console.log('getting new edlconfig...')
      oauthConfig = await getEdlConfig()
    }
  } catch (e) {
    console.log(e)
  }

  return oauthConfig

  // if (oauthConfig) return oauthConfig
  // try {
  //   oauthConfig = await getEdlConfig()
  //   return oauthConfig
  // } catch (e) {
  //   console.log(e)
  // }
  // return null
}

/**
 * API Gateway Authorizer to verify requets are authenticated
 */
async function edlAuthorizer(event, context, callback) {
  // const oauthConfig = await getEdlConfig()
  oauthConfig = await getOauthConfig()
  console.log('oauthConfig', oauthConfig)
  if (oauthConfig !== null) {
    if (!event.authorizationToken) {
      return callback('Unauthorized')
    }

    const tokenParts = event.authorizationToken.split(' ')
    let jwtToken = tokenParts[1]

    try {
      jwt.verify(jwtToken, config.secret, async (verifyError, decoded) => {
        if (verifyError) {
          // 401 Unauthorized
          console.log(`Token invalid. ${verifyError}`)
          return callback('Unauthorized')
        }

        const oauth2 = simpleOAuth2.create(oauthConfig)
        const oauthToken = oauth2.accessToken.create(decoded.token)
        if (oauthToken.expired()) {
          try {
            const refreshed = await oauthToken.refresh()
            console.log('Token refreshed successfully')
            jwtToken = jwt.sign({ token: refreshed.token }, config.secret)
          } catch (error) {
            console.log('Error refreshing access token: ', error.message)
            return callback('Unauthorized')
          }
        }

        // Return success
        const username = decoded.token.endpoint.split('/').pop()
        return callback(null, generatePolicy(username, jwtToken, 'Allow', event.methodArn))
      })
    } catch (err) {
      console.log('Authorizer error. Invalid token', err)
      return callback('Unauthorized')
    }
  }
  return null
}

export default edlAuthorizer
