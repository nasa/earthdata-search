import { timelineIntervals } from '../timeline'
import getObjectKeyByValue from '../object'

/**
 * Encodes a Timeline object into a string
 * @param {object} query Timeline object with query and state
 * @return {string} A `!` delimited string of the timeline values
 */
export const encodeTimeline = (timeline) => {
  if (!timeline) return ''
  const {
    collectionId,
    query,
    state
  } = timeline

  if (!collectionId) return ''

  const {
    interval,
    start,
    end
  } = query
  const { center } = state

  const encodedString = [center, timelineIntervals[interval], start, end].join('!')
  // if there is no center, return an empty string
  if (encodedString[0] === '!') return ''

  return encodedString
}


/**
 * Decodes a timeline parameter string into an object
 * @param {string} string A `!` delimited string of the timeline values
 * @return {object} Timeline object with query and state
 */
export const decodeTimeline = (string) => {
  if (!string) {
    return {}
  }

  const [center, intervalNum, start, end] = string.split('!')

  const state = { center }

  const interval = getObjectKeyByValue(timelineIntervals, intervalNum)
  const query = {
    interval,
    start,
    end
  }
  return {
    query,
    state
  }
}
