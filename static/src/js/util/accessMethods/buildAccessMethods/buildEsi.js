import { getApplicationConfig } from '../../../../../../sharedUtils/config'

import { generateFormDigest } from '../generateFormDigest'

/**
 * Builds the ESI access method
 * @param {object} serviceItem serviceItem in the Collection Metadata
 * @param {boolean} disabledOrdering true if ordering is disabled
 * @returns {object} Access method for ESI
 */
export const buildEsi = (serviceItem) => {
  const accessMethodItems = []
  // Only process orderOptions if the service type uses orderOptions
  // Do not include access if orders are disabled
  const { disableOrdering } = getApplicationConfig()

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

      accessMethodItems.push(method)
    })
  }

  return accessMethodItems
}
