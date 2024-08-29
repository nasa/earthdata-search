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
  let echoIndex = 0
  let esiIndex = 0

  const { items: serviceItems = null } = services

  const buildMethods = {
    esi: (serviceItem, params) => buildEsiEcho(serviceItem, params),
    'echo orders': (serviceItem, params) => buildEsiEcho(serviceItem, params),
    opendap: (serviceItem, params) => buildOpendap(serviceItem, params),
    harmony: (serviceItem, params) => buildHarmony(serviceItem, params),
    swodlr: (serviceItem) => buildSwodlr(serviceItem),
    downloads: () => buildDownload(granules, isOpenSearch)
  }

  const nonDownloadMethods = serviceItems === null
    ? {}
    : serviceItems.reduce((methods, serviceItem) => {
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
        harmonyIndex,
        echoIndex,
        esiIndex,
        associatedVariables
      }

      const builtMethod = buildMethods[lowerServiceType](serviceItem, params)

      const {
        accessMethods: newAccessMethods,
        esiIndex: newEsiIndex,
        echoIndex: newEchoIndex
      } = builtMethod

      esiIndex = newEsiIndex || esiIndex
      echoIndex = newEchoIndex || echoIndex

      console.log(lowerServiceType)

      console.log(`esiIndex: ${esiIndex}\t newEsiIndex: ${newEsiIndex}`)
      console.log(`echoIndex: ${echoIndex}\t newEchoIndex: ${newEchoIndex}`)

      const updatedMethods = {
        ...methods,
        ...newAccessMethods
      }

      if (lowerServiceType === 'harmony') {
        harmonyIndex += 1
      }

      return updatedMethods
    }, {})

  const accessMethods = {
    ...nonDownloadMethods,
    ...buildMethods.downloads()
  }

  return accessMethods
}
