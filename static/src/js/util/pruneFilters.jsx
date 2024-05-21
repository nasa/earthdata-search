import { isPlainObject } from 'lodash-es'

/**
 * Prunes the provided filters of empty values
 * @param {Object} filters CMR filters
 */
export const pruneFilters = (filters) => (
  Object.keys(filters).reduce((obj, key) => {
    const newObj = obj

    // If the value is not an object, only add the key if the value is truthy. This removes
    // any unset values
    if (!isPlainObject(filters[key])) {
      if (filters[key]) {
        newObj[key] = filters[key]
      }
    } else if (Object.values(filters[key]).some((filterKey) => !!filterKey)) {
      // Otherwise, only add an object if it contains at least one truthy value
      newObj[key] = filters[key]
    }

    return newObj
  }, {})
)

export default pruneFilters
