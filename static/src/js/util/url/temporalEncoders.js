/**
 * Encodes a Temporal object into a string
 * @param {object} temporal Temporal object
 * @return {string} A `,` delimited string of the temporal values
 */
export const encodeTemporal = (temporal) => {
  if (!temporal) return undefined

  const {
    endDate,
    startDate
  } = temporal

  const encodedString = [
    startDate,
    endDate
  ].join(',')

  if (encodedString === ',') return undefined

  return encodedString
}


/**
 * Decodes a Temporal parameter string into an object
 * @param {string} string A `,` delimited string of the temporal values
 * @return {object} Temporal object
 */
export const decodeTemporal = (string) => {
  if (!string) {
    return {}
  }

  const [startDate, endDate] = string.split(',')

  const temporal = {
    endDate,
    startDate
  }

  return {
    ...temporal
  }
}
