import { isCancel } from 'axios'
import { isEmpty } from 'lodash'
import camelcaseKeys from 'camelcase-keys'
import 'array-foreach-async'

import actions from './index'
import {
  populateGranuleResults,
  prepareGranuleParams,
  buildGranuleSearchParams,
  getDownloadUrls,
  getS3Urls,
  extractProjectCollectionGranuleParams,
  extractGranuleSearchParams
} from '../util/granules'
import GranuleRequest from '../util/request/granuleRequest'
import OusGranuleRequest from '../util/request/ousGranuleRequest'
import OpenSearchGranuleRequest from '../util/request/openSearchGranuleRequest'
import GraphQlRequest from '../util/request/graphQlRequest'
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
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getApplicationConfig } from '../../../../sharedUtils/config'
import { getOpenSearchOsddLink } from '../util/getOpenSearchLink'

const { granuleLinksPageSize } = getApplicationConfig()

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
 * @param {Integer} retrievalId Database id of the retrieval object
 * @param {String} collectionId CMR collection id to get granules for from a retrieval
 * @param {Object} retrievalCollectionData Retrieval Collection response from the database
 * @param {String} authToken The authenticated users' JWT token
 */
export const fetchLinks = (retrievalCollectionData) => async (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

  const {
    id,
    collection_id: collectionId,
    granule_count: granuleCount,
    granule_params: granuleParams
  } = retrievalCollectionData

  // The number of granules to request per page from CMR
  const pageSize = parseInt(granuleLinksPageSize, 10)

  // Determine how many pages we will need to load to display all granules
  const totalPages = Math.ceil(granuleCount / pageSize)

  const preparedGranuleParams = camelcaseKeys(prepareGranuleAccessParams(granuleParams))

  const graphQlQuery = `
    query GetGranuleLinks(
      $boundingBox: [String]
      $browseOnly: Boolean
      $circle: [String]
      $cloudCover: JSON
      $collectionConceptId: String
      $conceptId: [String]
      $cursor: String
      $dayNightFlag: String
      $equatorCrossingDate: JSON
      $equatorCrossingLongitude: JSON
      $exclude: JSON
      $limit: Int
      $line: [String]
      $linkTypes: [String]
      $offset: Int
      $onlineOnly: Boolean
      $options: JSON
      $orbitNumber: JSON
      $point: [String]
      $polygon: [String]
      $readableGranuleName: [String]
      $sortKey: [String]
      $temporal: String
      $twoDCoordinateSystem: JSON
    ) {
      granules(
        boundingBox: $boundingBox
        browseOnly: $browseOnly
        circle: $circle
        cloudCover: $cloudCover
        collectionConceptId: $collectionConceptId
        conceptId: $conceptId
        cursor: $cursor
        dayNightFlag: $dayNightFlag
        equatorCrossingDate: $equatorCrossingDate
        equatorCrossingLongitude: $equatorCrossingLongitude
        exclude: $exclude
        limit: $limit
        line: $line
        linkTypes: $linkTypes
        offset: $offset
        onlineOnly: $onlineOnly
        options: $options
        orbitNumber: $orbitNumber
        point: $point
        polygon: $polygon
        readableGranuleName: $readableGranuleName
        sortKey: $sortKey
        temporal: $temporal
        twoDCoordinateSystem: $twoDCoordinateSystem
      ) {
        cursor
        items {
          links
        }
      }
    }`

  let cursor
  let response
  let finished = false
  let currentPage = 0

  try {
    while (!finished) {
      // eslint-disable-next-line no-await-in-loop
      response = await graphQlRequestObject.search(graphQlQuery, {
        ...preparedGranuleParams,
        limit: pageSize,
        linkTypes: ['data', 's3'],
        collectionConceptId: collectionId,
        cursor
      })

      const { data } = response
      const { data: granulesData } = data
      const { granules } = granulesData
      const { cursor: responseCursor, items } = granules

      // Set the cursor returned from GraphQl so the next loop will use it
      cursor = responseCursor

      if (!items || !items.length) {
        finished = true
        break
      }

      const percentDone = (((currentPage + 1) / totalPages) * 100).toFixed()

      // Fetch the download links from the granule metadata
      const granuleDownloadLinks = getDownloadUrls(items)
      const granuleS3Links = getS3Urls(items)

      dispatch(updateGranuleLinks({
        id,
        percentDone,
        links: {
          download: granuleDownloadLinks.map((lnk) => lnk.href),
          s3: granuleS3Links.map((lnk) => lnk.href)
        }
      }))

      currentPage += 1
    }
  } catch (error) {
    dispatch(actions.handleError({
      error,
      action: 'fetchLinks',
      resource: 'granule links',
      requestObject: graphQlRequestObject
    }))
  }

  return response
}

/**
 * Fetch all relevant links from CMR Service Bridge (OPeNDAP) to the granules that are part of the provided collection
 * @param {Object} retrievalCollectionData Retreival Collection response from the database
 */
export const fetchOpendapLinks = (retrievalCollectionData) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  const requestObject = new OusGranuleRequest(authToken, earthdataEnvironment)

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
        links: {
          download: items
        }
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

/**
 * Fetch all relevant links from OpenSearch to the granules that are part of the provided collection
 * @param {Object} retrievalCollectionData Retreival Collection response from the database
 */
export const fetchOpenSearchLinks = (retrievalCollectionData) => async (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  // Format and structure data from Redux to be sent to CMR
  const {
    id,
    collection_metadata: collectionMetadata,
    granule_count: granuleCount,
    granule_params: granuleParams
  } = retrievalCollectionData

  const { openSearchGranuleLinksPageSize } = getApplicationConfig()
  const pageSize = parseInt(openSearchGranuleLinksPageSize, 10)

  granuleParams.open_search_osdd = getOpenSearchOsddLink(collectionMetadata)
  granuleParams.page_size = pageSize

  const totalPages = Math.ceil(granuleCount / pageSize)

  const requestObject = new OpenSearchGranuleRequest(authToken, earthdataEnvironment)

  let response

  try {
    await new Array(totalPages).forEachAsync(async (_, index) => {
      const currentPage = index + 1
      granuleParams.pageNum = currentPage

      response = await requestObject.search(camelcaseKeys(granuleParams))

      const { data } = response
      const { feed } = data
      const { entry } = feed

      const items = []

      entry.forEach((granule) => {
        const { link: links = [] } = granule

        const [downloadLink] = links.filter((link) => link.rel === 'enclosure')

        const { href } = downloadLink
        items.push(href)
      })

      const percentDone = (((currentPage) / totalPages) * 100).toFixed()

      dispatch(updateGranuleLinks({
        id,
        percentDone,
        links: {
          download: items
        }
      }))

      return response
    })
  } catch (error) {
    dispatch(actions.handleError({
      error,
      action: 'fetchOpenSearchLinks',
      resource: 'OpenSearch links',
      requestObject
    }))
  }

  return response
}

export const fetchRetrievalCollectionGranuleLinks = (data) => (dispatch) => {
  const {
    access_method: accessMethod,
    collection_metadata: collectionMetadata
  } = data
  const { type } = accessMethod

  // Determine which action to take based on the access method type
  if (type === 'download') {
    const { isOpenSearch } = collectionMetadata
    dispatch(setGranuleLinksLoading())

    if (isOpenSearch) {
      dispatch(fetchOpenSearchLinks(data)).then(() => {
        dispatch(setGranuleLinksLoaded())
      })
    } else {
      dispatch(fetchLinks(data)).then(() => {
        dispatch(setGranuleLinksLoaded())
      })
    }
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

  if (isOpenSearch) {
    requestObject = new OpenSearchGranuleRequest(authToken, earthdataEnvironment)

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
    .then((response) => {
      const payload = populateGranuleResults({
        collectionId,
        isOpenSearch,
        response
      })

      dispatch(finishGranulesTimer(collectionId))

      const { data } = response
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

// Cancel token to cancel pending project granule requests
const projectGranuleCancelTokens = {}

/**
 * Perform a granules request based on the current redux state.
 */
export const getProjectGranules = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

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
      isOpenSearch,
      pageNum
    } = granuleParams

    dispatch(startProjectGranulesTimer(collectionId))

    dispatch(projectGranulesLoading(collectionId))

    dispatch(actions.toggleSpatialPolygonWarning(false))

    const searchParams = buildGranuleSearchParams(granuleParams)

    let requestObject = null

    if (isOpenSearch) {
      requestObject = new OpenSearchGranuleRequest(authToken, earthdataEnvironment)

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
      requestObject = new GranuleRequest(authToken, earthdataEnvironment)
    }

    projectGranuleCancelTokens[collectionId] = requestObject.getCancelToken()

    const response = requestObject.search(searchParams)
      .then((response) => {
        const payload = populateGranuleResults({
          collectionId,
          isOpenSearch,
          response
        })

        dispatch(finishProjectGranulesTimer(collectionId))

        const { data } = response
        const { feed } = data
        const { entry } = feed

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
 */
export const applyGranuleFilters = (granuleFilters) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const focusedCollectionId = getFocusedCollectionId(state)
  const projectCollectionsIds = getProjectCollectionsIds(state)

  if (isEmpty(granuleFilters)) {
    dispatch(actions.clearFocusedCollectionGranuleFilters())
  } else {
    // Apply granule filters, ensuring to reset the page number to 1 as this results in a new search
    dispatch(actions.updateFocusedCollectionGranuleFilters({ pageNum: 1, ...granuleFilters }))
  }

  // If there is a focused collection, and it is in the project also update the project granules
  if (focusedCollectionId && projectCollectionsIds.includes(focusedCollectionId)) {
    dispatch(actions.getProjectGranules())
  }

  dispatch(actions.getSearchGranules())
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
  eventEmitter.emit(`map.layer.${collectionId}.focusgranule`, { granule: null })

  dispatch(actions.onExcludeGranule({
    collectionId,
    granuleId
  }))

  dispatch(actions.getSearchGranules())
}
