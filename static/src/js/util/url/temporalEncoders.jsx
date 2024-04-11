/**
 * Encodes a Temporal object into a string
 * @param {Object} temporal Temporal object
 * @return {String} A `,` delimited string of the temporal values
 */
export const encodeTemporal = (temporal) => {
  if (!temporal) return undefined

  const {
    endDate,
    startDate,
    recurringDayStart,
    recurringDayEnd,
    isRecurring
  } = temporal

  const valuesToEncode = [
    startDate,
    endDate
  ]

  if (isRecurring) {
    valuesToEncode.push(...[recurringDayStart, recurringDayEnd])
  }

  if (valuesToEncode.filter(Boolean).length === 0) return undefined

  const encodedString = valuesToEncode.join(',')

  return encodedString
}

/**
 * Decodes a Temporal parameter string into an object
 * @param {String} string A `,` delimited string of the temporal values
 * @return {Object} Temporal object
 */
export const decodeTemporal = (string) => {
  if (!string) {
    return {}
  }

  const [
    startDate,
    endDate,
    recurringDayStart = '',
    recurringDayEnd = ''
  ] = string.split(',')

  const isRecurring = !!(recurringDayStart && recurringDayEnd)

  const temporal = {
    endDate,
    startDate,
    recurringDayStart,
    recurringDayEnd,
    isRecurring
  }

  return {
    ...temporal
  }
}
