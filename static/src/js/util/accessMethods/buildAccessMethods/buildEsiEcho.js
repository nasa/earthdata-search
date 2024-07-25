import { camelCase } from 'lodash-es'

import { getApplicationConfig } from '../../../../../../sharedUtils/config'

import { generateFormDigest } from '../generateFormDigest'

/**
 * Builds the ESI or Echo Ordering access method
 * @param {object} serviceItem serviceItem in the Collection Metadata
 * @param {boolean} disabledOrdering true if ordering is disabled
 * @returns {object} Access method for ESI or Echo Orders
 */
export const buildEsiEcho = (serviceItem, params) => {
  const accessMethods = {}
  // Only process orderOptions if the service type uses orderOptions
  // Do not include access if orders are disabled
  const { disableOrdering } = getApplicationConfig()

  const {
    esiIndex: initEsiIndex,
    echoIndex: initEchoIndex
  } = params

  let esiIndex = initEsiIndex
  let echoIndex = initEchoIndex

  if (disableOrdering !== 'true') {
    // Pull out the esi and echo indeces and increment them to have an accurate count
    const {
      orderOptions,
      type: serviceType,
      url,
      maxItemsPerOrder
    } = serviceItem

    const { urlValue } = url

    const { items: orderOptionsItems } = orderOptions
    if (orderOptionsItems === null) return {}

    orderOptionsItems.forEach((orderOptionItem) => {
      const {
        conceptId: orderOptionConceptId,
        form,
        name: orderOptionName
      } = orderOptionItem

      const method = {
        type: serviceType,
        maxItemsPerOrder,
        url: urlValue,
        optionDefinition: {
          conceptId: orderOptionConceptId,
          name: orderOptionName
        },
        form,
        formDigest: generateFormDigest(form)
      }

      let methodKey = camelCase(serviceType)

      // `echoOrders` needs to be singular to match existing savedAccessConfigurations
      if (methodKey === 'echoOrders') {
        methodKey = 'echoOrder'
        accessMethods[`${methodKey}${echoIndex}`] = method
        echoIndex += 1
      } else {
        accessMethods[`${methodKey}${esiIndex}`] = method
        esiIndex += 1
      }
    })
  }

  return {
    accessMethods,
    echoIndex,
    esiIndex
  }
}
