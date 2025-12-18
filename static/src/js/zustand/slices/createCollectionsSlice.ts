import { CancelTokenSource, isCancel } from 'axios'
import { isEmpty } from 'lodash-es'

import { CollectionsSlice, ImmerStateCreator } from '../types'

// @ts-expect-error There are no types for this file
import configureStore from '../../store/configureStore'

// @ts-expect-error There are no types for this file
import actions from '../../actions'

import { getEdlToken } from '../selectors/user'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

import addShapefile from '../../util/addShapefile'
// @ts-expect-error There are no types for this file
import CollectionRequest from '../../util/request/collectionRequest'
// @ts-expect-error There are no types for this file
import NlpSearchRequest from '../../util/request/nlpSearchRequest'
// @ts-expect-error There are no types for this file
import { buildCollectionSearchParams, prepareCollectionParams } from '../../util/collections'

import type { ShapefileFile } from '../../types/sharedTypes'

const initialState = {
  count: 0,
  isLoaded: false,
  isLoading: false,
  loadTime: 0,
  items: []
}

let cancelToken: CancelTokenSource

const createCollectionsSlice: ImmerStateCreator<CollectionsSlice> = (set, get) => ({
  collections: {
    collections: initialState,

    getCollections: async () => {
      const zustandState = get()

      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const edlToken = getEdlToken(zustandState)
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)

      // If cancel token is set, cancel the previous request(s)
      if (cancelToken) {
        cancelToken.cancel()
      }

      const collectionParams = prepareCollectionParams(reduxState)

      const {
        pageNum
      } = collectionParams

      if (pageNum === 1) {
        // If this is the first page, reset the items
        set((state) => {
          state.collections.collections.items = []
        })
      }

      const timerStart = Date.now()
      set((state) => {
        state.collections.collections.isLoading = true
      })

      reduxDispatch(actions.onFacetsLoading())

      const requestObject = new CollectionRequest(edlToken, earthdataEnvironment)

      cancelToken = requestObject.getCancelToken()

      try {
        const response = await requestObject.search(buildCollectionSearchParams(collectionParams))

        const { data, headers } = response

        const cmrHits = parseInt(headers['cmr-hits'], 10)

        const { feed = {} } = data
        const {
          entry = [],
          facets = {}
        } = feed
        const { children = [] } = facets

        // Update the store with the new values
        set((state) => {
          state.collections.collections.count = cmrHits
          state.collections.collections.loadTime = Date.now() - timerStart
          state.collections.collections.isLoaded = true
          state.collections.collections.isLoading = false
          state.collections.collections.items = state.collections.collections.items.concat(entry)
        })

        reduxDispatch(actions.onFacetsLoaded({
          loaded: true
        }))

        reduxDispatch(actions.updateFacets({
          facets: children
        }))
      } catch (error) {
        if (isCancel(error)) return

        set((state) => {
          state.collections.collections.loadTime = Date.now() - timerStart
          state.collections.collections.isLoading = false
          state.collections.collections.isLoaded = false
        })

        reduxDispatch(actions.onFacetsErrored())

        reduxDispatch(actions.onFacetsLoaded({
          loaded: false
        }))

        zustandState.errors.handleError({
          error: error as Error,
          action: 'getCollections',
          resource: 'collections',
          requestObject,
          showAlertButton: true,
          title: 'Something went wrong fetching collection search results'
        })
      }
    },

    getNlpCollections: async (query) => {
      const zustandState = get()
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)

      let nlpRequest: NlpSearchRequest

      const collectionParams = prepareCollectionParams({})
      const searchParams = buildCollectionSearchParams(collectionParams)

      set((state) => {
        state.collections.collections.isLoading = true
      })

      try {
        const timerStart = Date.now()
        nlpRequest = new NlpSearchRequest(earthdataEnvironment)

        const response = await nlpRequest.search({
          embedding: false,
          q: query,
          search_params: {
            ...searchParams,
            options: {
              temporal: {
                limit_to_granules: true
              }
            }
          }
        })

        const { data, headers } = response
        const cmrHits = parseInt(headers['cmr-hits'], 10)

        const {
          metadata,
          queryInfo
        } = data

        const { feed } = metadata
        const { entry, facets = {} } = feed
        const { children = [] } = facets

        const { spatial } = queryInfo

        if (!isEmpty(spatial)) {
          const { geoJson, geoLocation } = spatial || {}

          // Ensure the geoJson is a FeatureCollection
          let featureCollection: ShapefileFile = geoJson
          if (geoJson.type !== 'FeatureCollection') {
            featureCollection = {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: geoJson,
                properties: {}
              }]
            }
          }

          // Add nlpGenerated property to each feature
          featureCollection.features = featureCollection.features.map((feature) => {
            const { properties = {} } = feature

            return {
              ...feature,
              properties: {
                ...properties,
                nlpGenerated: true
              }
            }
          })

          // Calculate the size of the geoJson
          const { size: sizeInBytes } = new Blob([JSON.stringify(geoJson)])

          const sizeInKB = sizeInBytes / 1024
          let size = `${sizeInKB.toFixed(2)} KB`

          // If the size is greater than 1 MB, convert to MB
          if (sizeInKB > 1024) {
            const sizeInMB = sizeInKB / 1024
            size = `${sizeInMB.toFixed(2)} MB`
          }

          // Add the shapefile to the store
          addShapefile({
            file: featureCollection,
            filename: geoLocation,
            size,
            updateQuery: false
          })
        }

        set((state) => {
          state.query.collection = {
            ...state.query.collection,
            ...queryInfo
          }

          state.collections.collections.count = cmrHits
          state.collections.collections.isLoaded = true
          state.collections.collections.isLoading = false
          state.collections.collections.items = entry
          state.collections.collections.loadTime = Date.now() - timerStart
        })

        const {
          dispatch: reduxDispatch
        } = configureStore()

        reduxDispatch(actions.onFacetsLoaded({
          loaded: true
        }))

        reduxDispatch(actions.updateFacets({
          facets: children
        }))
      } catch (error) {
        set((state) => {
          state.collections.collections.isLoading = false
          state.collections.collections.isLoaded = false
        })

        zustandState.errors.handleError({
          error: error as Error,
          action: 'getNlpCollections',
          resource: 'nlpSearch',
          requestObject: nlpRequest,
          showAlertButton: true,
          title: 'Something went wrong fetching collection search results'
        })
      }
    }
  }
})

export default createCollectionsSlice
