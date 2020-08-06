import actions from './index'
import {
  UPDATE_FOCUSED_COLLECTION
} from '../constants/actionTypes'

import { createFocusedCollectionMetadata } from '../util/focusedCollection'
import { eventEmitter } from '../events/events'
import { getApplicationConfig } from '../../../../sharedUtils/config'
import { getFocusedCollectionId } from '../selectors/focusedCollection'
import { hasTag } from '../../../../sharedUtils/tags'
import { portalPathFromState } from '../../../../sharedUtils/portalPath'
import { updateAuthTokenFromHeaders } from './authToken'
import { updateCollectionMetadata } from './collections'

import GraphQlRequest from '../util/request/graphQlRequest'

export const updateFocusedCollection = payload => ({
  type: UPDATE_FOCUSED_COLLECTION,
  payload
})

/**
 * Perform a collection request based on the focusedCollection from the store.
 */
export const getFocusedCollection = () => async (dispatch, getState) => {
  const state = getState()
  const {
    authToken,
    metadata,
    query,
    router,
    searchResults
  } = state

  const focusedCollectionId = getFocusedCollectionId(state)

  const { collections: collectionMetadata = {} } = metadata
  const { [focusedCollectionId]: focusedCollectionMetadata = {} } = collectionMetadata
  const {
    hasAllMetadata = false,
    isCwic = false
  } = focusedCollectionMetadata

  const { collection: collectionQuery } = query
  const { spatial = {} } = collectionQuery
  const { polygon } = spatial
  if (isCwic && polygon) {
    dispatch(actions.toggleSpatialPolygonWarning(true))
  } else {
    dispatch(actions.toggleSpatialPolygonWarning(false))
  }

  // Send the relevency metric event
  dispatch(actions.collectionRelevancyMetrics())

  const { collections } = searchResults
  const {
    byId = {}
  } = collections
  const { [focusedCollectionId]: focusedCollectionSearchResults = {} } = byId

  const { granules = {} } = focusedCollectionSearchResults
  const {
    isLoaded = false,
    isLoading = false
  } = granules

  // If we already have the metadata for the focusedCollection, don't fetch it again
  if (hasAllMetadata) {
    // If the focused collections' granules haven't already loaded, and are
    // not currently loading fetch them
    if (!isLoaded && !isLoading) {
      dispatch(actions.searchGranules())
    }

    return null
  }

  const { defaultCmrSearchTags } = getApplicationConfig()

  const graphRequestObject = new GraphQlRequest(authToken)

  const graphQuery = `
    query GetCollection(
      $id: String!
      $includeHasGranules: Boolean
      $includeTags: String
    ) {
      collection(
        conceptId: $id
        includeHasGranules: $includeHasGranules
        includeTags: $includeTags
      ) {
        archiveAndDistributionInformation
        boxes
        conceptId
        dataCenter
        dataCenters
        doi
        hasGranules
        relatedUrls
        scienceKeywords
        shortName
        spatialExtent
        summary
        tags
        temporalExtents
        title
        versionId
        services {
          count
          items {
            conceptId
            type
            supportedOutputFormats
            supportedReformattings
          }
        }
        variables {
          count
          items {
            conceptId
            definition
            longName
            name
            scienceKeywords
          }
        }
      }
    }`

  const response = graphRequestObject.search(graphQuery, {
    id: focusedCollectionId,
    includeHasGranules: true,
    includeTags: defaultCmrSearchTags.join(',')
  })
    .then((response) => {
      const payload = []

      const {
        data: responseData,
        headers
      } = response

      const { data } = responseData
      const { collection } = data

      if (collection) {
        const {
          archiveAndDistributionInformation,
          boxes,
          conceptId,
          dataCenter,
          hasGranules,
          services,
          shortName,
          summary,
          tags,
          title,
          variables,
          versionId
        } = collection

        const focusedMetadata = createFocusedCollectionMetadata(collection, authToken)

        payload.push({
          archiveAndDistributionInformation,
          boxes,
          id: conceptId,
          dataCenter,
          hasAllMetadata: true,
          hasGranules,
          services,
          shortName,
          summary,
          tags,
          title,
          variables,
          versionId,
          isCwic: hasGranules === false && hasTag({ tags }, 'org.ceos.wgiss.cwic.granules.prod', ''),
          ...focusedMetadata
        })

        // A users authToken will come back with an authenticated request if a valid token was used
        dispatch(updateAuthTokenFromHeaders(headers))

        // Update metadata in the store
        dispatch(updateCollectionMetadata(payload))

        dispatch(actions.searchGranules())
      } else {
        // If no data was returned, clear the focused collection and redirect the user back to the search page
        dispatch(updateFocusedCollection(''))

        const { location } = router
        const { search } = location

        dispatch(actions.changeUrl({
          pathname: `${portalPathFromState(getState())}/search`,
          search
        }))
      }
    })
    .catch((error) => {
      dispatch(actions.handleError({
        error,
        action: 'getFocusedCollection',
        resource: 'collection',
        requestObject: graphRequestObject
      }))
    })

  return response
}

/**
 * Change the focusedCollection, and get the focusedCollection metadata.
 * @param {String} collectionId The collection the user has requested to focus
 */
export const changeFocusedCollection = collectionId => (dispatch, getState) => {
  const {
    router
  } = getState()

  dispatch(updateFocusedCollection(collectionId))

  if (collectionId === '') {
    // If clearing the focused collection, also clear the focused granule
    dispatch(actions.changeFocusedGranule(''))

    eventEmitter.emit(`map.layer.${collectionId}.stickygranule`, { granule: null })

    const { location } = router
    const { search } = location

    // If clearing the focused collection, redirect the user back to the search page
    dispatch(actions.changeUrl({
      pathname: `${portalPathFromState(getState())}/search`,
      search
    }))
  } else {
    dispatch(actions.initializeCollectionGranulesQuery(collectionId))

    dispatch(actions.initializeCollectionGranulesResults(collectionId))

    dispatch(actions.getFocusedCollection())

    dispatch(actions.getTimeline())
  }
}

/**
 * Changes the focused collection and redirects the user to the focused collection route
 * @param {String} collectionId The collection id the user has requested to view details of
 */
export const viewCollectionDetails = collectionId => (dispatch, getState) => {
  dispatch(changeFocusedCollection(collectionId))

  const { router } = getState()
  const { location } = router
  const { search } = location

  dispatch(actions.changeUrl({
    pathname: `${portalPathFromState(getState())}/search/granules/collection-details`,
    search
  }))
}

/**
 * Changes the focused collection and redirects the user to the collection granules route
 * @param {String} collectionId The collection id the use has requested to view granules for
 */
export const viewCollectionGranules = collectionId => (dispatch, getState) => {
  dispatch(changeFocusedCollection(collectionId))

  const { router } = getState()
  const { location } = router
  const { search } = location

  dispatch(actions.changeUrl({
    pathname: `${portalPathFromState(getState())}/search/granules`,
    search
  }))
}
