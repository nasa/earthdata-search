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
    byId: projectCollectionsById,
    collectionIds: projectCollectionIds
  } = project

  const projectCollections = []
  projectCollectionIds.forEach((collectionId) => {
    const collection = byId[collectionId]
    const projectCollection = projectCollectionsById[collectionId]

    const { granules, metadata, excludedGranuleIds = [] } = collection
    const { removedGranuleIds = [] } = projectCollection

    const returnValue = {}

    returnValue.id = collectionId
    returnValue.granule_count = granules.hits
    returnValue.collection_metadata = metadata

    const preparedParams = prepareGranuleParams(state, collectionId)

    // Add the excluded granule param right before we save the record to the
    // database to prevent it from being taking into account in the granules panel
    if (excludedGranuleIds.length > 0 || removedGranuleIds.length > 0) {
      // Check against unique values in the excluded and removed granule lists so we dont double
      // count granules that exist in both lists.
      const uniqueRemovedGranuleIds = [
        ...new Set([
          ...excludedGranuleIds,
          ...removedGranuleIds
        ])
      ]

      preparedParams.exclude = {
        concept_id: uniqueRemovedGranuleIds
      }

      // Since we didn't use the `exclude` param in the granule panel (on purpose) we
      // need to adjust the granule count if there were excluded or removed granules
      returnValue.granule_count = (granules.hits - uniqueRemovedGranuleIds.length)
    }

    const collectionConfig = projectCollectionsById[collectionId]
    const {
      accessMethods,
      selectedAccessMethod,
      addedGranuleIds = []
    } = collectionConfig

    if (addedGranuleIds.length) {
      // If addedGranuleIds exist on the project, set the conceptId on the project collection to an
      // array of the ids.
      preparedParams.conceptId = addedGranuleIds

      // Set the granule count for this collection to the number of items in addedGranuleIds.
      returnValue.granule_count = addedGranuleIds.length
    }

    const params = buildGranuleSearchParams(preparedParams, {
      includeConceptId: true
    })
    console.log('prepareRetrievalParams -> params', params)

    returnValue.granule_params = params

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
