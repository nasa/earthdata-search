/**
 * Generate AuthPolicy for the Authorizer, and attach the JWT
 * @param {String} username username of authenticated uset
 * @param {Object} jwtToken JWT containing EDL token
 * @param {String} effect
 * @param {Object} resource
 */
export const generatePolicy = (username, jwtToken, effect, resource) => {
  const authResponse = {
    principalId: username
  }

  if (jwtToken) {
    authResponse.context = { jwtToken }
  }

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
