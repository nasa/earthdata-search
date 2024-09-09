import { camelCase } from 'lodash-es'

import * as accessMethodTypes from '../../constants/accessMethodTypes'
import { buildEcho } from './buildAccessMethods/buildEcho'
import { buildEsi } from './buildAccessMethods/buildEsi'
import { buildOpendap } from './buildAccessMethods/buildOpendap'
import { buildHarmony } from './buildAccessMethods/buildHarmony'
import { buildSwodlr } from './buildAccessMethods/buildSwodlr'
import { buildDownload } from './buildAccessMethods/buildDownload'

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
export const reduceAccessMethods = (items = []) => {
  let esiIndex = 0
  let echoIndex = 0
  let harmonyIndex = 0

  const accessMethods = items.reduce((methods, item) => {
    const { type: serviceType } = item

    const methodKey = serviceType ? formatServiceType(serviceType) : ''

    const updatedAccessMethods = { ...methods }

    switch (methodKey) {
      case (accessMethodTypes.ESI):
        updatedAccessMethods[`${methodKey}${esiIndex}`] = item

        esiIndex += 1
        break
      case (accessMethodTypes.ECHO_ORDERS):
        updatedAccessMethods[`${methodKey}${echoIndex}`] = item

        echoIndex += 1
        break
      case (accessMethodTypes.HARMONY):
        updatedAccessMethods[`${methodKey}${harmonyIndex}`] = item

        harmonyIndex += 1
        break
      // No need to create a "accessMethodKey" since you can only have one openDap or SWODLR
      case (accessMethodTypes.OPENDAP):
        updatedAccessMethods[methodKey] = item

        break
      case (accessMethodTypes.SWODLR):
        updatedAccessMethods[methodKey] = item

        break
      default:
        break
    }

    return updatedAccessMethods
  }, {})

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

  const { items: serviceItems = [] } = services

  const buildMethods = {
    echoOrders: (serviceItem) => buildEcho(serviceItem),
    esi: (serviceItem) => buildEsi(serviceItem),
    opendap: (serviceItem, params) => buildOpendap(serviceItem, params),
    harmony: (serviceItem, params) => buildHarmony(serviceItem, params),
    swodlr: (serviceItem) => buildSwodlr(serviceItem),
    downloads: () => buildDownload(granules, isOpenSearch)
  }

  const nonDownloadMethodItems = serviceItems.flatMap((serviceItem) => {
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
    if (!Object.values(accessMethodTypes).includes(formattedServiceType)) return {}

    const params = {
      associatedVariables
    }

    const items = buildMethods[formattedServiceType](serviceItem, params)

    console.log(items)

    return items
  }, [])

  const nonDownloadMethods = reduceAccessMethods(nonDownloadMethodItems)

  const accessMethods = {
    ...nonDownloadMethods,
    ...buildMethods.downloads()
  }

  return accessMethods
}
