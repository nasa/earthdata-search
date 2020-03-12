/**
 * Convert a world view configuration object to a CMR search query object
 * @param {Object} config A configuration object retrieved from Worldview
 */
export const configToCmrQuery = (config) => {
  const topLevelConfigs = []

  const supportedCmrQueryKeys = {
    conceptId: 'concept_id',
    dataCenterId: 'provider',
    shortName: 'short_name'
  }

  Object.keys(config).forEach((configKey) => {
    const query = config[configKey]

    // Converts the key from worldview to a cmr search key
    const translatedCmrKey = supportedCmrQueryKeys[configKey]

    if (Object.keys(supportedCmrQueryKeys).includes(configKey)) {
      const queryConditions = [].concat(query)

      if (queryConditions.length > 1) {
        const orCondition = []
        queryConditions.forEach((queryCondition) => {
          orCondition.push({ [translatedCmrKey]: queryCondition })
        })

        topLevelConfigs.push({ or: orCondition })
      } else {
        topLevelConfigs.push({ [translatedCmrKey]: queryConditions[0] })
      }
    }
  })

  if (topLevelConfigs.length > 1) {
    return {
      condition: {
        and: topLevelConfigs
      }
    }
  }

  return {
    condition: topLevelConfigs[0]
  }
}
