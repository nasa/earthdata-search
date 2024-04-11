import { createSelector } from 'reselect'

/**
 * Retrieve current contact information from Redux
 * @param {Object} state Current state of Redux
 */
export const getContactInfo = (state) => {
  const { contactInfo = {} } = state

  return contactInfo
}

/**
 * Retrieve current URS Profile from Redux
 */
export const getUrsProfile = createSelector(
  [getContactInfo],
  (contactInfo) => {
    const { ursProfile = {} } = contactInfo

    return ursProfile
  }
)
