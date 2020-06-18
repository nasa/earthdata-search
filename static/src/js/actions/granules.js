import { isCancel } from 'axios'
import { difference, isEqual } from 'lodash'

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
import { getApplicationConfig } from '../../../../sharedUtils/config'
import { prepareGranuleAccessParams } from '../../../../sharedUtils/prepareGranuleAccessParams'
import { buildPromise } from '../util/buildPromise'


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
    concept_id: conceptId,
    temporal,
    bounding_box: boundingBox,
    exclude = {}
  } = granuleParams

  const {
    selected_variables: variables,
    selected_output_format: format
  } = accessMethod

  const ousPayload = {
    format,
    variables,
    echoCollectionId: collectionId
  }

  // If conceptId is truthy, send those granules explictly. Otherwise, set the
  // relevant OUS parameters.
  if (conceptId) {
    ousPayload.granules = conceptId
  } else {
    const { concept_id: excludedGranuleIds = [] } = exclude

    ousPayload.boundingBox = boundingBox
    ousPayload.temporal = temporal

    // OUS has a slightly different syntax for excluding params
    if (excludedGranuleIds.length > 0) {
      ousPayload.exclude_granules = true
      ousPayload.granules = excludedGranuleIds
    }
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
 * @param {Object} opts - Optional, options object.
 */
export const getGranules = (ids, opts = {}) => (dispatch, getState) => {
  const state = getState()

  const {
    requestAddedGranules = false
  } = opts

  const {
    focusedCollection,
    metadata,
    project
  } = state

  let isProject = true

  let collectionIds

  // If no collection ids were provided
  if (ids == null) {
    isProject = false
    collectionIds = [focusedCollection]
  } else {
    collectionIds = ids
  }

  // Granules cannot be retrieved without a collection id
  if (collectionIds.filter(Boolean).length === 0) {
    return buildPromise(null)
  }

  const { collections } = metadata

  const { collectionIds: projectCollectionIds = [], byId: projectCollections = {} } = project

  return Promise.all(collectionIds.map((collectionId) => {
    const collectionIsInProject = projectCollectionIds.includes(collectionId)
    const granuleParams = prepareGranuleParams(state, collectionId)

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

    const granuleParamsOptions = {}

    // If we should request the the added concept ids, only request them when there is less than one page (2000 results)
    if (requestAddedGranules && collectionIsInProject) {
      const { [collectionId]: projectCollection } = projectCollections
      const {
        addedGranuleIds = []
      } = projectCollection

      const { metadata: newMetadata = {} } = getState()
      const { collections } = newMetadata
      const { byId: collectionsById } = collections
      const { granules: collectionGranules = {} } = collectionsById
      const { allIds: collectionGranulesAllIds } = collectionGranules

      if (addedGranuleIds.length && addedGranuleIds.length < 2000) {
        const granulesWithoutMetadata = difference(addedGranuleIds, collectionGranulesAllIds)
        if (granulesWithoutMetadata) {
          granuleParams.conceptId = granulesWithoutMetadata
          granuleParamsOptions.forceConceptId = true
        }
      }
    }

    const searchParams = buildGranuleSearchParams(granuleParams, granuleParamsOptions)
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
        const payload = populateGranuleResults({
          collectionId,
          isCwic: isCwicCollection,
          response
        })

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

        // If this collection is in the project update the order count if applicable
        if (projectCollectionIds.includes(collectionId)) {
          const { [collectionId]: projectCollection } = projectCollections
          const {
            selectedAccessMethod
          } = projectCollection

          if (selectedAccessMethod && !['download', 'opendap'].includes(selectedAccessMethod)) {
            // Calculate the number of orders that will be created based on granule count
            const { defaultGranulesPerOrder } = getApplicationConfig()
            const { hits: granuleCount } = payload
            const orderCount = Math.ceil(granuleCount / parseInt(defaultGranulesPerOrder, 10))

            dispatch(actions.updateAccessMethodOrderCount({
              collectionId,
              selectedAccessMethod,
              orderCount
            }))
          }
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
export const applyGranuleFilters = (
  collectionId,
  granuleFilters,
  closePanel = false
) => (dispatch, getState) => {
  dispatch(actions.updateGranuleQuery({ pageNum: 1 }))
  dispatch(actions.updateCollectionGranuleFilters(collectionId, granuleFilters))
  dispatch(getGranules()).then(() => {
    if (closePanel) dispatch(actions.toggleSecondaryOverlayPanel(false))

    // If the collection is in the project, we need to update access methods after fetching new granules
    const { project = {} } = getState()
    const { collectionIds } = project
    if (collectionIds.includes(collectionId)) {
      dispatch(actions.fetchAccessMethods([collectionId]))
    }
  })
}
