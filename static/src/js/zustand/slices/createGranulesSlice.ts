import { CancelTokenSource, isCancel } from 'axios'
// @ts-expect-error There are no types for this file
import { mbr } from '@edsc/geo-utils'

import { getCollectionId, getFocusedCollectionMetadata } from '../selectors/collection'
import { getCollectionsById } from '../selectors/collections'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

import type { GranulesSlice, ImmerStateCreator } from '../types'

// @ts-expect-error There are no types for this file
import GranuleRequest from '../../util/request/granuleRequest'
// @ts-expect-error There are no types for this file
import OpenSearchGranuleRequest from '../../util/request/openSearchGranuleRequest'

// @ts-expect-error There are no types for this file
import configureStore from '../../store/configureStore'

// @ts-expect-error There are no types for this file
import actions from '../../actions'

import {
  populateGranuleResults,
  prepareGranuleParams,
  buildGranuleSearchParams,
  extractGranuleSearchParams
// @ts-expect-error There are no types for this file
} from '../../util/granules'

const initialState = {
  collectionConceptId: null,
  count: null,
  isLoaded: false,
  isLoading: false,
  loadTime: 0,
  items: []
}

// Cancel token to cancel pending search requests
const granuleSearchCancelTokens: Record<string, CancelTokenSource | undefined> = {}

const createGranulesSlice: ImmerStateCreator<GranulesSlice> = (set, get) => ({
  granules: {
    granules: initialState,

    getGranules: async () => {
      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const currentState = get()
      const earthdataEnvironment = getEarthdataEnvironment(currentState)
      const collectionId = getCollectionId(currentState)
      const collectionMetadata = getFocusedCollectionMetadata(currentState)
      const collections = getCollectionsById(currentState)
      const collectionById = collections[collectionId]

      const { authToken } = reduxState

      // Extract granule search parameters from redux specific to the focused collection
      const extractedGranuleParams = extractGranuleSearchParams(collectionId)

      // Format and structure data from Redux to be sent to CMR
      const granuleParams = prepareGranuleParams(
        // Use focusedCollection and collection search results together to build the granule
        // search parameters. This will ensure isOpenSearch can be properly determined before
        // retrieving full collection metadata
        {
          ...collectionMetadata,
          ...collectionById
        },
        extractedGranuleParams
      )

      // If cancel token is set, cancel the previous request(s)
      if (granuleSearchCancelTokens[collectionId]) {
        granuleSearchCancelTokens[collectionId].cancel()
        granuleSearchCancelTokens[collectionId] = undefined
      }

      const {
        isOpenSearch,
        pageNum
      } = granuleParams

      if (pageNum === 1) {
        // If the collection ID matches the collectionConceptId already saved, and the collection is
        // not OpenSearch, don't fetch granules.
        // In `getCollectionMetadata` we call `getGranules` as soon as we can to fetch CMR granules right away.
        // But that request will be empty for OpenSearch collections, which aren't stored in CMR.
        // So after the collection metadata is returned we call `getGranules` again. This results
        // in a double fetch for OpenSearch Granules, but the two requests are made to different
        // endpoints. This `if` ensures we don't double fetch CMR granules.
        // TODO This is causing a double fetch for OpenSearch granules (both to the same OpenSearch endpoint)
        // TODO when loaded from the search results. The first request gets cancelled, but it would be nice to avoid that
        if (
          collectionId === currentState.granules.granules.collectionConceptId
          && !isOpenSearch
        ) {
          return
        }

        // Clear out the current results if a new set of pages has been requested
        set((state) => {
          state.granules.granules.items = []
        })
      }

      const timerStart = Date.now()
      set((state) => {
        state.granules.granules.isLoading = true
      })

      reduxDispatch(actions.toggleSpatialPolygonWarning(false))

      const searchParams = buildGranuleSearchParams(granuleParams)

      let requestObject = null

      // TODO can I replace this with a single page of fetchGranuleLinks? Maybe just the opensearch call
      if (isOpenSearch) {
        requestObject = new OpenSearchGranuleRequest(authToken, earthdataEnvironment, collectionId)

        const { polygon } = searchParams

        // OpenSearch does not support polygon searches, replace the polygon spatial with a minimum bounding rectangle
        if (polygon) {
          reduxDispatch(actions.toggleSpatialPolygonWarning(true))

          const {
            swLat,
            swLng,
            neLat,
            neLng
          } = mbr({ polygon: polygon[0] })

          // Construct a string with points in the order expected by OpenSearch
          searchParams.boundingBox = [swLng, swLat, neLng, neLat].join(',')

          // Remove the unsupported polygon parameter
          delete searchParams.polygon
        }
      } else {
        requestObject = new GranuleRequest(authToken, earthdataEnvironment)
      }

      granuleSearchCancelTokens[collectionId] = requestObject.getCancelToken()

      try {
        const response = await requestObject.search(searchParams)

        const payload = populateGranuleResults({
          collectionId,
          isOpenSearch,
          response
        })

        const { data } = response
        const { feed } = data
        const { entry } = feed

        // Update the store with the new values
        set((state) => {
          state.granules.granules.collectionConceptId = collectionId
          state.granules.granules.count = payload.count
          state.granules.granules.loadTime = Date.now() - timerStart
          state.granules.granules.isLoaded = true
          state.granules.granules.isLoading = false
          state.granules.granules.items = state.granules.granules.items.concat(entry)
        })
      } catch (error) {
        if (isCancel(error)) return

        set((state) => {
          state.granules.granules.loadTime = Date.now() - timerStart
          state.granules.granules.isLoading = false
          state.granules.granules.isLoaded = false
        })

        reduxDispatch(actions.handleError({
          error,
          action: 'getGranules',
          resource: 'granules',
          requestObject,
          showAlertButton: true,
          title: 'Something went wrong fetching collection results'
        }))
      }
    }
  }
})

export default createGranulesSlice
