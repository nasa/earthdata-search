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
    startDate || '',
    endDate || ''
  ]

  if (isRecurring) {
    valuesToEncode.push(...[recurringDayStart || '', recurringDayEnd || ''])
  }

  if (valuesToEncode.filter(Boolean).length === 0 && !isRecurring) return undefined

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

  const values = string.split(',')
  const [
    startDate,
    endDate,
    recurringDayStart = '',
    recurringDayEnd = ''
  ] = values

  // We check `values.length > 2` because when `encodeTemporal` runs with `isRecurring: true`,
  // it appends the recurring day start and end values to the array (even if they are empty strings).
  // This means a recurring temporal string will always have at least 3 commas (length 4, e.g. "start,end,,").
  // This check ensures we preserve the `isRecurring: true` state when decoding the URL, even if the user
  // has enabled recurring but left the actual day inputs blank.
  const isRecurring = values.length > 2 || !!(recurringDayStart && recurringDayEnd)

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
