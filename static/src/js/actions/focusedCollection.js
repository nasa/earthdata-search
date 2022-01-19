import actions from './index'

import {
  UPDATE_FOCUSED_COLLECTION,
  UPDATE_COLLECTION_SUBSCRIPTIONS
} from '../constants/actionTypes'

import { createFocusedCollectionMetadata } from '../util/focusedCollection'
import { eventEmitter } from '../events/events'
import { getApplicationConfig } from '../../../../sharedUtils/config'
import { getCollectionsQuery } from '../selectors/query'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getFocusedCollectionId } from '../selectors/focusedCollection'
import { getFocusedCollectionMetadata } from '../selectors/collectionMetadata'
import { getUsername } from '../selectors/user'
import { parseGraphQLError } from '../../../../sharedUtils/parseGraphQLError'
import { portalPathFromState } from '../../../../sharedUtils/portalPath'
import { isCSDACollection } from '../util/isCSDACollection'
import { getOpenSearchOsddLink } from '../util/getOpenSearchLink'

import GraphQlRequest from '../util/request/graphQlRequest'

/**
 * Sets the focused collection value in redux
 * @param {String} payload Concept ID of the collection to set as focused
 */
export const updateFocusedCollection = (payload) => ({
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
    router
  } = state

  // Send the relevency metric event
  dispatch(actions.collectionRelevancyMetrics())

  // Retrieve data from Redux using selectors
  const collectionsQuery = getCollectionsQuery(state)
  const earthdataEnvironment = getEarthdataEnvironment(state)
  const focusedCollectionId = getFocusedCollectionId(state)
  const focusedCollectionMetadata = getFocusedCollectionMetadata(state)
  const username = getUsername(state)

  // Use the `hasAllMetadata` flag to determine if we've requested previously
  // requested the focused collections metadata from graphql
  const {
    hasAllMetadata = false,
    isOpenSearch = false
  } = focusedCollectionMetadata

  // Determine if the user has searched using a polygon
  const { spatial } = collectionsQuery
  const { polygon } = spatial

  // CWIC does not support polygon search, if this is a CWIC collection
  // fire an action that will display a notice to the user about using a MBR
  if (isOpenSearch && polygon) {
    dispatch(actions.toggleSpatialPolygonWarning(true))
  } else {
    dispatch(actions.toggleSpatialPolygonWarning(false))
  }

  // If we already have the metadata for the focusedCollection, don't fetch it again
  if (hasAllMetadata) {
    // Ensure the granules have been retrieved
    dispatch(actions.getSearchGranules())

    return null
  }

  // Retrieve the default CMR tags to provide to the collection request
  const { defaultCmrSearchTags } = getApplicationConfig()

  const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

  const graphQuery = `
    query GetCollection(
      $id: String!
      $includeHasGranules: Boolean
      $includeTags: String
      $subscriberId: String
    ) {
      collection (
        conceptId: $id
        includeHasGranules: $includeHasGranules
        includeTags: $includeTags
      ) {
        abstract
        archiveAndDistributionInformation
        associatedDois
        boxes
        conceptId
        coordinateSystem
        dataCenter
        dataCenters
        directDistributionInformation
        doi
        hasGranules
        lines
        nativeDataFormats
        points
        polygons
        relatedUrls
        relatedCollections (
          limit: 3
        ) {
        count
        items {
            id
            title
          }
        }
        scienceKeywords
        shortName
        spatialExtent
        tags
        temporalExtents
        tilingIdentificationSystems
        title
        versionId
        services {
          count
          items {
            conceptId
            longName
            name
            type
            url
            serviceOptions
            supportedOutputProjections
            supportedReformattings
          }
        }
        granules {
          count
          items {
            conceptId
            onlineAccessFlag
          }
        }
        subscriptions (
          subscriberId: $subscriberId
        ) {
          count
          items {
            collectionConceptId
            conceptId
            name
            nativeId
            query
          }
        }
        tools {
          count
          items {
            longName
            name
            potentialAction
          }
        }
        variables {
          count
          items {
            conceptId
            definition
            longName
            name
            nativeId
            scienceKeywords
          }
        }
      }
    }`

  const response = graphQlRequestObject.search(graphQuery, {
    id: focusedCollectionId,
    includeHasGranules: true,
    includeTags: defaultCmrSearchTags.join(','),
    subscriberId: username
  })
    .then((response) => {
      const payload = []

      const {
        data: responseData
      } = response

      const { data } = responseData
      const { collection } = data

      // If no results were returned, graphql will return `null`
      if (collection) {
        const {
          abstract,
          archiveAndDistributionInformation,
          associatedDois,
          boxes,
          conceptId,
          coordinateSystem,
          dataCenter,
          dataCenters,
          granules,
          hasGranules,
          nativeDataFormats,
          relatedCollections,
          services,
          shortName,
          subscriptions,
          tags,
          tilingIdentificationSystems,
          title,
          tools,
          variables,
          versionId
        } = collection

        // Formats the metadata returned from graphql for use throughout the application
        const focusedMetadata = createFocusedCollectionMetadata(
          collection,
          authToken,
          earthdataEnvironment
        )

        payload.push({
          abstract,
          archiveAndDistributionInformation,
          associatedDois,
          boxes,
          coordinateSystem,
          dataCenter,
          granules,
          hasAllMetadata: true,
          hasGranules,
          id: conceptId,
          isCSDA: isCSDACollection(dataCenters),
          isOpenSearch: !!getOpenSearchOsddLink(collection),
          nativeDataFormats,
          relatedCollections,
          services,
          shortName,
          subscriptions,
          tags,
          tilingIdentificationSystems,
          title,
          tools,
          variables,
          versionId,
          ...focusedMetadata
        })

        // A users authToken will come back with an authenticated request if a valid token was used

        // Update metadata in the store
        dispatch(actions.updateCollectionMetadata(payload))

        // Query CMR for granules belonging to the focused collection
        dispatch(actions.getSearchGranules())

        // If any tools are SOTO, call fetchSotoLayers
        const { items } = tools
        if (items && items.some((item) => item.name.toLowerCase() === 'soto')) {
          dispatch(actions.fetchSotoLayers())
        }
      } else {
        // If no data was returned, clear the focused collection and redirect the user back to the search page
        dispatch(actions.updateFocusedCollection(''))

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
        requestObject: graphQlRequestObject
      }))
    })

  return response
}

/**
 * Request subscriptions for the focused collection
 */
export const getCollectionSubscriptions = (collectionId) => async (dispatch, getState) => {
  const state = getState()

  const {
    authToken
  } = state

  let collectionConceptId = collectionId

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)
  if (collectionId == null) {
    collectionConceptId = getFocusedCollectionId(state)
  }
  const username = getUsername(state)

  const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

  const graphQuery = `
    query GetCollectionSubscriptions(
      $collectionConceptId: String
      $subscriberId: String
    ) {
      subscriptions(
        collectionConceptId: $collectionConceptId
        subscriberId: $subscriberId
      ) {
        count
        items {
          collectionConceptId
          conceptId
          name
          nativeId
          query
        }
      }
    }`

  const response = graphQlRequestObject.search(graphQuery, {
    collectionConceptId,
    subscriberId: username
  })
    .then((response) => {
      parseGraphQLError(response)

      const {
        data: responseData
      } = response.data

      const { subscriptions } = responseData

      dispatch({
        type: UPDATE_COLLECTION_SUBSCRIPTIONS,
        payload: {
          collectionId: collectionConceptId,
          subscriptions
        }
      })
    })
    .catch((error) => {
      dispatch(actions.handleError({
        error,
        action: 'getCollectionSubscriptions',
        resource: 'subscription',
        requestObject: graphQlRequestObject
      }))
    })

  return response
}

/**
 * Change the focusedCollection, and get the focusedCollection metadata.
 * @param {String} collectionId The collection id the user has requested to focus
 */
export const changeFocusedCollection = (collectionId) => (dispatch, getState) => {
  dispatch(actions.updateFocusedCollection(collectionId))

  if (collectionId === '') {
    // If clearing the focused collection, also clear the focused granule
    dispatch(actions.changeFocusedGranule(''))
    // And clear the spatial polygon warning if there is no focused collection
    dispatch(actions.toggleSpatialPolygonWarning(false))

    eventEmitter.emit(`map.layer.${collectionId}.stickygranule`, { granule: null })

    const { router } = getState()
    const { location } = router
    const { search } = location

    // If clearing the focused collection, redirect the user back to the search page
    dispatch(actions.changeUrl({
      pathname: `${portalPathFromState(getState())}/search`,
      search
    }))
  } else {
    // Initialize a nested query element in Redux for the new focused collection
    dispatch(actions.initializeCollectionGranulesQuery(collectionId))

    // Initialize a nested search results element in Redux for the new focused collection
    dispatch(actions.initializeCollectionGranulesResults(collectionId))

    // Fetch the focused collection metadata
    dispatch(actions.getFocusedCollection())

    // Fetch timeline data for the focused collection
    dispatch(actions.getTimeline())
  }
}

/**
 * Changes the focused collection and redirects the user to the focused collection route
 * @param {String} collectionId The collection id the user has requested to view details of
 */
export const viewCollectionDetails = (collectionId) => (dispatch, getState) => {
  // Update the focused collection in redux and retrieve its metadata
  dispatch(actions.changeFocusedCollection(collectionId))

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
 * @param {String} collectionId The collection id the user has requested to view granules for
 */
export const viewCollectionGranules = (collectionId) => (dispatch, getState) => {
  // Update the focused collection in redux and retrieve its metadata
  dispatch(actions.changeFocusedCollection(collectionId))

  const { router } = getState()
  const { location } = router
  const { search } = location

  dispatch(actions.changeUrl({
    pathname: `${portalPathFromState(getState())}/search/granules`,
    search
  }))
}
