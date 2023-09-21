import jwt from 'jsonwebtoken'

import { addToast } from '../util/addToast'
import ContactInfoRequest from '../util/request/contactInfoRequest'

import { UPDATE_CONTACT_INFO } from '../constants/actionTypes'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { handleError } from './errors'

export const updateContactInfo = (data) => ({
  type: UPDATE_CONTACT_INFO,
  payload: data
})

export const setContactInfoFromJwt = (jwtToken) => (dispatch) => {
  if (!jwtToken) return

  const decoded = jwt.decode(jwtToken)
  const { ursProfile } = decoded

  dispatch(updateContactInfo({
    ursProfile
  }))
}

/**
 * Fetch the user's CMR-ordering preferences and URS profile from lambda
 */
export const fetchContactInfo = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

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
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

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
      dispatch(handleError({
        error,
        action: 'updateNotificationLevel',
        resource: 'contactInfo',
        verb: 'updating',
        requestObject
      }))
    })

  return response
}
