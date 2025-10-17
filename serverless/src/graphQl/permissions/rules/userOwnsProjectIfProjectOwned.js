import { rule } from 'graphql-shield'

/**
 * Return true is the user owns the project. Also returns true if there is no current user id
 * and the project has no user_id.
 * @returns {boolean} true if the user owns the project or if neither the user nor the project is owned, false otherwise
 */
const userOwnsProjectIfProjectOwned = rule()(async (parent, args, context) => {
  const { databaseClient, user = {} } = context
  const { id: currentUserId } = user
  const { obfuscatedId } = args

  const project = await databaseClient.getProjectByObfuscatedId(obfuscatedId)

  // If there is no project, return false
  if (!project) return false

  const { user_id: projectUserId } = project

  // If the project is not owned and there is no current user, return true
  if (!projectUserId && !currentUserId) return true

  // Does the user own the project?
  return projectUserId === currentUserId
})

export default userOwnsProjectIfProjectOwned
