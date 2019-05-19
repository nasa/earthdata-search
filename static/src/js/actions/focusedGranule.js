import { parse as parseXml } from 'fast-xml-parser'

import actions from './index'
import { UPDATE_FOCUSED_GRANULE } from '../constants/actionTypes'
import { ConceptRequest } from '../util/request/cmr'
import { createEcho10MetadataUrls } from '../util/granules'

export const updateFocusedGranule = payload => ({
  type: UPDATE_FOCUSED_GRANULE,
  payload
})

/**
 * Perform a granule concept request based on the focusedGranule from the store.
 */
export const getFocusedGranule = () => (dispatch, getState) => {
  const { focusedGranule, metadata } = getState()
  if (focusedGranule === '') return null

  const { granules } = metadata
  const { allIds } = granules
  if (allIds.indexOf(focusedGranule) !== -1) return null

  const requestObject = new ConceptRequest()
  const response = requestObject.search(focusedGranule, 'echo10')
    .then((response) => {
      const { data } = response

      const payload = {
        [focusedGranule]: {
          xml: data,
          json: parseXml(data),
          metadataUrls: createEcho10MetadataUrls(focusedGranule)
        }
      }

      dispatch(actions.updateGranuleMetadata(payload))
    }, (error) => {
      dispatch(updateFocusedGranule(''))

      throw new Error('Request failed', error)
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
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
