import actions from './index'

import {
  UPDATE_FOCUSED_GRANULE
} from '../constants/actionTypes'

import { createEcho10MetadataUrls } from '../util/granules'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getFocusedGranuleId } from '../selectors/focusedGranule'
import { getFocusedGranuleMetadata } from '../selectors/granuleMetadata'
import { portalPathFromState } from '../../../../sharedUtils/portalPath'

import GraphQlRequest from '../util/request/graphQlRequest'

/**
 * Sets the focused granule value in redux
 * @param {String} payload Concept ID of the granule to set as focused
 */
export const updateFocusedGranule = (payload) => ({
  type: UPDATE_FOCUSED_GRANULE,
  payload
})

/**
 * Perform a granule concept request based on the focusedGranule from the store.
 */
export const getFocusedGranule = () => (dispatch, getState) => {
  const state = getState()

  const {
    authToken,
    router
  } = state

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)
  const focusedGranuleId = getFocusedGranuleId(state)
  const focusedGranuleMetadata = getFocusedGranuleMetadata(state)

  // Use the `hasAllMetadata` flag to determine if we've requested previously
  // requested the focused collections metadata from graphql
  const {
    hasAllMetadata = false,
    isOpenSearch = false
  } = focusedGranuleMetadata

  // If this is an opensearch granule, we've already retrieved everything we can from the search
  if (isOpenSearch) return null

  // If we already have the metadata for the focusedGranule, don't fetch it again
  if (hasAllMetadata) return null

  const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

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

  const response = graphQlRequestObject.search(graphQuery, {
    id: focusedGranuleId
  })
    .then((response) => {
      const payload = []

      const {
        data: responseData
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
          hasAllMetadata: true,
          id: conceptId,
          measuredParameters,
          metadataUrls: createEcho10MetadataUrls(focusedGranuleId, earthdataEnvironment),
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

        // Update metadata in the store
        dispatch(actions.updateGranuleMetadata(payload))
      } else {
        // If no data was returned, clear the focused granule and redirect the user back to the search page
        dispatch(actions.updateFocusedGranule(''))

        const { location } = router
        const { search } = location

        dispatch(actions.changeUrl({
          pathname: `${portalPathFromState(getState())}/search`,
          search
        }))
      }
    })
    .catch((error) => {
      dispatch(actions.updateFocusedGranule(''))

      dispatch(actions.handleError({
        error,
        action: 'getFocusedGranule',
        resource: 'granule',
        requestObject: graphQlRequestObject
      }))
    })

  return response
}

/**
 * Change the focusedGranule, and download that granule metadata
 * @param {String} granuleId
 */
export const changeFocusedGranule = (granuleId) => (dispatch) => {
  dispatch(updateFocusedGranule(granuleId))

  if (granuleId !== '') {
    dispatch(actions.getFocusedGranule())
  }
}
