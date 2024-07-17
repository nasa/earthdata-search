import { getApplicationConfig } from '../../../../../sharedUtils/config'

import { buildEsiEcho } from './buildAccessMethods/buildEsiEcho'
import { buildOpendap } from './buildAccessMethods/buildOpendap'
import { buildHarmony } from './buildAccessMethods/buildHarmony'
import { buildSwodlr } from './buildAccessMethods/buildSwodlr'
import { buildDownload } from './buildAccessMethods/buildDownload'

/**
 * Builds the different access methods available for the provided collection
 * @param {object} collectionMetadata Collection Metadata
 * @param {boolean} isOpenSearch Is the collection an open search collection
 * @returns {object} Access methods
 */
export const buildAccessMethods = (collectionMetadata, isOpenSearch) => {
  const {
    granules = {},
    services = {},
    variables: collectionAssociatedVariables = {}
  } = collectionMetadata

  let accessMethods = {}
  let harmonyIndex = 0
  const { items: serviceItems = null } = services

  const { disableOrdering, disableSwodlr } = getApplicationConfig()

  if (serviceItems !== null) {
    serviceItems.forEach((serviceItem) => {
      let associatedVariables = collectionAssociatedVariables
      const {
        type: serviceType,
        variables: serviceAssociatedVariables = {}
      } = serviceItem

      // Overwrite variables if there are variables associated to the service record
      if (serviceAssociatedVariables.items && serviceAssociatedVariables.items.length > 0) {
        associatedVariables = serviceAssociatedVariables
      }

      // Only process service types that EDSC supports
      const supportedServiceTypes = ['esi', 'echo orders', 'opendap', 'harmony', 'swodlr']
      if (!supportedServiceTypes.includes(serviceType.toLowerCase())) return

      accessMethods = {
        ...buildEsiEcho(serviceItem, disableOrdering),
        ...buildOpendap(serviceItem, associatedVariables),
        // eslint-disable-next-line no-plusplus
        ...buildHarmony(serviceItem, associatedVariables, harmonyIndex++),
        ...buildSwodlr(serviceItem, disableSwodlr),
        ...accessMethods
      }
    })
  }

  accessMethods = {
    ...buildDownload(granules, isOpenSearch),
    ...accessMethods
  }

  return accessMethods
}
