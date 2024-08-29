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
  console.log('calling buildEsiEcho')
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
    // Pull out the esi and echo indices and increment them to have an accurate count
    const {
      orderOptions,
      type: serviceType,
      url,
      maxItemsPerOrder
    } = serviceItem

    const { urlValue } = url

    const { items: orderOptionsItems } = orderOptions
    if (orderOptionsItems === null) return {}
    console.log('about to go through orderOptions')

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

      console.log(`methodKey: ${methodKey}`)

      // `echoOrders` needs to be singular to match existing savedAccessConfigurations
      if (methodKey === 'echoOrders') {
        console.log('in EchoOrders')
        methodKey = 'echoOrder'
        accessMethods[`${methodKey}${echoIndex}`] = method
        echoIndex += 1
        console.log(`new echoIndex: ${echoIndex}`)
      } else {
        console.log('in esi')
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
