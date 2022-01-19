import { timelineIntervals } from '../timeline'
import getObjectKeyByValue from '../object'

/**
 * Encodes a Timeline object into an encoded object
 * @param {object} timelineQuery Timeline query object
 * @param {string} pathname Pathname string from react-router
 * @return {string} A `!` delimited string of the timeline values
 */
export const encodeTimeline = (timelineQuery, pathname) => {
  if (pathname === '/search') return ''
  if (!timelineQuery) return ''

  const {
    center,
    interval,
    start,
    end
  } = timelineQuery

  if (!center && !start && !end) return ''

  const encodedStart = start ? start / 1000 : ''
  const encodedEnd = end ? end / 1000 : ''

  const encodedString = [center / 1000, timelineIntervals[interval], encodedStart, encodedEnd].join('!')
  // if there is no center, return an empty string
  if (encodedString[0] === '!') return ''

  return {
    tl: encodedString
  }
}

/**
 * Decodes a parameter object into a Timeline object
 * @param {object} params URL parameter object from parsing the URL parameter string
 * @return {object} Timeline object with query and state
 */
export const decodeTimeline = (params) => {
  const { tl: timeline } = params

  if (!timeline) return undefined

  const [center, intervalNum, start, end] = timeline.split('!')

  const interval = getObjectKeyByValue(timelineIntervals, intervalNum)
  const query = {
    center: parseInt(center, 10) * 1000 || undefined,
    end: parseInt(end, 10) * 1000 || undefined,
    interval,
    start: parseInt(start, 10) * 1000 || undefined
  }

  return query
}
