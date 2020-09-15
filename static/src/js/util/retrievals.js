import {
  prepareGranuleParams,
  buildGranuleSearchParams,
  extractProjectCollectionGranuleParams
} from './granules'

import { cmrEnv } from '../../../../sharedUtils/cmrEnv'
import {
  getProjectCollections,
  getProjectCollectionsIds,
  getProjectCollectionsMetadata
} from '../selectors/project'
import { mbr } from './map/mbr'
import { getCmrFacetParams } from '../selectors/facetParams'

/**
 * Prepare parameters used in submitRetrieval() based on current Redux State
 * @param {Object} state Current Redux State
 * @returns Parameters used in submitRetrieval()
 */
export const prepareRetrievalParams = (state) => {
  const {
    authToken,
    portal,
    router,
    shapefile
  } = state

  // Retrieve data from Redux using selectors
  const collectionsMetadata = getProjectCollectionsMetadata(state)
  const projectCollections = getProjectCollections(state)
  const projectCollectionsIds = getProjectCollectionsIds(state)

  const retrievalCollections = []

  projectCollectionsIds.forEach((collectionId) => {
    const { [collectionId]: projectCollection } = projectCollections
    const {
      accessMethods,
      granules,
      selectedAccessMethod
    } = projectCollection

    const { hits: granuleCount } = granules

    const { [collectionId]: collectionMetadata } = collectionsMetadata

    const returnValue = {}

    returnValue.id = collectionId
    returnValue.granule_count = granuleCount
    returnValue.collection_metadata = collectionMetadata

    const extractedGranuleParams = extractProjectCollectionGranuleParams(state, collectionId)
    const cmrFacetParams = getCmrFacetParams(state)

    const preparedParams = prepareGranuleParams(
      collectionsMetadata,
      extractedGranuleParams,
      cmrFacetParams
    )

    const params = buildGranuleSearchParams(preparedParams)

    returnValue.granule_params = params
    returnValue.access_method = accessMethods[selectedAccessMethod]

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

  const { portalId } = portal

  const jsonData = {
    portalId,
    source: search,
    shapefileId,
    selectedFeatures
  }

  return {
    authToken,
    collections: [...retrievalCollections],
    environment: cmrEnv(),
    json_data: jsonData
  }
}
