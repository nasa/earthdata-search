import { prepareGranuleParams, buildGranuleSearchParams } from './granules'
import { cmrEnv } from '../../../../sharedUtils/cmrEnv'


/**
 * Prepare parameters used in submitRetrieval() based on current Redux State
 * @param {object} state Current Redux State
 * @returns Parameters used in submitRetrieval()
 */
export const prepareOrderParams = (state) => {
  const {
    authToken,
    metadata = {},
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
    const { granules, metadata } = projectCollection

    const returnValue = {}

    returnValue.id = collectionId
    returnValue.granule_count = granules.hits
    returnValue.collection_metadata = metadata

    const params = buildGranuleSearchParams(prepareGranuleParams(state, collectionId))
    returnValue.granule_params = params

    const collectionConfig = configById[collectionId]
    const { accessMethods, selectedAccessMethod } = collectionConfig
    returnValue.access_method = accessMethods[selectedAccessMethod]

    projectCollections.push(returnValue)
  })

  const { source } = router.location
  const { shapefileId } = shapefile

  const jsonData = {
    source,
    shapefileId
  }

  return {
    authToken,
    collections: [...projectCollections],
    environment: cmrEnv(),
    json_data: jsonData
  }
}

export default prepareOrderParams
