import { isCancel } from 'axios'

import actions from './index'
import {
  populateGranuleResults,
  prepareGranuleParams,
  buildGranuleSearchParams,
  getDownloadUrls,
  extractProjectCollectionGranuleParams,
  extractGranuleSearchParams
} from '../util/granules'
import GranuleRequest from '../util/request/granuleRequest'
import OusGranuleRequest from '../util/request/ousGranuleRequest'
import CwicGranuleRequest from '../util/request/cwicGranuleRequest'
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
import { updateAuthTokenFromHeaders } from './authToken'
import { mbr } from '../util/map/mbr'
import { prepareGranuleAccessParams } from '../../../../sharedUtils/prepareGranuleAccessParams'
import { toggleSpatialPolygonWarning } from './ui'
import {
  startProjectGranulesTimer,
  projectGranulesLoading,
  finishProjectGranulesTimer,
  projectGranulesLoaded,
  projectGranulesErrored,
  updateProjectGranuleResults,
  addMoreProjectGranuleResults
} from './project'
import { getCollectionMetadata } from '../util/focusedCollection'
import {
  getCollectionsMetadata,
  getFocusedCollectionMetadata
} from '../selectors/collectionMetadata'
import { getProjectCollectionsIds } from '../selectors/project'
import { getFocusedCollectionId } from '../selectors/focusedCollection'
import { eventEmitter } from '../events/events'

export const addMoreGranuleResults = payload => ({
  type: ADD_MORE_GRANULE_RESULTS,
  payload
})

export const updateGranuleResults = payload => ({
  type: UPDATE_GRANULE_RESULTS,
  payload
})

export const resetGranuleResults = payload => ({
  type: RESET_GRANULE_RESULTS,
  payload
})

export const updateGranuleMetadata = payload => ({
  type: UPDATE_GRANULE_METADATA,
  payload
})

export const addGranuleMetadata = payload => ({
  type: ADD_GRANULE_METADATA,
  payload
})

export const onGranulesLoading = payload => ({
  type: LOADING_GRANULES,
  payload
})

export const onGranulesLoaded = payload => ({
  type: LOADED_GRANULES,
  payload
})

export const onGranulesErrored = () => ({
  type: ERRORED_GRANULES
})

export const startGranulesTimer = payload => ({
  type: STARTED_GRANULES_TIMER,
  payload
})

export const finishGranulesTimer = payload => ({
  type: FINISHED_GRANULES_TIMER,
  payload
})

export const onExcludeGranule = payload => ({
  type: EXCLUDE_GRANULE_ID,
  payload
})

export const onUndoExcludeGranule = payload => ({
  type: UNDO_EXCLUDE_GRANULE_ID,
  payload
})

export const updateGranuleLinks = payload => ({
  type: UPDATE_GRANULE_LINKS,
  payload
})

export const setGranuleLinksLoading = () => ({
  type: SET_GRANULE_LINKS_LOADING
})

export const setGranuleLinksLoaded = () => ({
  type: SET_GRANULE_LINKS_LOADED
})

export const initializeCollectionGranulesResults = payload => ({
  type: INITIALIZE_COLLECTION_GRANULES_RESULTS,
  payload
})

export const initializeCollectionGranulesQuery = payload => ({
  type: INITIALIZE_COLLECTION_GRANULES_QUERY,
  payload
})

/**
 * Fetch all relevant links to the granules that are part of the provided collection
 * @param {Integer} retrievalId Database id of the retrieval object
 * @param {String} collectionId CMR collection id to get granules for from a retrieval
 * @param {Object} retrievalCollectionData Retrieval Collection response from the database
 * @param {String} authToken The authenticated users' JWT token
 */
export const fetchLinks = retrievalCollectionData => (dispatch, getState) => {
  const { authToken } = getState()

  const requestObject = new GranuleRequest(authToken)

  const {
    id,
    collection_id: collectionId,
    granule_count: granuleCount,
    granule_params: granuleParams
  } = retrievalCollectionData

  // The number of granules to request per page from CMR
  const pageSize = 500

  // Determine how many pages we will need to load to display all granules
  const totalPages = Math.ceil(granuleCount / pageSize)

  const preparedGranuleParams = prepareGranuleAccessParams(granuleParams)

  return Promise.all(Array.from(Array(totalPages)).map((_, pageNum) => {
    const granuleResponse = requestObject.search({
      ...preparedGranuleParams,
      pageSize,
      pageNum: pageNum + 1,
      echoCollectionId: collectionId
    })
      .then((response) => {
        const { data } = response
        const { feed } = data
        const { entry } = feed

        // Fetch the download links from the granule metadata
        const granuleLinks = getDownloadUrls(entry)

        dispatch(updateGranuleLinks({
          id,
          links: granuleLinks.map(lnk => lnk.href)
        }))
      })
      .catch((error) => {
        dispatch(actions.handleError({
          error,
          action: 'fetchLinks',
          resource: 'granule links',
          requestObject
        }))
      })

    return granuleResponse
  }))
}

/**
 * Fetch all relevant links from CMR Service Bridge (OPeNDAP) to the granules that are part of the provided collection
 * @param {Object} retrievalCollectionData Retreival Collection response from the database
 */
export const fetchOpendapLinks = retrievalCollectionData => (dispatch, getState) => {
  const { authToken } = getState()

  const requestObject = new OusGranuleRequest(authToken)

  const {
    id,
    access_method: accessMethod,
    collection_id: collectionId,
    granule_params: granuleParams
  } = retrievalCollectionData

  const {
    bounding_box: boundingBox = [],
    circle = [],
    concept_id: conceptId = [],
    exclude = {},
    point = [],
    polygon = [],
    temporal
  } = granuleParams

  const {
    selectedVariables: variables,
    selectedOutputFormat: format
  } = accessMethod

  const ousPayload = {
    format,
    variables,
    echo_collection_id: collectionId
  }

  // If conceptId is truthy, send those granules explictly.
  if (conceptId.length) {
    ousPayload.granules = conceptId
  }

  const { concept_id: excludedGranuleIds = [] } = exclude

  if (
    boundingBox.length > 0
    || circle.length > 0
    || point.length > 0
    || polygon.length > 0
  ) {
    const {
      swLat,
      swLng,
      neLat,
      neLng
    } = mbr({
      boundingBox: boundingBox[0],
      circle: circle[0],
      point: point[0],
      polygon: polygon[0]
    })

    ousPayload.bounding_box = [swLng, swLat, neLng, neLat].join(',')
  }

  ousPayload.temporal = temporal

  // OUS has a slightly different syntax for excluding params
  if (excludedGranuleIds.length > 0) {
    ousPayload.exclude_granules = true
    ousPayload.granules = excludedGranuleIds
  }

  const response = requestObject.search(ousPayload)
    .then((response) => {
      const { data } = response
      const { items = [] } = data

      dispatch(updateGranuleLinks({
        id,
        links: items
      }))
    })
    .catch((error) => {
      dispatch(actions.handleError({
        error,
        action: 'fetchOpendapLinks',
        resource: 'OPeNDAP links',
        requestObject
      }))
    })

  return response
}

export const fetchRetrievalCollectionGranuleLinks = data => (dispatch) => {
  const { access_method: accessMethod } = data
  const { type } = accessMethod

  // Determine which action to take based on the access method type
  if (type === 'download') {
    dispatch(setGranuleLinksLoading())
    dispatch(fetchLinks(data)).then(() => {
      dispatch(setGranuleLinksLoaded())
    })
  } else if (type === 'OPeNDAP') {
    dispatch(setGranuleLinksLoading())
    dispatch(fetchOpendapLinks(data)).then(() => {
      dispatch(setGranuleLinksLoaded())
    })
  }
}

// Cancel token to cancel pending search requests
const granuleSearchCancelTokens = {}

/**
 * Perform a granules request based on the focused collection.
 */
export const getSearchGranules = () => (dispatch, getState) => {
  const state = getState()

  const {
    authToken
  } = state

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
    isCwic,
    pageNum
  } = granuleParams

  dispatch(startGranulesTimer(collectionId))

  dispatch(onGranulesLoading(collectionId))

  dispatch(toggleSpatialPolygonWarning(false))

  const searchParams = buildGranuleSearchParams(granuleParams)

  let requestObject = null

  if (isCwic) {
    requestObject = new CwicGranuleRequest(authToken)

    const { polygon } = searchParams

    // CWIC does not support polygon searches, replace the polygon spatial with a minimum bounding rectangle
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
    requestObject = new GranuleRequest(authToken)
  }

  const response = requestObject.search(searchParams)
    .then((response) => {
      const payload = populateGranuleResults({
        collectionId,
        isCwic,
        response
      })

      dispatch(finishGranulesTimer(collectionId))

      const { data, headers } = response
      const { feed } = data
      const { entry } = feed

      dispatch(updateAuthTokenFromHeaders(headers))

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

export const undoExcludeGranule = collectionId => (dispatch) => {
  dispatch(onUndoExcludeGranule(collectionId))
  dispatch(actions.getSearchGranules())
}

// Cancel token to cancel pending project granule requests
const projectGranuleCancelTokens = {}

/**
 * Perform a granules request based on the current redux state.
 */
export const getProjectGranules = () => (dispatch, getState) => {
  const state = getState()

  const {
    authToken,
    project
  } = state

  // Get a redux selector to fetch collection metadata from the store
  const collectionsMetadata = getCollectionsMetadata(state)

  const { collections } = project
  const { allIds } = collections

  return Promise.all(allIds.map((collectionId) => {
    // Extract granule search parameters from redux specific to this project collection
    const extractedGranuleParams = extractProjectCollectionGranuleParams(state, collectionId)

    // Fetch the collection metadata from redux for this project collection
    const collectionMetadata = getCollectionMetadata(collectionId, collectionsMetadata)

    // Format and structure data from Redux to be sent to CMR
    const granuleParams = prepareGranuleParams(
      collectionMetadata,
      extractedGranuleParams
    )

    // If cancel token is set, cancel the previous request(s)
    if (projectGranuleCancelTokens[collectionId]) {
      projectGranuleCancelTokens[collectionId].cancel()
      projectGranuleCancelTokens[collectionId] = undefined
    }

    const {
      isCwic,
      pageNum
    } = granuleParams

    dispatch(startProjectGranulesTimer(collectionId))

    dispatch(projectGranulesLoading(collectionId))

    dispatch(actions.toggleSpatialPolygonWarning(false))

    const searchParams = buildGranuleSearchParams(granuleParams)

    let requestObject = null

    if (isCwic) {
      requestObject = new CwicGranuleRequest(authToken)

      // Provide the correctly named collection id parameter
      searchParams.echoCollectionId = collectionId

      const { polygon } = searchParams

      // CWIC does not support polygon searches, replace the polygon spatial with a minimum bounding rectangle
      if (polygon) {
        dispatch(toggleSpatialPolygonWarning(true))

        const {
          swLat,
          swLng,
          neLat,
          neLng
        } = mbr({ polygon })

        // Construct a string with points in the order expected by OpenSearch
        searchParams.boundingBox = [swLng, swLat, neLng, neLat].join(',')

        // Remove the unsupported polygon parameter
        delete searchParams.polygon
      }
    } else {
      requestObject = new GranuleRequest(authToken)
    }

    projectGranuleCancelTokens[collectionId] = requestObject.getCancelToken()

    const response = requestObject.search(searchParams)
      .then((response) => {
        const payload = populateGranuleResults({
          collectionId,
          isCwic,
          response
        })

        dispatch(finishProjectGranulesTimer(collectionId))

        const { data, headers } = response
        const { feed } = data
        const { entry } = feed

        dispatch(updateAuthTokenFromHeaders(headers))

        dispatch(projectGranulesLoaded({
          collectionId,
          loaded: true
        }))

        dispatch(addGranuleMetadata(entry))

        if (pageNum === 1) {
          dispatch(updateProjectGranuleResults(payload))
        } else {
          dispatch(addMoreProjectGranuleResults(payload))
        }
      })
      .catch((error) => {
        if (isCancel(error)) return

        dispatch(projectGranulesErrored(collectionId))

        dispatch(finishProjectGranulesTimer(collectionId))

        dispatch(actions.handleError({
          error,
          action: 'getProjectGranules',
          resource: 'granules',
          requestObject
        }))
      })

    return response
  }))
}

/**
 * Called when granule filters are submitted. Resets the granule query page, applies any granule filters,
 * gets the granules, and optionally closes the sidebar panel.
 * @param {Object} granuleFilters - An object containing the flags to apply as granuleFilters.
 * @param {Boolean} closePanel - If true, tells the overlay panel to close once the granules are recieved.
 */
export const applyGranuleFilters = (
  granuleFilters,
  closePanel = false
) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const focusedCollectionId = getFocusedCollectionId(state)
  const projectCollectionsIds = getProjectCollectionsIds(state)

  // Apply granule filters, ensuring to reset the page number to 1 as this results in a new search
  dispatch(actions.updateFocusedCollectionGranuleFilters({ pageNum: 1, ...granuleFilters }))

  // If there is a focused collection, and it is in the project also update the project granules
  if (focusedCollectionId && projectCollectionsIds.includes(focusedCollectionId)) {
    dispatch(actions.getProjectGranules())
  }

  dispatch(actions.getSearchGranules())

  if (closePanel) dispatch(actions.toggleSecondaryOverlayPanel(false))
}

/**
 * Excludes a single granule from search results and requests granules again
 * @param {Object} data Object containing the granule id and the collection that the granule belongs to
 */
export const excludeGranule = data => (dispatch) => {
  const { collectionId, granuleId } = data

  // Unfocus the granule on the map
  eventEmitter.emit(`map.layer.${collectionId}.focusgranule`, { granule: null })

  dispatch(actions.onExcludeGranule({
    collectionId,
    granuleId
  }))

  // Reset the page number to 1 to update the UI
  dispatch(actions.updateGranuleSearchQuery({
    collectionId,
    pageNum: 1
  }))

  dispatch(actions.getSearchGranules())
}
