const sizeUnits = ['MB', 'GB', 'TB', 'PB', 'EB']

/**
 * Convert granule size into the appropriate size and unit for readability
 * @param {string} sizeInMB Granule size from granule metadata
 * @returns {object} Object with converted size and unit values
 */
export const convertSize = (sizeInMB) => {
  let size = parseFloat(sizeInMB)
  const units = [...sizeUnits]

  while ((size > 1024) && (units.length > 1)) {
    size = parseFloat(size) / 1024
    units.shift()
  }

  // Only call toFixed() when the size is a truthy value. Otherwise, toFixed will
  // return a string when called on an NaN object.
  return {
    size: !Number.isNaN(size) ? size.toFixed(1) : size,
    unit: units[0]
  }
}

/**
 * Convert a readable size/unit object to size in MB
 * @param {object} sizeObj Object with size and unit values
 * @returns {number} Size in MB
 */
export const convertSizeToMB = (sizeObj) => {
  if (!sizeObj) return 0
  const { size, unit } = sizeObj
  const upcaseUnit = unit.toUpperCase()

  if (upcaseUnit === 'MB') return parseFloat(size)

  const unitIndex = sizeUnits.indexOf(upcaseUnit)
  if (unitIndex > 0) return parseFloat(size) * (1024 ** unitIndex)

  return 0
}
