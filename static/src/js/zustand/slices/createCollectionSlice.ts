import GET_COLORMAPS from '../../operations/queries/getColorMaps'
import type {
  CollectionSlice,
  GranuleQuery,
  ImmerStateCreator
} from '../types'
// @ts-expect-error There are no types for this file
import getApolloClient from '../../providers/getApolloClient'

import routerHelper, { type Router } from '../../router/router'

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

import { getCollectionsQuery } from '../selectors/query'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getCollectionId, getFocusedCollectionMetadata } from '../selectors/collection'
import {
  getEdlToken,
  getSitePreferences,
  getUsername
} from '../selectors/user'

import GET_COLLECTION from '../../operations/queries/getCollection'

import { routes } from '../../constants/routes'

const createCollectionSlice: ImmerStateCreator<CollectionSlice> = (set, get) => ({
  collection: {
    collectionId: null,
    collectionMetadata: {},

    getCollectionMetadata: async () => {
      const {
        dispatch: reduxDispatch
      } = configureStore()

      const { location } = routerHelper.router?.state || {} as Router['state']
      const { search } = location

      const zustandState = get()
      const edlToken = getEdlToken(zustandState)
      const collectionsQuery = getCollectionsQuery(zustandState)
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)
      const focusedCollectionId = getCollectionId(zustandState)
      const focusedCollectionMetadata = getFocusedCollectionMetadata(zustandState)

      const username = getUsername(zustandState)

      if (!focusedCollectionId) {
        reduxDispatch(actions.changeUrl({
          pathname: routes.SEARCH,
          search
        }))

        return
      }

      // Send the relevancy metric event
      reduxDispatch(actions.collectionRelevancyMetrics())

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

      // Fetch granules for the focused collection.
      // This will ensure CMR granules are retrieved as soon as possible.
      get().granules.getGranules()

      // If we already have the metadata for the focusedCollection, don't fetch it again
      if (hasAllMetadata) {
        return
      }

      // Retrieve the default CMR tags to provide to the collection request
      const { defaultCmrSearchTags, maxCmrPageSize } = getApplicationConfig()

      const graphQlRequestObject = new GraphQlRequest(edlToken, earthdataEnvironment)

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
            consortiums,
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
          console.log('🚀 ~ file: createCollectionSlice.ts:197 ~ tags:', tags)
          const gibsTags = tags ? getValueForTag('gibs', tags) : null
          console.log('🚀 ~ file: createCollectionSlice.ts:198 ~ gibsTags:', gibsTags)
          // Update the map layers with the gibs tags

          let colormaps = {}
          if (gibsTags && gibsTags.length > 0) {
            get().map.setMapLayers(focusedCollectionId, gibsTags)
            // Update the map layers with the gibs tags
            const products = gibsTags.map((gibsTag: { product: string }) => gibsTag.product)
            const edlToken = getEdlToken(zustandState)

            try {
              const apolloClient = getApolloClient({
                authToken,
                earthdataEnvironment,
                edlToken
              })
              console.log('🚀 ~ file: createCollectionSlice.ts:213 ~ apolloClient:', !!apolloClient)
              console.log('🚀 ~ file: createCollectionSlice.ts:214 ~ products:', products)

              console.log('🚀 ~ file: createCollectionSlice.ts:216 ~ GraphQL query:', GET_COLORMAPS)
              console.log('🚀 ~ file: createCollectionSlice.ts:217 ~ variables:', { products })

              let colormapsData = []
              // TODO do we need the errorpolicy
              try {
                const { data: colormapsResponse, errors } = await apolloClient.query({
                  query: GET_COLORMAPS,
                  variables: { products },
                  errorPolicy: 'all'
                })

                console.log('🚀 ~ file: createCollectionSlice.ts:223 ~ colormapsResponse:', colormapsResponse)
                console.log('🚀 ~ file: createCollectionSlice.ts:224 ~ errors:', errors)
                colormapsData = colormapsResponse?.colormaps || []
              } catch (apolloError) {
                console.error('🚀 ~ file: createCollectionSlice.ts:227 ~ Apollo Client Error:', apolloError)
                throw apolloError
              }

              console.log('🚀 ~ file: createCollectionSlice.ts:232 ~ colormapsData:', colormapsData)

              if (colormapsData && colormapsData.length > 0) {
                console.log('🚀 ~ file: createCollectionSlice.ts:236 ~ colormapsData:', colormapsData)
                // Store colormaps in the collection metadata
                const colormapsMetadata: Record<string, unknown> = {}
                colormapsData.forEach((colormap: { product: string; jsonData: unknown }) => {
                  if (colormap.jsonData) {
                    colormapsMetadata[colormap.product] = colormap.jsonData
                  }
                })

                console.log('🚀 ~ file: createCollectionSlice.ts:256 ~ colormapsMetadata:', colormapsMetadata)

                // Update collection metadata with colormap data
                colormaps = colormapsMetadata
                // Set((state) => {
                // state.collection.collectionMetadata[conceptId].colormaps = colormapsMetadata

                // If (state.collection.collectionMetadata[conceptId]) {
                //   debugger
                //   state.collection.collectionMetadata[conceptId].colormaps = colormapsMetadata
                // }
                // })
              }
            } catch (error) {
              console.error('Error loading colormaps:', error)
            }
          }

          // Formats the metadata returned from graphql for use throughout the application
          const focusedMetadata = createFocusedCollectionMetadata(
            collection,
            edlToken,
            earthdataEnvironment
          )

          const collectionMetadata = {
            abstract,
            archiveAndDistributionInformation,
            associatedDois,
            boxes,
            cloudHosted,
            coordinateSystem,
            conceptId,
            colormaps,
            consortiums: consortiums || [],
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

          // Fetch granules for the focused collection.
          // This will ensure OpenSearch granules are retrieved correctly, after the collection
          // metadata is loaded with the isOpenSearch flag
          get().granules.getGranules()
        } else {
          // If no data was returned, clear the focused collection and redirect the user back to the search page
          set((state) => {
            state.collection.collectionId = null
          })

          reduxDispatch(actions.changeUrl({
            pathname: routes.SEARCH,
            search
          }))
        }
      } catch (error) {
        zustandState.errors.handleError({
          error: error as Error,
          action: 'getCollectionMetadata',
          resource: 'collection',
          requestObject: graphQlRequestObject,
          showAlertButton: true,
          title: 'Something went wrong fetching the collection metadata'
        })
      }
    },

    setCollectionId: async (collectionId) => {
      const {
        dispatch: reduxDispatch
      } = configureStore()

      set((state) => {
        state.collection.collectionId = collectionId
      })

      const { location } = routerHelper.router?.state || {} as Router['state']
      const { pathname, search } = location

      const isProjectPage = pathname.includes(routes.PROJECT)
      if (!collectionId && isProjectPage) return

      if (!collectionId || collectionId === '') {
        // If clearing the focused collection, also clear the focused granule
        get().granule.setGranuleId(null)
        // And clear the spatial polygon warning if there is no focused collection
        reduxDispatch(actions.toggleSpatialPolygonWarning(false))

        // If clearing the focused collection, redirect the user back to the search page
        reduxDispatch(actions.changeUrl({
          pathname: routes.SEARCH,
          search
        }))
      } else {
        // Initialize a nested query element for the new focused collection
        const zustandState = get()
        const {
          query,
          timeline
        } = zustandState

        const { granuleSort: granuleSortPreference } = getSitePreferences(zustandState)

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
        dispatch: reduxDispatch
      } = configureStore()

      const { location } = routerHelper.router?.state || {} as Router['state']
      const { search } = location

      reduxDispatch(actions.changeUrl({
        pathname: routes.COLLECTION_DETAILS,
        search
      }))
    },

    viewCollectionGranules: async (collectionId) => {
      get().collection.setCollectionId(collectionId)

      const {
        dispatch: reduxDispatch
      } = configureStore()

      const { location } = routerHelper.router?.state || {} as Router['state']
      const { search } = location

      reduxDispatch(actions.changeUrl({
        pathname: routes.GRANULES,
        search
      }))
    }
  }
})

export default createCollectionSlice
