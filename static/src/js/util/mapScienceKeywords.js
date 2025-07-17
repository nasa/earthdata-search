import { scienceKeywordTypes } from './scienceKeywordTypes'

/**
 * Maps a science keyword string into individual parts
 * @param {String} value Colon-separated string of a science keyword
 */
export const mapScienceKeywords = (value) => {
  const values = value.split(':')
  const returnValue = {}

  values.forEach((keywordValue, index) => {
    if (keywordValue) {
      returnValue[scienceKeywordTypes[index]] = keywordValue
    }
  })

  return returnValue
}
