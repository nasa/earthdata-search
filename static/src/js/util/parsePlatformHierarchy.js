import { platformTypes } from './platformTypes'

/**
 * Parses a platform hierarchy string into individual parts
 * @param {String} value Colon-separated string of a platform hierarchy
 */
export const parsePlatformHierarchy = (value) => {
  const values = value.split(':')
  const returnValue = {}

  values.forEach((keywordValue, index) => {
    if (keywordValue) {
      returnValue[platformTypes[index]] = keywordValue
    }
  })

  return returnValue
}
