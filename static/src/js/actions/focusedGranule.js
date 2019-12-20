import { parse as parseXml } from 'fast-xml-parser'

import actions from './index'
import { UPDATE_FOCUSED_GRANULE } from '../constants/actionTypes'
import GranuleConceptRequest from '../util/request/granuleConceptRequest'
import { createEcho10MetadataUrls } from '../util/granules'
import { updateAuthTokenFromHeaders } from './authToken'

export const updateFocusedGranule = payload => ({
  type: UPDATE_FOCUSED_GRANULE,
  payload
})

/**
 * Perform a granule concept request based on the focusedGranule from the store.
 */
export const getFocusedGranule = () => (dispatch, getState) => {
  const {
    authToken,
    focusedGranule,
    metadata
  } = getState()
  if (focusedGranule === '') return null

  const { granules } = metadata
  const { allIds } = granules
  if (allIds.indexOf(focusedGranule) !== -1) return null

  const requestObject = new GranuleConceptRequest(authToken)
  const response = requestObject.search(focusedGranule, 'echo10', { pretty: true })
    .then((response) => {
      const { data } = response

      const payload = {
        [focusedGranule]: {
          xml: data,
          json: parseXml(data),
          metadataUrls: createEcho10MetadataUrls(focusedGranule)
        }
      }

      dispatch(updateAuthTokenFromHeaders(response.headers))
      dispatch(actions.updateGranuleMetadata(payload))
    })
    .catch((error) => {
      dispatch(updateFocusedGranule(''))

      dispatch(actions.handleError({
        error,
        action: 'getFocusedGranule',
        resource: 'granule',
        requestObject
      }))
    })

  return response
}

/**
 * Change the focusedGranule, and download that granule metadata
 * @param {string} granuleId
 */
export const changeFocusedGranule = granuleId => (dispatch) => {
  dispatch(updateFocusedGranule(granuleId))
  dispatch(actions.getFocusedGranule())
}
