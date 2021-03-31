/**
 * Returns DirectDistributionInformation from collection metadata, or an empty object if it doesn't exist
 * @param {Object} json JSON metadata
 */
export const buildDirectDistributionInformation = (json) => {
  const { directDistributionInformation } = json

  if (!directDistributionInformation) return {}

  return directDistributionInformation
}

export default buildDirectDistributionInformation
