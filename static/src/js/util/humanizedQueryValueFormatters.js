import { castArray } from 'lodash'
import moment from 'moment'

/**
 * Formats a boolean from a query object
 * @param {Node} value - The boolean value from a query object
 * @returns {Any} - Returns undefined for any truthy values, so their value will be omitted, showing only the key
 */
export const formatBoolean = (value) => {
  if (value) return undefined
  return value
}

/**
 * Formats a set of point string
 * @param {String} value - The points string from a query object
 * @returns {Array} An array in the following format: [x, y]
 */
export const formatPoint = (coordinateString) => coordinateString
  // Split the string into coordinate pairs
  .match(/[^,]+,[^,]+/g)
  .map(
    // Reverse the points
    (coordinates) => coordinates.split(',').reverse()
  )

/**
 * Formats a set of points from a query object
 * @param {Array} value - The points string from a query object
 * @returns {Array} An array in the following format: [[x1, y1], [x2, y2], ...]
 */
export const formatPoints = (value) => castArray(value).map(
  (coordinateString) => formatPoint(coordinateString)
)

/**
 * Formats a circle from a query object
 * @param {Node} value - The circle param from a query object
 * @returns {Array} An array in the following format: [x, y, radius]
 */
export const formatCircle = (value) => castArray(value).map((circle) => {
  const [y, x, radius] = circle.split(',')
  return [x, y, radius]
})

/**
 * Formats a temporal query string from a query object
 * @param {Node} value - The temporal string param from a query object
 * @returns {Array} An array in the following format: [start, end, recurringStartYear, recurringEndYear]
 */
export const formatTemporal = (value) => {
  const [start, end, recurringStart, recurringEnd] = value.split(',')
  return [
    start ? `${moment.utc(start).format('YYYY-MM-DD HH:mm:ss')}` : undefined,
    end ? `${moment.utc(end).format('YYYY-MM-DD HH:mm:ss')}` : undefined,
    recurringStart ? `${moment.utc(start).year()}` : undefined,
    recurringEnd ? `${moment.utc(end).year()}` : undefined
  ]
}

/**
 * Formats a facet hierarchy, using a map of the hierarchy keys to define the order
 * @param {Node} value - The value for the facet type from a query object
 * @param {Array} order - An array of strings defining the order in which the keys should appear in the resulting arrays
 * @returns {Array} A multidimensional array of hierarchies
 */
export const formatFacetHierarchy = (value, order) => value.map(
  (variable) => {
    if (typeof variable === 'string') return [variable]
    const hierarchy = []
    order.forEach((level) => {
      if (!variable[level]) return
      hierarchy.push(variable[level])
    })
    return hierarchy
  }
)
