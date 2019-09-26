import { prepareGranuleParams, buildGranuleSearchParams } from './granules'
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

  const { collections } = metadata
  const { byId } = collections
  const {
    byId: configById,
    collectionIds: projectIds
  } = project

  const projectCollections = []
  projectIds.forEach((collectionId) => {
    const projectCollection = byId[collectionId]
    const { granules, metadata, excludedGranuleIds = [] } = projectCollection

    const returnValue = {}

    returnValue.id = collectionId
    returnValue.granule_count = granules.hits
    returnValue.collection_metadata = metadata

    const preparedParams = prepareGranuleParams(state, collectionId)

    // Add the excluded granule param right before we save the record to the
    // database to prevent it from being taking into account in the granules panel
    if (excludedGranuleIds.length > 0) {
      preparedParams.exclude = {
        concept_id: excludedGranuleIds
      }

      // Since we didn't use the `exclude` param in the granule panel (on purpose) we
      // need to adjust the granule count if there were excluded granules
      returnValue.granule_count = (granules.hits - excludedGranuleIds.length)
    }

    const params = buildGranuleSearchParams(preparedParams)
    returnValue.granule_params = params

    const collectionConfig = configById[collectionId]
    const { accessMethods, selectedAccessMethod } = collectionConfig
    returnValue.access_method = accessMethods[selectedAccessMethod]

    projectCollections.push(returnValue)
  })

  const { search } = router.location
  const { shapefileId } = shapefile

  const { portalId } = portal

  const jsonData = {
    portalId,
    source: search,
    shapefileId
  }

  return {
    authToken,
    collections: [...projectCollections],
    environment: cmrEnv(),
    json_data: jsonData
  }
}

export default prepareRetrievalParams
