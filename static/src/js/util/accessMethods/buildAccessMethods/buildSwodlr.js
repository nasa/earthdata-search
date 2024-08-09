import { getApplicationConfig } from '../../../../../../sharedUtils/config'

/**
 * Builds the swodlr access method
 * @param {object} serviceItem serviceItem in the Collection Metadata
 * @param {boolean} disabledSwodlr true if the swodlr acceessMethod disabled
 * @returns {object} Access method for SWODLR
 */
export const buildSwodlr = (serviceItem) => {
  const accessMethods = {}

  const { disableSwodlr } = getApplicationConfig()

  if (disableSwodlr !== 'true') {
    const {
      conceptId: serviceConceptId,
      longName,
      name,
      type: serviceType,
      url
    } = serviceItem

    const { urlValue } = url

    accessMethods.swodlr = {
      id: serviceConceptId,
      isValid: true,
      longName,
      name,
      type: serviceType,
      supportsSwodlr: true,
      url: urlValue
    }
  }

  return accessMethods
}
