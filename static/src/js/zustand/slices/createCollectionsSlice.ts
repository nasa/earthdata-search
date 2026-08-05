import { CancelTokenSource, isCancel } from 'axios'

import { CollectionsSlice, ImmerStateCreator } from '../types'

import { getEdlToken } from '../selectors/user'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

import CollectionRequest from '../../util/request/collectionRequest'
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

      const edlToken = getEdlToken(zustandState)
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)

      // If cancel token is set, cancel the previous request(s)
      if (cancelToken) {
        cancelToken.cancel()
      }

      const collectionParams = prepareCollectionParams()

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
        state.facets.facets.isLoaded = false
        state.facets.facets.isLoading = true
      })

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

        zustandState.facets.facets.updateFacets(children)
      } catch (error) {
        if (isCancel(error)) return

        set((state) => {
          state.collections.collections.loadTime = Date.now() - timerStart
          state.collections.collections.isLoading = false
          state.collections.collections.isLoaded = false

          state.facets.facets.isLoading = false
          state.facets.facets.isLoaded = false
        })

        zustandState.errors.handleError({
          error: error as Error,
          action: 'getCollections',
          resource: 'collections',
          requestObject,
          showAlertButton: true,
          title: 'Something went wrong fetching collection search results'
        })
      }
    }
  }
})

export default createCollectionsSlice
