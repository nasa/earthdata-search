import { createSelector } from 'reselect'

/**
 * Retrieve current user from Redux
 * @param {Object} state Current state of Redux
 */
export const getUser = (state) => {
  const { user = {} } = state

  return user
}

/**
 * Retrieve the current user's username from Redux
 */
export const getUsername = createSelector(
  [getUser],
  (user) => {
    const { username } = user

    return username
  }
)
