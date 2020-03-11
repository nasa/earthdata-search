import { isCancel } from 'axios'
import { isEqual } from 'lodash'

import actions from './index'
import {
  populateGranuleResults,
  prepareGranuleParams,
  buildGranuleSearchParams,
  getDownloadUrls
} from '../util/granules'
import GranuleRequest from '../util/request/granuleRequest'
import OusGranuleRequest from '../util/request/ousGranuleRequest'
import CwicGranuleRequest from '../util/request/cwicGranuleRequest'
import {
  ADD_MORE_GRANULE_RESULTS,
  CLEAR_EXCLUDE_GRANULE_ID,
  ERRORED_GRANULES,
  EXCLUDE_GRANULE_ID,
  FINISHED_GRANULES_TIMER,
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
  UPDATE_CURRENT_COLLECTION_GRANULE_PARAMS
} from '../constants/actionTypes'
import { updateAuthTokenFromHeaders } from './authToken'
import { mbr } from '../util/map/mbr'
import { getFocusedCollectionObject } from '../util/focusedCollection'

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

export const onClearExcludedGranules = () => ({
  type: CLEAR_EXCLUDE_GRANULE_ID
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

export const updateCurrentCollectionGranuleParams = payload => ({
  type: UPDATE_CURRENT_COLLECTION_GRANULE_PARAMS,
  payload
})

export const excludeGranule = data => (dispatch) => {
  const { collectionId, granuleId } = data
  dispatch(onExcludeGranule({
    collectionId,
    granuleId
  }))
}

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

  return Promise.all(Array.from(Array(totalPages)).map((_, pageNum) => {
    const granuleResponse = requestObject.search({
      ...granuleParams,
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
    temporal,
    bounding_box: boundingBox,
    exclude = {}
  } = granuleParams

  const {
    selected_variables: variables,
    selected_output_format: format
  } = accessMethod

  const ousPayload = {
    boundingBox,
    echoCollectionId: collectionId,
    format,
    temporal,
    variables
  }

  // OUS has a slightly different syntax for excluding params
  const { concept_id: excludedGranuleIds = [] } = exclude
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

export const undoExcludeGranule = collectionId => (dispatch) => {
  dispatch(onUndoExcludeGranule(collectionId))
}

export const clearExcludedGranules = collectionId => (dispatch) => {
  dispatch(onClearExcludedGranules(collectionId))
}

// Cancel token to cancel pending requests
const cancelTokens = {}

/**
 * Perform a granules request based on the current redux state.
 * @param {Array} collectionIds - Optional, collection IDs to get granules for. If not provided will return granules from focused collection
 */
export const getGranules = ids => (dispatch, getState) => {
  const state = getState()
  const { focusedCollection, metadata } = state

  let isProject = true
  let collectionIds
  if (!ids) {
    isProject = false
    collectionIds = [focusedCollection]
  } else {
    collectionIds = ids
  }

  const { collections } = metadata

  return Promise.all(collectionIds.map((collectionId) => {
    const granuleParams = prepareGranuleParams(state, collectionId)

    if (!granuleParams) {
      return null
    }

    const collectionObject = getFocusedCollectionObject(collectionId, collections)
    const { currentCollectionGranuleParams } = collectionObject || {}

    // If granuleParams are equal to the last used granule params in the store, don't fetch new granules
    if (isEqual(granuleParams, currentCollectionGranuleParams)) {
      return null
    }
    // The params are different, save the new params and continue fetching granules
    dispatch(updateCurrentCollectionGranuleParams({
      collectionId,
      granuleParams
    }))

    // If cancel token is set, cancel the previous request(s)
    if (cancelTokens[collectionId]) {
      cancelTokens[collectionId].cancel()
      cancelTokens[collectionId] = undefined
    }

    const {
      authToken,
      isCwicCollection,
      pageNum
    } = granuleParams

    if (!isProject && pageNum === 1) {
      dispatch(resetGranuleResults(collectionId))
    }

    dispatch(startGranulesTimer(collectionId))
    dispatch(onGranulesLoading(collectionId))

    dispatch(actions.toggleSpatialPolygonWarning(false))

    const searchParams = buildGranuleSearchParams(granuleParams)
    let requestObject = null
    if (isCwicCollection) {
      requestObject = new CwicGranuleRequest(authToken)
      const { polygon } = searchParams

      // CWIC does not support polygon searches, replace the polygon spatial with a minimum bounding rectangle
      if (polygon) {
        dispatch(actions.toggleSpatialPolygonWarning(true))
        const [llLat, llLng, urLat, urLng] = mbr({ polygon })
        searchParams.boundingBox = [llLng, llLat, urLng, urLat].join(',')
        searchParams.polygon = undefined
      }
    } else {
      requestObject = new GranuleRequest(authToken)
    }

    cancelTokens[collectionId] = requestObject.getCancelToken()

    const response = requestObject.search(searchParams)
      .then((response) => {
        const payload = populateGranuleResults(collectionId, isCwicCollection, response)

        dispatch(finishGranulesTimer(collectionId))
        dispatch(updateAuthTokenFromHeaders(response.headers))
        dispatch(onGranulesLoaded({
          collectionId,
          loaded: true
        }))

        if (isProject || pageNum === 1) {
          dispatch(updateGranuleResults(payload))
        } else {
          dispatch(addMoreGranuleResults(payload))
        }
      })
      .catch((error) => {
        if (isCancel(error)) return

        dispatch(onGranulesErrored())
        dispatch(finishGranulesTimer(collectionId))
        dispatch(onGranulesLoaded({
          collectionId,
          loaded: false
        }))
        dispatch(actions.handleError({
          error,
          action: 'getGranules',
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
 * @param {String} collectionId - The id for the collection to update.
 * @param {Object} granuleFilters - An object containing the flags to apply as granuleFilters.
 * @param {Boolean} closePanel - If true, tells the overlay panel to close once the granules are recieved.
 */
// eslint-disable-next-line max-len
export const applyGranuleFilters = (collectionId, granuleFilters, closePanel = false) => (dispatch) => {
  dispatch(actions.updateGranuleQuery({ pageNum: 1 }))
  dispatch(actions.updateCollectionGranuleFilters(collectionId, granuleFilters))
  dispatch(getGranules()).then(() => {
    if (closePanel) dispatch(actions.toggleSecondaryOverlayPanel(false))
  })
}
