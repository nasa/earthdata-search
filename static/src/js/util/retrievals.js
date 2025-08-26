import { pick } from 'lodash-es'
import { mbr } from '@edsc/geo-utils'

import {
  prepareGranuleParams,
  buildGranuleSearchParams,
  extractProjectCollectionGranuleParams
} from './granules'

import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'

import useEdscStore from '../zustand/useEdscStore'
import {
  getProjectCollectionsIds,
  getProjectCollections,
  getProjectCollectionsMetadata
} from '../zustand/selectors/project'

// Limit the fields we send with the retrieval to save space in the payload
const permittedCollectionMetadataFields = [
  'conceptId',
  'dataCenter',
  'datasetId',
  'directDistributionInformation',
  'isCSDA',
  'isOpenSearch',
  'links',
  'relatedUrls',
  'title',
  'shortName',
  'versionId'
]
const permittedAccessMethodFields = [
  'defaultConcatenation',
  'enableConcatenateDownload',
  'enableSpatialSubsetting',
  'enableTemporalSubsetting',
  'formDigest',
  'maxItemsPerOrder',
  'mbr',
  'model',
  'optionDefinition',
  'rawModel',
  'selectedOutputFormat',
  'selectedOutputProjection',
  'selectedVariables',
  'supportsBoundingBoxSubsetting',
  'supportsConcatenation',
  'supportsShapefileSubsetting',
  'swodlrData',
  'type',
  'url'
]

/**
 * Prepare parameters used in submitRetrieval() based on current Redux State
 * @param {Object} state Current Redux State
 * @returns Parameters used in submitRetrieval()
 */
export const prepareRetrievalParams = (state) => {
  const {
    authToken,
    router
  } = state

  const { shapefile } = useEdscStore.getState()

  // Retrieve data from Zustand
  const zustandState = useEdscStore.getState()
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)
  const collectionsMetadata = getProjectCollectionsMetadata(zustandState)
  const projectCollections = getProjectCollections(zustandState)
  const projectCollectionsIds = getProjectCollectionsIds(zustandState)

  const retrievalCollections = []

  projectCollectionsIds.forEach((collectionId) => {
    const { [collectionId]: projectCollection } = projectCollections
    const {
      accessMethods,
      granules,
      selectedAccessMethod
    } = projectCollection

    const {
      count: granuleCount,
      allIds: allGranuleIds = [],
      byId: byGranuleId = {}
    } = granules

    let totalGranuleLinks = 0

    allGranuleIds.forEach((granuleId) => {
      const { links = [] } = byGranuleId[granuleId]
      if (links.length > 0) {
        const totalLinksByGranuleId = links.length
        totalGranuleLinks += totalLinksByGranuleId
      }
    })

    const { [collectionId]: collectionMetadata } = collectionsMetadata

    const returnValue = {}

    returnValue.id = collectionId
    returnValue.granule_count = granuleCount
    returnValue.granule_link_count = totalGranuleLinks
    returnValue.collection_metadata = pick(collectionMetadata, permittedCollectionMetadataFields)

    const extractedGranuleParams = extractProjectCollectionGranuleParams(collectionId)

    const preparedParams = prepareGranuleParams(
      collectionsMetadata,
      extractedGranuleParams
    )

    const params = buildGranuleSearchParams(preparedParams)

    const { variables, selectedVariables } = accessMethods[selectedAccessMethod]

    returnValue.granule_params = params

    returnValue.access_method = pick(
      accessMethods[selectedAccessMethod],
      permittedAccessMethodFields
    )

    // Adding `selectedVariableNames` which is a derived field not included in `selectedAccessMethod`
    if (selectedVariables) {
      const variableNames = selectedVariables.map((variableKey) => {
        const { [variableKey]: variableObject } = variables
        const { name: variableName } = variableObject

        return variableName
      })

      if (variableNames) {
        returnValue.access_method.selectedVariableNames = variableNames
      }
    }

    const {
      boundingBox = [],
      circle = [],
      point = [],
      polygon = []
    } = params

    if (boundingBox.length > 0
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

      if (swLat && swLng && neLat && neLng) {
        // If an MBR was returned add it to the access method before submitting to the database
        returnValue.access_method.mbr = {
          swLat,
          swLng,
          neLat,
          neLng
        }
      }
    }

    retrievalCollections.push(returnValue)
  })

  const { search } = router.location
  const { shapefileId, selectedFeatures } = shapefile

  const { portalId } = useEdscStore.getState().portal

  const jsonData = {
    portalId,
    source: search,
    shapefileId,
    selectedFeatures
  }

  return {
    authToken,
    collections: [...retrievalCollections],
    environment: earthdataEnvironment,
    json_data: jsonData
  }
}
