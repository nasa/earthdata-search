import cleanDeep from 'clean-deep'
import snakeCaseKeys from 'snakecase-keys'

import { prepareGranuleParams, buildGranuleSearchParams } from './granules'


/**
 * Prepare parameters used in submitOrders() based on current Redux State
 * @param {object} state Current Redux State
 * @returns Parameters used in submitOrders()
 */
export const prepareOrderParams = (state) => {
  const {
    authToken,
    metadata = {},
    project
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
    const { granules } = projectCollection

    const returnValue = {}

    returnValue.id = collectionId
    returnValue.granule_count = granules.hits

    const params = buildGranuleSearchParams(prepareGranuleParams(state, collectionId))
    const snakeCaseParams = snakeCaseKeys(params)
    const granuleParams = cleanDeep(snakeCaseParams)
    returnValue.granule_params = granuleParams

    const collectionConfig = configById[collectionId]
    const { accessMethods, selectedAccessMethod } = collectionConfig
    returnValue.access_method = accessMethods[selectedAccessMethod]

    projectCollections.push(returnValue)
  })

  return {
    authToken,
    collections: [...projectCollections],
    environment: 'prod'
  }
}

export default prepareOrderParams
