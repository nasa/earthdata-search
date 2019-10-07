import ContactInfoRequest from '../util/request/contactInfoRequest'
import { UPDATE_CONTACT_INFO } from '../constants/actionTypes'

export const updateContactInfo = data => ({
  type: UPDATE_CONTACT_INFO,
  payload: data
})

/**
 * Fetch the user's ECHO preferences and URS profile from lambda
 */
export const fetchContactInfo = () => (dispatch, getState) => {
  const { authToken } = getState()

  const requestObject = new ContactInfoRequest(authToken)

  const response = requestObject.fetch()
    .then((response) => {
      const { data } = response
      const {
        echo_preferences: echoPreferences,
        urs_profile: ursProfile
      } = data

      dispatch(updateContactInfo({
        echoPreferences,
        ursProfile
      }))
    })

  return response
}

/**
 * Calls lambda to update Legacy Services with new ECHO preferences
 * @param {String} level New order notification level
 */
export const updateNotificationLevel = level => (dispatch, getState) => {
  const { authToken, contactInfo } = getState()
  const { ursProfile = {} } = contactInfo
  const {
    country,
    email_address: email,
    first_name: firstName,
    last_name: lastName,
    organization
  } = ursProfile

  // Build the ECHO preferences object
  // default values that are required in legacy services (role, phones)
  const preferences = {
    general_contact: {
      first_name: firstName,
      last_name: lastName,
      email,
      organization,
      role: 'Order Contact',
      address: {
        country
      },
      phones: [{
        number: '0000000000',
        phone_number_type: 'BUSINESS'
      }]
    },
    order_notification_level: level
  }

  const requestObject = new ContactInfoRequest(authToken)

  const response = requestObject.updateNotificationLevel({ preferences })
    .then((response) => {
      const { data } = response
      const {
        preferences: echoPreferences
      } = data

      dispatch(updateContactInfo({
        echoPreferences
      }))
    })

  return response
}
