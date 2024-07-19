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

  let harmonyIndex = 0
  const { items: serviceItems = null } = services

  const { disableOrdering, disableSwodlr } = getApplicationConfig()

  const buildMethods = {
    esi: (serviceItem, params) => buildEsiEcho(serviceItem, params.disableOrdering),
    'echo orders': (serviceItem, params) => buildEsiEcho(serviceItem, params.disableOrdering),
    opendap: (serviceItem, params) => buildOpendap(serviceItem, params.associatedVariables),
    // eslint-disable-next-line max-len
    harmony: (serviceItem, params) => buildHarmony(serviceItem, params.associatedVariables, params.harmonyIndex),
    swodlr: (serviceItem, params) => buildSwodlr(serviceItem, params.disableSwodlr),
    downloads: () => buildDownload(granules, isOpenSearch)
  }

  const nonDownloadMethods = serviceItems !== null ? serviceItems.reduce((methods, serviceItem) => {
    let associatedVariables = collectionAssociatedVariables
    const {
      type: serviceType,
      variables: serviceAssociatedVariables = {}
    } = serviceItem

    // Overwrite variables if there are variables associated to the service record
    if (serviceAssociatedVariables.items && serviceAssociatedVariables.items.length > 0) {
      associatedVariables = serviceAssociatedVariables
    }

    const lowerServiceType = serviceType.toLowerCase()

    // Only process service types that EDSC supports
    const supportedServiceTypes = ['esi', 'echo orders', 'opendap', 'harmony', 'swodlr']
    if (!supportedServiceTypes.includes(lowerServiceType)) return {}

    const params = {
      disableOrdering,
      harmonyIndex,
      associatedVariables,
      disableSwodlr
    }

    const updatedMethods = {
      ...methods,
      ...buildMethods[lowerServiceType](serviceItem, params)
    }

    if (lowerServiceType === 'harmony') {
      harmonyIndex += 1
    }

    return updatedMethods
  }, {}) : {}

  const accessMethods = {
    ...nonDownloadMethods,
    ...buildMethods.downloads()
  }

  return accessMethods
}
