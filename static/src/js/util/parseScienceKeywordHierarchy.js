import { scienceKeywordTypes } from './scienceKeywordTypes'

/**
 * Parses a science keyword hierarchy string into individual parts
 * @param {String} value Colon-separated string of a science keyword hierarchy
 */
export const parseScienceKeywordHierarchy = (value) => {
  const values = value.split(':')
  const returnValue = {}

  values.forEach((keywordValue, index) => {
    if (keywordValue) {
      returnValue[scienceKeywordTypes[index]] = keywordValue
    }
  })

  return returnValue
}
