import { rule } from 'graphql-shield'

/**
 * Checks if the user owns the retrieval requested
 * @returns {boolean} true if the user is valid, false otherwise
 */
const userOwnsRetrieval = rule()(async (parent, args, context) => {
  const { databaseClient, user } = context
  const { id: userId } = user
  const { obfuscatedId } = args

  if (userId) {
    const retrieval = await databaseClient.getRetrievalByObfuscatedId(obfuscatedId)

    return retrieval && retrieval.user_id === userId
  }

  return false
})

export default userOwnsRetrieval
