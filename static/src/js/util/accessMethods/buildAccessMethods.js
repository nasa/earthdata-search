import { camelCase } from 'lodash-es'

import { buildEcho } from './buildAccessMethods/buildEcho'
import { buildEsi } from './buildAccessMethods/buildEsi'
import { buildOpendap } from './buildAccessMethods/buildOpendap'
import { buildHarmony } from './buildAccessMethods/buildHarmony'
import { buildSwodlr } from './buildAccessMethods/buildSwodlr'
import { buildDownload } from './buildAccessMethods/buildDownload'

const supportedServiceTypes = ['esi', 'echoOrders', 'opendap', 'harmony', 'swodlr']

/**
 * Formats a service type into a lower case and camelCase version
 * @param {string} serviceType serviceType
 * @returns {string} formatted service typpe
 */
export const formatServiceType = (serviceType) => {
  const lowerServiceType = serviceType.toLowerCase()

  return camelCase(lowerServiceType)
}

/**
 * Reduces a list of all the accessMethods into a single object with correctly incremented/listed values
 * @param {Array} items list of accessMethod items
 * @returns {Object} single object of all the accessMethod items
 */
export const reduceAccessMethods = (items) => {
  let esiIndex = 0
  let echoIndex = 0
  let harmonyIndex = 0

  const itemsToReduce = [...[{}], ...items]

  const accessMethods = itemsToReduce.reduce((methods, item) => {
    const { type: serviceType } = item

    const methodKey = serviceType ? formatServiceType(serviceType) : ''

    const updatedAccessMethods = { ...methods }

    switch (methodKey) {
      case ('esi'):
        updatedAccessMethods[`${methodKey}${esiIndex}`] = item

        esiIndex += 1

        return updatedAccessMethods
      case ('echoOrders'):
        updatedAccessMethods[`${methodKey}${echoIndex}`] = item

        echoIndex += 1

        return updatedAccessMethods
      case ('harmony'):
        updatedAccessMethods[`${methodKey}${harmonyIndex}`] = item

        harmonyIndex += 1

        return updatedAccessMethods
      // No need to create a "accessMethodKey" since you can only have one openDap or SWODLR
      case ('opendap'):
        updatedAccessMethods[methodKey] = item

        return updatedAccessMethods
      case ('swodlr'):
        updatedAccessMethods[methodKey] = item

        return updatedAccessMethods
      default:

        return updatedAccessMethods
    }
  })

  return accessMethods
}

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

  const { items: serviceItems = null } = services

  const buildMethods = {
    echoOrders: (serviceItem) => buildEcho(serviceItem),
    esi: (serviceItem) => buildEsi(serviceItem),
    opendap: (serviceItem, params) => buildOpendap(serviceItem, params),
    harmony: (serviceItem, params) => buildHarmony(serviceItem, params),
    swodlr: (serviceItem) => buildSwodlr(serviceItem),
    downloads: () => buildDownload(granules, isOpenSearch)
  }

  const nonDownloadMethodItems = serviceItems === null
    ? {}
    : serviceItems.flatMap((serviceItem) => {
      let associatedVariables = collectionAssociatedVariables
      const {
        type: serviceType,
        variables: serviceAssociatedVariables = {}
      } = serviceItem

      // Overwrite variables if there are variables associated to the service record
      if (serviceAssociatedVariables.items && serviceAssociatedVariables.items.length > 0) {
        associatedVariables = serviceAssociatedVariables
      }

      const formattedServiceType = formatServiceType(serviceType)

      // Only process service types that EDSC supports
      if (!supportedServiceTypes.includes(formattedServiceType)) return {}

      const params = {
        associatedVariables
      }

      const items = buildMethods[formattedServiceType](serviceItem, params)

      return items
    }, {})

  // The ...[{}] is necessary because when running a .reduce, it uses the first entry as the base for the built Object.
  const nonDownloadMethods = nonDownloadMethodItems.length > 0
    ? reduceAccessMethods(nonDownloadMethodItems) : []

  const accessMethods = {
    ...nonDownloadMethods,
    ...buildMethods.downloads()
  }

  return accessMethods
}
