/**
 * Encodes a Temporal object into a string
 * @param {object} temporal Temporal object
 * @return {string} A `,` delimited string of the temporal values
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

  const encodedString = valuesToEncode.filter(Boolean).join(',')

  // TODO: Strip empty elements then join
  if (encodedString === '') return undefined

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
