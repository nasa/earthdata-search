import { EXPORT_FINISHED, EXPORT_STARTED } from '../constants/actionTypes'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { buildCollectionSearchParams, prepareCollectionParams } from '../util/collections'
import ExportSearchRequest from '../util/request/exportSearchRequest'
import { handleError } from './errors'

export const onExportStarted = (payload) => ({
  type: EXPORT_STARTED,
  payload
})

export const onExportFinished = (payload) => ({
  type: EXPORT_FINISHED,
  payload
})

/**
 * Fetch the collection search export in the given format
 * @param {String} format Format for the export (JSON, CSV)
 */
export const exportSearch = (format) => (dispatch, getState) => {
  dispatch(onExportStarted(format))

  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const collectionParams = prepareCollectionParams(state)

  const {
    authToken
  } = collectionParams

  const graphQlRequestObject = new ExportSearchRequest(authToken, earthdataEnvironment)

  const graphQuery = `
    query ExportCollections (
      $params: CollectionsInput
    ) {
      collections (
        params: $params
      ) {
        cursor
        count
        items {
          provider
          shortName
          version
          title
          processingLevel
          platforms
          timeStart
          timeEnd
        }
      }
    }`

  const response = graphQlRequestObject.search(graphQuery, {
    params: {
      ...buildCollectionSearchParams(collectionParams),
      limit: 1000,
      // These params include data that is not used in exporting collections. Setting them to undefined to remove the params
      includeFacets: undefined,
      includeGranuleCounts: undefined,
      includeTags: undefined,
      pageNum: undefined,
      pageSize: undefined
    }
  }, format)
    .then((responseObject) => {
      const { data } = responseObject

      // Create a blob with the text data from the export
      let blob
      if (format === 'csv') {
        blob = new Blob([data], { type: 'text/csv' })
      } else {
        blob = new Blob([JSON.stringify(data)])
      }

      const url = window.URL.createObjectURL(blob)

      // Create a hyperlink to the blob and give it a filename
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `edsc_collection_results_export.${format}`)

      // Add the link to the page
      document.body.appendChild(link)

      // Click on the link to download the export file to the user's computer
      link.click()

      // Remove the link from the page
      link.parentNode.removeChild(link)

      dispatch(onExportFinished(format))
    })
    .catch((error) => {
      dispatch(onExportFinished(format))

      dispatch(handleError({
        error,
        action: 'exportSearch',
        resource: 'collections',
        graphQlRequestObject
      }))
    })

  return response
}

/**
 * Fetch the collection search export in the given format
 * @param {String} format Format for the export (JSON, CSV)
 */
export const exportSearchAsStac = (format) => (dispatch, getState) => {
  dispatch(onExportStarted(format))

  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const collectionParams = prepareCollectionParams(state)

  const {
    authToken
  } = collectionParams

  const graphQlRequestObject = new ExportSearchRequest(authToken, earthdataEnvironment)

  const graphQuery = `
    query SearchCollections($params: CollectionsInput) {
      collections (params: $params) {
        cursor
        items {
          provider
          shortName
          versionId
          title
          processingLevelId
          platforms
          timeStart
          timeEnd
        }
      }
    }`

  const response = graphQlRequestObject.search(graphQuery, {
    ...buildCollectionSearchParams(collectionParams),
    limit: 1000,
    // These params include data that is not used in exporting collections. Setting them to undefined to remove the params
    includeFacets: undefined,
    includeGranuleCounts: undefined,
    includeTags: undefined,
    pageNum: undefined,
    pageSize: undefined
  }, format)
    .then((responseObject) => {
      const { data } = responseObject

      // Create a blob with the text data from the export
      let blob
      if (format === 'csv') {
        blob = new Blob([data], { type: 'text/csv' })
      } else {
        blob = new Blob([JSON.stringify(data)])
      }

      const url = window.URL.createObjectURL(blob)

      // Create a hyperlink to the blob and give it a filename
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `edsc_collection_results_export.${format}`)

      // Add the link to the page
      document.body.appendChild(link)

      // Click on the link to download the export file to the user's computer
      link.click()

      // Remove the link from the page
      link.parentNode.removeChild(link)

      dispatch(onExportFinished(format))
    })
    .catch((error) => {
      dispatch(onExportFinished(format))

      dispatch(handleError({
        error,
        action: 'exportSearch',
        resource: 'collections',
        graphQlRequestObject
      }))
    })

  return response
}
