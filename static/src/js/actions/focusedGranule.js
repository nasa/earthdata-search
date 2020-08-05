import actions from './index'

import { UPDATE_FOCUSED_GRANULE } from '../constants/actionTypes'

import { createEcho10MetadataUrls } from '../util/granules'
import { updateAuthTokenFromHeaders } from './authToken'
import { portalPathFromState } from '../../../../sharedUtils/portalPath'

import GraphQlRequest from '../util/request/graphQlRequest'

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
    metadata,
    router
  } = getState()

  const { granules: granuleMetadata = {} } = metadata
  const { [focusedGranule]: focusedGranuleMetadata = {} } = granuleMetadata
  const {
    hasAllMetadata = false,
    isCwic = false
  } = focusedGranuleMetadata

  // If this is a cwic granule, we've already retrieved everything we can from the search
  if (isCwic) return null

  // If we already have the metadata for the focusedGranule, don't fetch it again
  if (hasAllMetadata) {
    return null
  }

  const graphRequestObject = new GraphQlRequest(authToken)

  const graphQuery = `
    query GetGranule(
      $id: String!
    ) {
      granule(
        conceptId: $id
      ) {
        granuleUr
        granuleSize
        title
        onlineAccessFlag
        dayNightFlag
        timeStart
        timeEnd
        dataCenter
        originalFormat
        conceptId
        collectionConceptId
        spatialExtent
        temporalExtent
        relatedUrls
        dataGranule
        measuredParameters
        providerDates
      }
    }`

  const response = graphRequestObject.search(graphQuery, {
    id: focusedGranule
  })
    .then((response) => {
      const payload = []

      const {
        data: responseData,
        headers
      } = response
      const { data } = responseData
      const { granule } = data

      if (granule) {
        const {
          collectionConceptId,
          conceptId,
          dataCenter,
          dataGranule,
          dayNightFlag,
          granuleSize,
          granuleUr,
          measuredParameters,
          onlineAccessFlag,
          originalFormat,
          providerDates,
          relatedUrls,
          spatialExtent,
          temporalExtent,
          timeEnd,
          timeStart,
          title
        } = granule

        payload.push({
          collectionConceptId,
          conceptId,
          dataCenter,
          dataGranule,
          dayNightFlag,
          granuleSize,
          granuleUr,
          id: conceptId,
          measuredParameters,
          metadataUrls: createEcho10MetadataUrls(focusedGranule),
          onlineAccessFlag,
          originalFormat,
          providerDates,
          relatedUrls,
          spatialExtent,
          temporalExtent,
          timeEnd,
          timeStart,
          title
        })

        dispatch(updateAuthTokenFromHeaders(headers))

        dispatch(actions.updateGranuleMetadata(payload))
      } else {
        // If no data was returned, clear the focused granule and redirect the user back to the search page
        dispatch(updateFocusedGranule(''))

        const { location } = router
        const { search } = location

        dispatch(actions.changeUrl({
          pathname: `${portalPathFromState(getState())}/search`,
          search
        }))
      }
    })
    .catch((error) => {
      dispatch(updateFocusedGranule(''))

      dispatch(actions.handleError({
        error,
        action: 'getFocusedGranule',
        resource: 'granule',
        requestObject: graphRequestObject
      }))
    })

  return response
}

/**
 * Change the focusedGranule, and download that granule metadata
 * @param {String} granuleId
 */
export const changeFocusedGranule = granuleId => (dispatch) => {
  dispatch(updateFocusedGranule(granuleId))

  dispatch(actions.getFocusedGranule())
}
