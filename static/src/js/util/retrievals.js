import {
  prepareGranuleParams,
  buildGranuleSearchParams,
  extractProjectCollectionGranuleParams
} from './granules'
import { cmrEnv } from '../../../../sharedUtils/cmrEnv'

/**
 * Prepare parameters used in submitRetrieval() based on current Redux State
 * @param {object} state Current Redux State
 * @returns Parameters used in submitRetrieval()
 */
export const prepareRetrievalParams = (state) => {
  const {
    authToken,
    metadata = {},
    portal,
    project,
    router,
    shapefile
  } = state

  const { collections: collectionsMetadata } = metadata

  const { collections: projectCollections } = project
  const {
    byId: projectCollectionsById,
    allIds: projectCollectionsIds
  } = projectCollections

  const retrievalCollections = []
  projectCollectionsIds.forEach((collectionId) => {
    const { [collectionId]: projectCollection } = projectCollectionsById
    const { granules } = projectCollection
    const { hits: granuleCount } = granules

    const returnValue = {}

    returnValue.id = collectionId
    returnValue.granule_count = granuleCount
    returnValue.collection_metadata = collectionsMetadata

    const extractedGranuleParams = extractProjectCollectionGranuleParams(state, collectionId)

    const preparedParams = prepareGranuleParams(
      collectionsMetadata,
      extractedGranuleParams
    )

    const collectionConfig = projectCollectionsById[collectionId]
    const {
      accessMethods,
      selectedAccessMethod
    } = collectionConfig

    const params = buildGranuleSearchParams(preparedParams)

    returnValue.granule_params = params

    returnValue.access_method = accessMethods[selectedAccessMethod]

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

export default prepareRetrievalParams
