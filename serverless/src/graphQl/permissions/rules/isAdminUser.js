import { rule } from 'graphql-shield'
import { getAdminUsers } from '../../../util/getAdminUsers'

/**
 * Checks if the user has admin privileges
 * @returns {boolean} true if the user is valid, false otherwise
 */
const isAdmin = rule()(async (parent, args, context) => {
  const { user } = context
  const { urs_id: username } = user

  if (username) {
    let adminUsers

    try {
      adminUsers = await getAdminUsers()
    } catch {
      adminUsers = []
    }

    return adminUsers.includes(username)
  }

  return false
})

export default isAdmin
