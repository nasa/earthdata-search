import 'array-foreach-async'
import { stringify } from 'qs'

import actions from './index'
import {
  SET_GRANULE_LINKS_LOADED,
  SET_GRANULE_LINKS_LOADING,
  UPDATE_GRANULE_LINKS
} from '../constants/actionTypes'
import { getApplicationConfig } from '../../../../sharedUtils/config'
import RetrievalRequest from '../util/request/retrievalRequest'

import useEdscStore from '../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'

const { granuleLinksPageSize, openSearchGranuleLinksPageSize } = getApplicationConfig()

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

  const earthdataEnvironment = getEarthdataEnvironment(useEdscStore.getState())

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
