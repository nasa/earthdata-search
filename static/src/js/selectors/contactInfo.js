import { createSelector } from 'reselect'

/**
 * Retrieve current collection query information from Redux
 * @param {Object} state Current state of Redux
 */
export const getContactInfo = (state) => {
  const { contactInfo = {} } = state

  return contactInfo
}


/**
 * Retrieve current collection query information from Redux
 * @param {Object} state Current state of Redux
 */
export const getUrsProfile = createSelector(
  [getContactInfo],
  (contactInfo) => {
    const { ursProfile = {} } = contactInfo

    return ursProfile
  }
)
