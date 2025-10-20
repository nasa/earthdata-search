import { rule } from 'graphql-shield'

/**
 * Checks if the user owns the project requested
 * @returns {boolean} true if the user is valid, false otherwise
 */
const userOwnsProject = rule()(async (parent, args, context) => {
  const { databaseClient, user } = context
  const { id: userId } = user
  const { obfuscatedId } = args

  if (userId) {
    const project = await databaseClient.getProjectByObfuscatedId(obfuscatedId)

    return project && project.user_id === userId
  }

  return false
})

export default userOwnsProject
