import { EXPORT_FINISHED, EXPORT_STARTED } from '../constants/actionTypes'
import { getApplicationConfig } from '../../../../sharedUtils/config'
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

  const searchExportParams = {
    itemPath: 'collections.items',
    cursorPath: 'collections.cursor'
  }

  if (format === 'csv') {
    searchExportParams.columns = [
      { name: 'Data Provider', path: 'provider' },
      { name: 'Short Name', path: 'shortName' },
      { name: 'Version', path: 'versionId' },
      { name: 'Entry Title', path: 'title' },
      { name: 'Processing Level', path: 'processingLevelId' },
      { name: 'Platform', path: 'platforms.shortName' },
      { name: 'Start Time', path: 'timeStart' },
      { name: 'End Time', path: 'timeEnd' }
    ]
  }

  const handleExportSearchError = (error) => {
    dispatch(onExportFinished(format))

    dispatch(handleError({
      error,
      action: 'exportSearch',
      resource: 'collections',
      graphQlRequestObject
    }))
  }

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
  }, format, searchExportParams)
    .then(async (response) => {
      // key is a random uuid for this specific export request
      // we use it to poll the status of the export later
      const { key } = response.data
      if (!key) throw Error('server did not respond with a uuid for the export request, which we need in order to find the download')

      const { exportStatusRefreshTime = 5000 } = getApplicationConfig()

      const [error, signedUrl] = await new Promise((resolve) => {
        const intervalId = setInterval(async () => {
          try {
            const response = await graphQlRequestObject.post('collections/export-check', { key })

            const { data } = response

            if (typeof data !== 'object') {
              clearInterval(intervalId) // stop polling
              resolve(['server returned an invalid response', null])
            }

            const { state, url } = data

            if (state === 'DONE') {
              clearInterval(intervalId)
              resolve([null, url])
            } else if (state === 'FAILED') {
              clearInterval(intervalId)
              resolve(['server reported that the export has failed', null])
            } else if ([null, ''].includes(state)) {
              clearInterval(intervalId)
              resolve(['server returned an invalid state', null])
            }
          } catch (error) {
            clearInterval(intervalId)
            resolve([error, null])
          }
        }, exportStatusRefreshTime)
      })

      if (error) {
        handleExportSearchError(error)
      } else {
        // Create a hyperlink to the export and give it a filename
        const link = document.createElement('a')

        link.href = signedUrl
        link.setAttribute('download', `edsc_collection_results_export.${format}`)

        // Add the link to the page
        document.body.appendChild(link)

        // Click on the link to download the export file to the user's computer
        link.click()

        // Remove the link from the page
        link.parentNode.removeChild(link)

        dispatch(onExportFinished(format))
      }
    })
    .catch(handleExportSearchError)

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
    query SearchCollections(
      $boundingBox: [String]
      $circle: [String]
      $cloudHosted: Boolean
      $collectionDataType: [String]
      $dataCenter: String
      $dataCenterH: [String]
      $facetsSize: Int
      $granuleDataFormat: String
      $granuleDataFormatH: [String]
      $hasGranulesOrCwic: Boolean
      $horizontalDataResolutionRange: [String]
      $instrument: String
      $instrumentH: [String]
      $keyword: String
      $line: [String]
      $offset: Int
      $options: JSON
      $platform: String
      $platformH: [String]
      $point: [String]
      $polygon: [String]
      $processingLevelIdH: [String]
      $project: String
      $projectH: [String]
      $provider: String
      $scienceKeywordsH: JSON
      $serviceType: [String]
      $sortKey: [String]
      $spatialKeyword: String
      $tagKey: [String]
      $temporal: String
      $twoDCoordinateSystemName: [String]
      $limit: Int
      $cursor: String
    ) {
      collections (
        boundingBox: $boundingBox
        circle: $circle
        cloudHosted: $cloudHosted
        collectionDataType: $collectionDataType
        dataCenter: $dataCenter
        dataCenterH: $dataCenterH
        facetsSize: $facetsSize
        granuleDataFormat: $granuleDataFormat
        granuleDataFormatH: $granuleDataFormatH
        hasGranulesOrCwic: $hasGranulesOrCwic
        horizontalDataResolutionRange: $horizontalDataResolutionRange
        instrument: $instrument
        instrumentH: $instrumentH
        keyword: $keyword
        line: $line
        offset: $offset
        options: $options
        platform: $platform
        platformH: $platformH
        point: $point
        polygon: $polygon
        processingLevelIdH: $processingLevelIdH
        project: $project
        projectH: $projectH
        provider: $provider
        scienceKeywordsH: $scienceKeywordsH
        serviceType: $serviceType
        sortKey: $sortKey
        spatialKeyword: $spatialKeyword
        tagKey: $tagKey
        temporal: $temporal
        twoDCoordinateSystemName: $twoDCoordinateSystemName
        limit: $limit,
        cursor: $cursor
      ) {
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
    .then((response) => {
      const { data } = response

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
