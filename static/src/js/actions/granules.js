import { isCancel } from 'axios'
import { isEmpty } from 'lodash-es'
import { mbr } from '@edsc/geo-utils'
import 'array-foreach-async'
import { stringify } from 'qs'

import actions from './index'
import {
  populateGranuleResults,
  prepareGranuleParams,
  buildGranuleSearchParams,
  extractGranuleSearchParams
} from '../util/granules'
import GranuleRequest from '../util/request/granuleRequest'
import OpenSearchGranuleRequest from '../util/request/openSearchGranuleRequest'
import {
  ADD_GRANULE_METADATA,
  ADD_MORE_GRANULE_RESULTS,
  ERRORED_GRANULES,
  EXCLUDE_GRANULE_ID,
  FINISHED_GRANULES_TIMER,
  INITIALIZE_COLLECTION_GRANULES_RESULTS,
  LOADED_GRANULES,
  LOADING_GRANULES,
  RESET_GRANULE_RESULTS,
  SET_GRANULE_LINKS_LOADED,
  SET_GRANULE_LINKS_LOADING,
  STARTED_GRANULES_TIMER,
  UNDO_EXCLUDE_GRANULE_ID,
  UPDATE_GRANULE_LINKS,
  UPDATE_GRANULE_METADATA,
  UPDATE_GRANULE_RESULTS,
  INITIALIZE_COLLECTION_GRANULES_QUERY
} from '../constants/actionTypes'
import { toggleSpatialPolygonWarning } from './ui'
import { getFocusedCollectionMetadata } from '../selectors/collectionMetadata'
import { getFocusedCollectionId } from '../selectors/focusedCollection'
import { getProjectCollectionsIds } from '../zustand/selectors/project'
import { eventEmitter } from '../events/events'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getApplicationConfig } from '../../../../sharedUtils/config'
import RetrievalRequest from '../util/request/retrievalRequest'
import useEdscStore from '../zustand/useEdscStore'

const { granuleLinksPageSize, openSearchGranuleLinksPageSize } = getApplicationConfig()

export const addMoreGranuleResults = (payload) => ({
  type: ADD_MORE_GRANULE_RESULTS,
  payload
})

export const updateGranuleResults = (payload) => ({
  type: UPDATE_GRANULE_RESULTS,
  payload
})

export const resetGranuleResults = (payload) => ({
  type: RESET_GRANULE_RESULTS,
  payload
})

export const updateGranuleMetadata = (payload) => ({
  type: UPDATE_GRANULE_METADATA,
  payload
})

export const addGranuleMetadata = (payload) => ({
  type: ADD_GRANULE_METADATA,
  payload
})

export const onGranulesLoading = (payload) => ({
  type: LOADING_GRANULES,
  payload
})

export const onGranulesLoaded = (payload) => ({
  type: LOADED_GRANULES,
  payload
})

export const onGranulesErrored = () => ({
  type: ERRORED_GRANULES
})

export const startGranulesTimer = (payload) => ({
  type: STARTED_GRANULES_TIMER,
  payload
})

export const finishGranulesTimer = (payload) => ({
  type: FINISHED_GRANULES_TIMER,
  payload
})

export const onExcludeGranule = (payload) => ({
  type: EXCLUDE_GRANULE_ID,
  payload
})

export const onUndoExcludeGranule = (payload) => ({
  type: UNDO_EXCLUDE_GRANULE_ID,
  payload
})

export const updateGranuleLinks = (payload) => ({
  type: UPDATE_GRANULE_LINKS,
  payload
})

export const setGranuleLinksLoading = () => ({
  type: SET_GRANULE_LINKS_LOADING
})

export const setGranuleLinksLoaded = () => ({
  type: SET_GRANULE_LINKS_LOADED
})

export const initializeCollectionGranulesResults = (payload) => ({
  type: INITIALIZE_COLLECTION_GRANULES_RESULTS,
  payload
})

export const initializeCollectionGranulesQuery = (payload) => ({
  type: INITIALIZE_COLLECTION_GRANULES_QUERY,
  payload
})

/**
 * Fetch all relevant links to the granules that are part of the provided collection
 * @param {Object} retrievalCollectionData Retrieval Collection response from the database
 * @param {String} linkTypes Comma delimited string of linkTypes to retrieve
 */
export const fetchGranuleLinks = (
  retrievalCollectionData,
  linkTypes
) => async (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  const {
    id,
    retrieval_collection_id: retrievalCollectionId,
    collection_metadata: collectionMetadata,
    granule_count: granuleCount
  } = retrievalCollectionData

  const { isOpenSearch } = collectionMetadata
  // The number of granules to request per page from CMR
  let pageSize = parseInt(granuleLinksPageSize, 10)
  if (isOpenSearch) {
    pageSize = parseInt(openSearchGranuleLinksPageSize, 10)
  }

  // Determine how many pages we will need to load to display all granules
  const totalPages = Math.ceil(granuleCount / pageSize)

  const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)

  let cursor
  let response
  let finished = false
  let currentPage = 1

  const params = {
    cursor,
    flattenLinks: false,
    id: retrievalCollectionId,
    linkTypes,
    pageNum: currentPage
  }

  try {
    while (!finished) {
      // eslint-disable-next-line no-await-in-loop
      response = await requestObject.fetchLinks(stringify(params, {
        addQueryPrefix: true,
        arrayFormat: 'repeat'
      }))

      const { data } = response
      const {
        cursor: responseCursor,
        done,
        links = {}
      } = data

      // Set the cursor returned from GraphQl so the next loop will use it
      cursor = responseCursor
      params.cursor = cursor

      const percentDone = (((currentPage) / totalPages) * 100).toFixed()

      // Fetch the download links from the granule metadata
      const {
        browse: granuleBrowseLinks,
        download: granuleDownloadLinks,
        s3: granuleS3Links
      } = links

      if (done
        || (
          (!granuleBrowseLinks || granuleBrowseLinks.length === 0)
          && (!granuleDownloadLinks || granuleDownloadLinks.length === 0)
          && (!granuleS3Links || granuleS3Links.length === 0)
        )
      ) {
        finished = true
        break
      }

      dispatch(updateGranuleLinks({
        id,
        percentDone,
        links: {
          browse: granuleBrowseLinks,
          download: granuleDownloadLinks,
          s3: granuleS3Links
        }
      }))

      currentPage += 1
      params.pageNum = currentPage
    }
  } catch (error) {
    dispatch(actions.handleError({
      error,
      action: 'fetchGranuleLinks',
      resource: 'granule links',
      requestObject
    }))
  }

  return response
}

export const fetchRetrievalCollectionGranuleLinks = (data) => (dispatch) => {
  dispatch(setGranuleLinksLoading())

  dispatch(fetchGranuleLinks(data, 'data,s3,browse')).then(() => {
    dispatch(setGranuleLinksLoaded())
  })
}

export const fetchRetrievalCollectionGranuleBrowseLinks = (data) => (dispatch) => {
  dispatch(fetchGranuleLinks(data, 'browse')).then(() => {
    dispatch(setGranuleLinksLoaded())
  })
}

// Cancel token to cancel pending search requests
const granuleSearchCancelTokens = {}

/**
 * Perform a granules request based on the focused collection.
 */
export const getSearchGranules = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  // Retrieve data from Redux using selectors
  const collectionId = getFocusedCollectionId(state)
  const collectionMetadata = getFocusedCollectionMetadata(state)

  // Extract granule search parameters from redux specific to the focused collection
  const extractedGranuleParams = extractGranuleSearchParams(state, collectionId)

  // Format and structure data from Redux to be sent to CMR
  const granuleParams = prepareGranuleParams(
    collectionMetadata,
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

  dispatch(startGranulesTimer(collectionId))

  // Clear out the current results if a new set of pages has been requested
  if (pageNum === 1) {
    const emptyPayload = {
      collectionId,
      results: []
    }
    dispatch(updateGranuleResults(emptyPayload))
  }

  dispatch(onGranulesLoading(collectionId))

  dispatch(toggleSpatialPolygonWarning(false))

  const searchParams = buildGranuleSearchParams(granuleParams)

  let requestObject = null

  // TODO can I replace this with a single page of fetchGranuleLinks? Maybe just the opensearch call
  if (isOpenSearch) {
    requestObject = new OpenSearchGranuleRequest(authToken, earthdataEnvironment, collectionId)

    const { polygon } = searchParams

    // OpenSearch does not support polygon searches, replace the polygon spatial with a minimum bounding rectangle
    if (polygon) {
      dispatch(toggleSpatialPolygonWarning(true))

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

  const response = requestObject.search(searchParams)
    .then((responseObject) => {
      const payload = populateGranuleResults({
        collectionId,
        isOpenSearch,
        response: responseObject
      })

      dispatch(finishGranulesTimer(collectionId))

      const { data } = responseObject
      const { feed } = data
      const { entry } = feed

      dispatch(onGranulesLoaded({
        collectionId,
        loaded: true
      }))

      dispatch(addGranuleMetadata(entry))

      if (pageNum === 1) {
        dispatch(updateGranuleResults(payload))
      } else {
        dispatch(addMoreGranuleResults(payload))
      }
    })
    .catch((error) => {
      if (isCancel(error)) return

      dispatch(onGranulesErrored())

      dispatch(finishGranulesTimer(collectionId))

      dispatch(actions.handleError({
        error,
        action: 'getSearchGranules',
        resource: 'granules',
        requestObject
      }))
    })

  return response
}

export const undoExcludeGranule = (collectionId) => (dispatch) => {
  dispatch(onUndoExcludeGranule(collectionId))
  dispatch(actions.getSearchGranules())
}

/**
 * Called when granule filters are submitted. Resets the granule query page, applies any granule filters,
 * gets the granules, and optionally closes the sidebar panel.
 * @param {Object} granuleFilters - An object containing the flags to apply as granuleFilters.
 */
export const applyGranuleFilters = (granuleFilters) => (dispatch, getState) => {
  const state = getState()

  const zustandState = useEdscStore.getState()

  // Retrieve data from Redux using selectors
  const focusedCollectionId = getFocusedCollectionId(state)
  const projectCollectionsIds = getProjectCollectionsIds(zustandState)

  if (isEmpty(granuleFilters)) {
    dispatch(actions.clearFocusedCollectionGranuleFilters())
  } else {
    // Apply granule filters, ensuring to reset the page number to 1 as this results in a new search
    dispatch(actions.updateFocusedCollectionGranuleFilters({
      pageNum: 1,
      ...granuleFilters
    }))
  }

  // If there is a focused collection, and it is in the project also update the project granules
  if (focusedCollectionId && projectCollectionsIds.includes(focusedCollectionId)) {
    const { project } = zustandState
    const { getProjectGranules } = project
    getProjectGranules()
  }

  dispatch(actions.getSearchGranules())

  // Clear any subscription disabledFields
  dispatch(actions.removeSubscriptionDisabledFields())
}

/**
 * Calls apply granule filters with an empty object to reset the filters.
 */
export const clearGranuleFilters = () => applyGranuleFilters({})

/**
 * Excludes a single granule from search results and requests granules again
 * @param {Object} data Object containing the granule id and the collection that the granule belongs to
 */
export const excludeGranule = (data) => (dispatch) => {
  const { collectionId, granuleId } = data

  // Unfocus the granule on the map
  eventEmitter.emit(`map.layer.${collectionId}.hoverGranule`, { granule: null })

  dispatch(actions.onExcludeGranule({
    collectionId,
    granuleId
  }))

  dispatch(actions.getSearchGranules())
}
