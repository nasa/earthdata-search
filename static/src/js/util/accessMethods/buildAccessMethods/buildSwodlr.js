export const buildSwodlr = (serviceItem, disableSwodlr) => {
  const accessMethods = {}

  const {
    conceptId: serviceConceptId,
    longName,
    name,
    type: serviceType,
    url
  } = serviceItem

  const { urlValue } = url

  if (serviceType.toLowerCase() === 'swodlr' && (disableSwodlr !== 'true')) {
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
