import addToast from '../util/addToast'
import ContactInfoRequest from '../util/request/contactInfoRequest'

import { UPDATE_CONTACT_INFO } from '../constants/actionTypes'

import useEdscStore from '../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'

export const updateContactInfo = (data) => ({
  type: UPDATE_CONTACT_INFO,
  payload: data
})

/**
 * Fetch the user's CMR-ordering preferences and URS profile from lambda
 */
export const fetchContactInfo = () => (dispatch, getState) => {
  const state = getState()

  const earthdataEnvironment = getEarthdataEnvironment(useEdscStore.getState())

  const { authToken } = state

  const requestObject = new ContactInfoRequest(authToken, earthdataEnvironment)

  const response = requestObject.fetch()
    .then((responseObject) => {
      const { data } = responseObject
      const {
        cmr_preferences: cmrPreferences,
        urs_profile: ursProfile
      } = data

      dispatch(updateContactInfo({
        cmrPreferences,
        ursProfile
      }))
    })

  return response
}

/**
 * Calls lambda to update CMR-ordering with new notification level preference
 * @param {String} level New order notification level
 */
export const updateNotificationLevel = (level) => (dispatch, getState) => {
  const zustandState = useEdscStore.getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)

  const { authToken } = getState()

  // Build the CMR-ordering preferences object
  const preferences = {
    notificationLevel: level
  }

  const requestObject = new ContactInfoRequest(authToken, earthdataEnvironment)

  const response = requestObject.updateNotificationLevel({ preferences })
    .then((responseObject) => {
      const { data } = responseObject

      dispatch(updateContactInfo({
        cmrPreferences: data
      }))

      addToast('Notification Preference Level updated', {
        appearance: 'success',
        autoDismiss: true
      })
    })
    .catch((error) => {
      zustandState.errors.handleError({
        error,
        action: 'updateNotificationLevel',
        resource: 'contactInfo',
        verb: 'updating',
        requestObject
      })
    })

  return response
}
