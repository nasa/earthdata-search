import jwt from 'jsonwebtoken'
import fs from 'fs'
import simpleOAuth2 from 'simple-oauth2'

const config = JSON.parse(fs.readFileSync('config.json'))

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

function edlAuthorizer(event, context, callback) {
  if (!event.authorizationToken) {
    return callback('Unauthorized')
  }

  const tokenParts = event.authorizationToken.split(' ')
  let jwtToken = tokenParts[1]

  try {
    jwt.verify(jwtToken, config.secret, async (verifyError, decoded) => {
      if (verifyError) {
        console.log('verifyError', verifyError)
        // 401 Unauthorized
        console.log(`Token invalid. ${verifyError}`)
        return callback('Unauthorized')
      }

      const oauth2 = simpleOAuth2.create(config.oauth)
      const oauthToken = oauth2.accessToken.create(decoded.token)
      if (oauthToken.expired()) {
        try {
          const refreshed = await oauthToken.refresh()
          jwtToken = jwt.sign({ token: refreshed.token }, config.secret)
        } catch (error) {
          console.log('Error refreshing access token: ', error.message)
          return callback('Unauthorized')
        }
      }

      // is custom authorizer function
      console.log('valid from customAuthorizer', decoded)
      const username = decoded.token.endpoint.split('/').pop()
      return callback(null, generatePolicy(username, jwtToken, 'Allow', event.methodArn))
    })
  } catch (err) {
    console.log('catch error. Invalid token', err)
    return callback('Unauthorized')
  }
  return null
}

export default edlAuthorizer
