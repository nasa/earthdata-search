import { startCase } from 'lodash'

/**
 * Returns an array of parents, removing the leaf node, which is the value
 * @param {String} fields A semi-colon delimited list of the the parents.
 * @returns {Array}  Display title will be something like:
 */
export const buildHierarchy = (fields = '') => {
  let parents = []

  if (fields && fields.indexOf(':')) {
    parents = fields.split(':')
    parents.pop()
  }

  return parents
}

/**
 * Returns a string to be used in a title attribute
 * @param {Object} autocompleteResult The current collection search params.
 * @returns {String}  Display title will be something like:
 *
 * Instrument:
 * Modis
 *
 * or in the case of a hierarchichal set of fields, something like:
 *
 * Science Keywords:
 * Parent 1 > Parent 2 > Node
 *
 */
export const buildHierarchicalAutocompleteTitle = ({ type, value, fields = '' }) => {
  let hierarchy = ''

  const parents = buildHierarchy(fields)

  // No-op if there is no fields defined. In that case, displayHierarchy
  // remains an empty string
  parents.forEach((parent) => {
    hierarchy += `${parent} > `
  })

  return `${startCase(type)}: \n${hierarchy}${value}`
}
