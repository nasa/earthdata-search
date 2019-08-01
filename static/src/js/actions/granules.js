import axios from 'axios'
import {
  populateGranuleResults,
  prepareGranuleParams,
  buildGranuleSearchParams,
  getDownloadUrls
} from '../util/granules'
import GranuleRequest from '../util/request/granuleRequest'
import CwicGranuleRequest from '../util/request/cwic'
import {
  ADD_MORE_GRANULE_RESULTS,
  ERRORED_GRANULES,
  EXCLUDE_GRANULE_ID,
  FINISHED_GRANULES_TIMER,
  LOADED_GRANULES,
  LOADING_GRANULES,
  STARTED_GRANULES_TIMER,
  UPDATE_GRANULE_RESULTS,
  ADD_GRANULE_RESULTS_FROM_COLLECTIONS,
  UNDO_EXCLUDE_GRANULE_ID,
  UPDATE_GRANULE_DOWNLOAD_PARAMS,
  UPDATE_GRANULE_LINKS,
  UPDATE_GRANULE_METADATA
} from '../constants/actionTypes'
import { updateAuthTokenFromHeaders } from './authToken'
import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { cmrEnv } from '../../../../sharedUtils/cmrEnv'

export const addGranulesFromCollection = payload => ({
  type: ADD_GRANULE_RESULTS_FROM_COLLECTIONS,
  payload
})

export const addMoreGranuleResults = payload => ({
  type: ADD_MORE_GRANULE_RESULTS,
  payload
})

export const updateGranuleResults = payload => ({
  type: UPDATE_GRANULE_RESULTS,
  payload
})

export const updateGranuleMetadata = payload => ({
  type: UPDATE_GRANULE_METADATA,
  payload
})

export const onGranulesLoading = () => ({
  type: LOADING_GRANULES
})

export const onGranulesLoaded = payload => ({
  type: LOADED_GRANULES,
  payload
})

export const onGranulesErrored = () => ({
  type: ERRORED_GRANULES
})

export const startGranulesTimer = () => ({
  type: STARTED_GRANULES_TIMER
})

export const finishGranulesTimer = () => ({
  type: FINISHED_GRANULES_TIMER
})

export const onExcludeGranule = payload => ({
  type: EXCLUDE_GRANULE_ID,
  payload
})

export const onUndoExcludeGranule = payload => ({
  type: UNDO_EXCLUDE_GRANULE_ID,
  payload
})

export const updateGranuleDownloadParams = payload => ({
  type: UPDATE_GRANULE_DOWNLOAD_PARAMS,
  payload
})

export const updateGranuleLinks = payload => ({
  type: UPDATE_GRANULE_LINKS,
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
 * @param {Object} retrievalCollectionData Retreival Collection response from the database
 * @param {String} authToken The authenticated users' JWT token
 */
export const fetchLinks = (retrievalCollectionData, authToken) => (dispatch) => {
  const requestObject = new GranuleRequest(authToken)

  const {
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

        dispatch(updateGranuleLinks(granuleLinks.map(lnk => lnk.href)))
      })
      .catch((error) => {
        console.log(error)
      })

    return granuleResponse
  }))
}

/**
 * Fetch necessary record from the database and use them to retrieve granules from CMR
 * @param {Object} data A retrieval collection record from the database
 */
export const fetchGranuleLinks = data => (dispatch, getState) => {
  const { id: retrievalId, collection_id: collectionId } = data

  if (retrievalId && collectionId) {
    const { authToken } = getState()

    const { apiHost } = getEarthdataConfig(cmrEnv())

    // Fetch the retrieval collection data so we know what
    // granule parameters were provided in the order
    const lambdaResponse = axios({
      method: 'get',
      baseURL: apiHost,
      url: `retrievals/${retrievalId}/collections/${collectionId}`,
      headers: {
        Authorization: `Bearer: ${authToken}`
      }
    }).then((response) => {
      // Use the stored granule parameters to retrieve the granules from
      // CMR to extract the urls from
      const { data } = response

      dispatch(updateGranuleDownloadParams(data))
      dispatch(fetchLinks(data))
    })
      .catch((e) => {
        if (e.response) {
          const { data } = e.response
          const { errors = [] } = data

          console.log(errors)
        } else {
          console.log(e)
        }
      })

    return lambdaResponse
  }

  return null
}

export const setGranuleDownloadParams = data => (dispatch) => {
  dispatch(updateGranuleDownloadParams(data))
  dispatch(fetchGranuleLinks(data))
}

export const undoExcludeGranule = collectionId => (dispatch) => {
  dispatch(onUndoExcludeGranule(collectionId))
}

export const getGranules = () => (dispatch, getState) => {
  const granuleParams = prepareGranuleParams(getState())

  if (!granuleParams) {
    dispatch(updateGranuleResults({
      results: []
    }))
    return null
  }

  const {
    authToken,
    collectionId,
    isCwicCollection,
    pageNum
  } = granuleParams

  dispatch(onGranulesLoading())
  dispatch(startGranulesTimer())

  let requestObject = null
  if (isCwicCollection) {
    requestObject = new CwicGranuleRequest()
  } else {
    requestObject = new GranuleRequest(authToken)
  }

  const response = requestObject.search(buildGranuleSearchParams(granuleParams))
    .then((response) => {
      const payload = populateGranuleResults(collectionId, isCwicCollection, response)

      dispatch(finishGranulesTimer())
      dispatch(updateAuthTokenFromHeaders(response.headers))
      dispatch(onGranulesLoaded({
        loaded: true
      }))

      if (pageNum === 1) {
        dispatch(updateGranuleResults(payload))
      } else {
        dispatch(addMoreGranuleResults(payload))
      }
    })
    .catch((e) => {
      dispatch(onGranulesErrored())
      dispatch(finishGranulesTimer())
      dispatch(onGranulesLoaded({
        loaded: false
      }))

      if (e.response) {
        const { data } = e.response
        const { errors = [] } = data

        console.log(errors)
      } else {
        console.log(e)
      }
    })

  return response
}
