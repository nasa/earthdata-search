import { camelCase } from 'lodash'
import { generateFormDigest } from '../generateFormDigest'

export const buildEsiEcho = (serviceItem, disableOrdering) => {
  const supportsOrderOptions = ['esi', 'echo orders']

  const accessMethods = {}
  // Only process orderOptions if the service type uses orderOptions
  // Do not include access if orders are disabled

  const {
    orderOptions,
    type: serviceType,
    url,
    maxItemsPerOrder
  } = serviceItem

  if (supportsOrderOptions.includes(serviceType.toLowerCase()) && (disableOrdering !== 'true')) {
    const { urlValue } = url

    const { items: orderOptionsItems } = orderOptions
    if (orderOptionsItems === null) return {}

    orderOptionsItems.forEach((orderOptionItem, orderOptionIndex) => {
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
      }

      accessMethods[`${methodKey}${orderOptionIndex}`] = method
    })
  }

  return accessMethods
}
