import { CancelTokenSource, isCancel } from 'axios'

import { CollectionsSlice, ImmerStateCreator } from '../types'

// @ts-expect-error There are no types for this file
import configureStore from '../../store/configureStore'

// @ts-expect-error There are no types for this file
import actions from '../../actions'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getNlpCollection } from '../selectors/query'

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
      const existingNlp = getNlpCollection(zustandState)

      if (existingNlp) {
        await zustandState.collections.getNlpCollections()

        return
      }

      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)

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

        zustandState.errors.handleError({
          error,
          action: 'getCollections',
          resource: 'collections',
          requestObject,
          showAlertButton: true,
          title: 'Something went wrong fetching collection search results'
        })
      }
    },

    getNlpCollections: async () => {
      const { getState: reduxGetState } = configureStore()
      const reduxState = reduxGetState()
      const zustandState = get()
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)
      const nlpFromState = getNlpCollection(zustandState)
      const searchQuery = nlpFromState!.query

      let nlpRequest: NlpSearchRequest

      try {
        nlpRequest = new NlpSearchRequest(
          reduxState.authToken,
          earthdataEnvironment
        )

        const response = await nlpRequest.search({ q: searchQuery })
        const { data } = response
        const { queryInfo, collections: transformedCollections = [] } = data

        set((state) => {
          state.query.nlpCollection = queryInfo
          state.collections.collections.isLoaded = true
          state.collections.collections.isLoading = false
          state.collections.collections.count = transformedCollections.length
          state.collections.collections.items = transformedCollections
        })
      } catch (error) {
        set((state) => {
          state.collections.collections.isLoading = false
          state.collections.collections.isLoaded = false
        })

        zustandState.errors.handleError({
          error,
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
