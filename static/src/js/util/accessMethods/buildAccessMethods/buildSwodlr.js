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

  const {
    conceptId: serviceConceptId,
    longName,
    name,
    type: serviceType,
    url
  } = serviceItem

  const { urlValue } = url

  if (disableSwodlr !== 'true') {
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
