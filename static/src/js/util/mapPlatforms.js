import { platformTypes } from './platformTypes'

/**
 * Maps a platform string into individual parts
 * @param {String} value Colon-separated string of a platform
 */
export const mapPlatforms = (value) => {
  const values = value.split(':')
  const returnValue = {}

  values.forEach((keywordValue, index) => {
    if (keywordValue) {
      returnValue[platformTypes[index]] = keywordValue
    }
  })

  return returnValue
}
