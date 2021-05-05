import { EXPORT_FINISHED, EXPORT_STARTED } from '../constants/actionTypes'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { buildCollectionSearchParams, prepareCollectionParams } from '../util/collections'
import ExportSearchRequest from '../util/request/exportSearchRequest'
import { handleError } from './errors'

const onExportStarted = () => ({
  type: EXPORT_STARTED
})

const onExportFinished = () => ({
  type: EXPORT_FINISHED
})

/**
 * Fetch the collection search export in the given format
 * @param {String} format Format for the export (JSON, CSV)
 */
export const exportSearch = format => (dispatch, getState) => {
  dispatch(onExportStarted())

  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const collectionParams = prepareCollectionParams(state)

  const {
    authToken
  } = collectionParams

  const graphRequestObject = new ExportSearchRequest(authToken, earthdataEnvironment)

  const graphQuery = `
    query SearchCollections(
      $boundingBox: [String]
      $circle: [String]
      $collectionDataType: [String]
      $dataCenter: String
      $dataCenterH: [String]
      $facetsSize: Int
      $granuleDataFormat: String
      $granuleDataFormatH: [String]
      $hasGranulesOrCwic: Boolean
      $horizontalDataResolutionRange: String
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
      $scienceKeywordsH: [String]
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
        }
      }
    }`

  const response = graphRequestObject.search(graphQuery, {
    ...buildCollectionSearchParams(collectionParams),
    limit: 500
  }, format)
    .then((response) => {
      const { data } = response

      // Create a blob with the text data from the export
      const exportData = JSON.stringify(data)
      const url = window.URL.createObjectURL(new Blob([exportData]))

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

      dispatch(onExportFinished())
    })
    .catch((error) => {
      dispatch(onExportFinished())

      dispatch(handleError({
        error,
        action: 'exportSearch',
        resource: 'collections',
        graphRequestObject
      }))
    })

  return response
}
