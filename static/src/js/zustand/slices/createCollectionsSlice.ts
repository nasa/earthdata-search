import { CancelTokenSource, isCancel } from 'axios'
import { CollectionsSlice, ImmerStateCreator } from '../types'

// @ts-expect-error There are no types for this file
import configureStore from '../../store/configureStore'

// @ts-expect-error There are no types for this file
import actions from '../../actions'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

// @ts-expect-error There are no types for this file
import CollectionRequest from '../../util/request/collectionRequest'
// @ts-expect-error There are no types for this file
import NlpSearchRequest from '../../util/request/nlpSearchRequest'
// @ts-expect-error There are no types for this file
import { buildCollectionSearchParams, prepareCollectionParams } from '../../util/collections'

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
      if (zustandState.query.nlpCollection) {
        await zustandState.collections.getNlpCollections()

        return
      }

      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const earthdataEnvironment = getEarthdataEnvironment(get())

      // If cancel token is set, cancel the previous request(s)
      if (cancelToken) {
        cancelToken.cancel()
      }

      const collectionParams = prepareCollectionParams(reduxState)

      const {
        authToken,
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

      const requestObject = new CollectionRequest(authToken, earthdataEnvironment)

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

        reduxDispatch(actions.handleError({
          error,
          action: 'getCollections',
          resource: 'collections',
          requestObject
        }))
      }
    },

    getNlpCollections: async () => {
      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const earthdataEnvironment = getEarthdataEnvironment(get())
      const zustandState = get()
      const searchQuery = zustandState.query.nlpCollection!.query

      try {
        const nlpRequest = new NlpSearchRequest(reduxState.authToken, earthdataEnvironment)
        const response = await nlpRequest.search({ q: searchQuery })

        const nlpData = nlpRequest.transformResponse(response, searchQuery)

        if (nlpData.spatial || nlpData.temporal) {
          const currentState = get()
          currentState.query.setNlpCollection(nlpData)
        }

        const { data } = response
        const { metadata = {} } = data
        const { feed = {} } = metadata
        const { entry: collections = [] } = feed

        const collectionRequest = new CollectionRequest(
          reduxState.authToken,
          earthdataEnvironment
        )
        type TransformedFeed = { feed: { entry: import('../../types/sharedTypes').CollectionMetadata[] } }
        const transformed: TransformedFeed = collectionRequest.transformResponse({
          feed: { entry: collections }
        }) as TransformedFeed
        const transformedCollections = transformed.feed.entry || []

        set((state) => {
          state.collections.collections.isLoaded = true
          state.collections.collections.isLoading = false
          state.collections.collections.count = collections.length
          state.collections.collections.items = transformedCollections
        })
      } catch (error) {
        set((state) => {
          state.collections.collections.isLoading = false
          state.collections.collections.isLoaded = false
        })

        reduxDispatch(actions.handleError({
          error,
          action: 'getNlpCollections',
          resource: 'nlpSearch',
          requestObject: new NlpSearchRequest(reduxState.authToken, earthdataEnvironment)
        }))
      }
    }
  }
})

export default createCollectionsSlice
