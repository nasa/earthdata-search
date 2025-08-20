import type {
  CollectionSlice,
  GranuleQuery,
  ImmerStateCreator
} from '../types'

// @ts-expect-error There are no types for this file
import { getApplicationConfig } from '../../../../../sharedUtils/config'

// @ts-expect-error There are no types for this file
import GraphQlRequest from '../../util/request/graphQlRequest'
import { type DataWithSpatial, pruneSpatial } from '../../util/pruneSpatial'
// @ts-expect-error There are no types for this file
import { retrieveVariablesRequest } from '../../util/retrieveVariablesRequest'
// @ts-expect-error There are no types for this file
import { createFocusedCollectionMetadata } from '../../util/focusedCollection'
// @ts-expect-error There are no types for this file
import { isCSDACollection } from '../../util/isCSDACollection'

// @ts-expect-error There are no types for this file
import { getValueForTag } from '../../../../../sharedUtils/tags'
// @ts-expect-error There are no types for this file
import { getOpenSearchOsddLink } from '../../../../../sharedUtils/getOpenSearchOsddLink'

// @ts-expect-error There are no types for this file
import configureStore from '../../store/configureStore'

// @ts-expect-error There are no types for this file
import actions from '../../actions'

// @ts-expect-error There are no types for this file
import { getUsername } from '../../selectors/user'

import { getCollectionsQuery } from '../selectors/query'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getCollectionId, getFocusedCollectionMetadata } from '../selectors/collection'
import GET_COLLECTION from '../../operations/queries/getCollection'

const createCollectionSlice: ImmerStateCreator<CollectionSlice> = (set, get) => ({
  collection: {
    collectionId: null,
    collectionMetadata: {},

    getCollectionMetadata: async () => {
      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const {
        authToken,
        router
      } = reduxState

      // Send the relevency metric event
      reduxDispatch(actions.collectionRelevancyMetrics())

      const zustandState = get()
      const collectionsQuery = getCollectionsQuery(zustandState)
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)
      const focusedCollectionId = getCollectionId(zustandState)
      const focusedCollectionMetadata = getFocusedCollectionMetadata(zustandState)

      const username = getUsername(reduxState)

      // Use the `hasAllMetadata` flag to determine if we've requested previously
      // requested the focused collections metadata from graphql
      const {
        hasAllMetadata = false,
        isOpenSearch = false
      } = focusedCollectionMetadata

      // Determine if the user has searched using a polygon
      const { spatial } = collectionsQuery
      const { polygon } = pruneSpatial(spatial as DataWithSpatial)

      // CWIC does not support polygon search, if this is a CWIC collection
      // fire an action that will display a notice to the user about using a MBR
      if (isOpenSearch && polygon) {
        reduxDispatch(actions.toggleSpatialPolygonWarning(true))
      } else {
        reduxDispatch(actions.toggleSpatialPolygonWarning(false))
      }

      // Ensure the granules have been retrieved
      get().granules.getGranules()

      // If we already have the metadata for the focusedCollection, don't fetch it again
      if (hasAllMetadata) {
        return null
      }

      // Retrieve the default CMR tags to provide to the collection request
      const { defaultCmrSearchTags, maxCmrPageSize } = getApplicationConfig()

      const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

      try {
        const response = await graphQlRequestObject.search(GET_COLLECTION, {
          params: {
            conceptId: focusedCollectionId,
            includeHasGranules: true,
            includeTags: defaultCmrSearchTags.join(',')
          },
          subcriptionParams: {
            subscriberId: username
          },
          variableParams: {
            limit: maxCmrPageSize
          }
        })

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
            cloudHosted,
            conceptId,
            coordinateSystem,
            dataCenter,
            dataCenters,
            duplicateCollections,
            granules,
            hasGranules,
            lines,
            nativeDataFormats,
            points,
            polygons,
            relatedCollections,
            services,
            shortName,
            subscriptions,
            tags,
            tilingIdentificationSystems,
            timeEnd,
            timeStart,
            title,
            tools,
            variables,
            versionId
          } = collection

          // Retrieves all variables if there are more than `maxCmrPageSize`
          if (variables && variables.count > maxCmrPageSize) {
            variables.items = await retrieveVariablesRequest(
              variables,
              {
                params: {
                  conceptId: focusedCollectionId,
                  includeHasGranules: true
                },
                variableParams: {
                  limit: maxCmrPageSize,
                  cursor: variables.cursor
                }
              },
              graphQlRequestObject
            )

            if (variables.cursor) delete variables.cursor
          }

          // Look and see if there are any gibs tags
          // If there are, check to see if the colormaps associated with the productids in the tags exists.
          // If they don't we call an action to pull the colorMaps and add them to the metadata.colormaps
          const gibsTags = tags ? getValueForTag('gibs', tags) : null
          if (gibsTags && gibsTags.length > 0) {
            const { product } = gibsTags[0]
            reduxDispatch(actions.getColorMap({ product }))
          }

          // Formats the metadata returned from graphql for use throughout the application
          const focusedMetadata = createFocusedCollectionMetadata(
            collection,
            authToken,
            earthdataEnvironment
          )

          const collectionMetadata = {
            abstract,
            archiveAndDistributionInformation,
            associatedDois,
            boxes,
            cloudHosted,
            coordinateSystem,
            dataCenter,
            duplicateCollections,
            granules,
            hasAllMetadata: true,
            hasGranules,
            id: conceptId,
            isCSDA: isCSDACollection(dataCenters),
            isOpenSearch: !!getOpenSearchOsddLink(collection),
            lines,
            nativeDataFormats,
            points,
            polygons,
            relatedCollections,
            services,
            shortName,
            subscriptions,
            tags,
            tilingIdentificationSystems,
            timeEnd,
            timeStart,
            title,
            tools,
            variables,
            versionId,
            ...focusedMetadata
          }

          // Update metadata in the store
          set((state) => {
            state.collection.collectionMetadata[conceptId] = collectionMetadata
          })
        } else {
          // If no data was returned, clear the focused collection and redirect the user back to the search page
          set((state) => {
            state.collection.collectionId = null
          })

          const { location } = router
          const { search } = location

          reduxDispatch(actions.changeUrl({
            pathname: '/search',
            search
          }))
        }

        return response
      } catch (error) {
        reduxDispatch(actions.handleError({
          error,
          action: 'getCollectionMetadata',
          resource: 'collection',
          requestObject: graphQlRequestObject
        }))

        return null
      }
    },

    setCollectionId: async (collectionId) => {
      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      set((state) => {
        state.collection.collectionId = collectionId
      })

      const { router } = reduxState
      const { location } = router
      const { pathname, search } = location

      const isProjectPage = pathname.includes('/project')
      if (!collectionId && isProjectPage) return

      if (!collectionId || collectionId === '') {
        // If clearing the focused collection, also clear the focused granule
        get().granule.setGranuleId(null)
        // And clear the spatial polygon warning if there is no focused collection
        reduxDispatch(actions.toggleSpatialPolygonWarning(false))

        // If clearing the focused collection, redirect the user back to the search page
        reduxDispatch(actions.changeUrl({
          pathname: '/search',
          search
        }))
      } else {
        // Initialize a nested query element for the new focused collection
        const {
          preferences,
          query,
          timeline
        } = get()
        const { preferences: preferencesValues } = preferences
        const { granuleSort: granuleSortPreference } = preferencesValues

        const granuleQuery = {} as GranuleQuery

        if (granuleSortPreference !== 'default') {
          granuleQuery.sortKey = granuleSortPreference
        }

        const { initializeGranuleQuery } = query
        initializeGranuleQuery({
          collectionId,
          query: granuleQuery
        })

        // Fetch the focused collection metadata
        get().collection.getCollectionMetadata()

        // Fetch timeline data for the focused collection
        const { getTimeline } = timeline
        getTimeline()
      }
    },

    updateGranuleSubscriptions: (collectionId, subscriptions) => {
      set((state) => {
        state.collection.collectionMetadata[collectionId].subscriptions = subscriptions
      })
    },

    viewCollectionDetails: async (collectionId) => {
      get().collection.setCollectionId(collectionId)

      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()

      const reduxState = reduxGetState()
      const { router } = reduxState
      const { location } = router
      const { search } = location

      reduxDispatch(actions.changeUrl({
        pathname: '/search/granules/collection-details',
        search
      }))
    },

    viewCollectionGranules: async (collectionId) => {
      get().collection.setCollectionId(collectionId)

      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()

      const reduxState = reduxGetState()
      const { router } = reduxState
      const { location } = router
      const { search } = location

      reduxDispatch(actions.changeUrl({
        pathname: '/search/granules',
        search
      }))
    }
  }
})

export default createCollectionSlice
