import { startCase } from 'lodash'

/**
 * Returns an array of parents, removing the leaf node, which is the value
 * @param {String} fields A semi-colon delimited list of the the parents.
 * @returns {Array}  Display title will be something like:
 */
export const buildHierarchy = ({ fields, includeLeaf = false }) => {
  let hiearchy = []

  // If the value provided is undefined or null
  if (fields == null) return hiearchy

  // Split the value on the known delimiter
  hiearchy = fields.split(':')

  // Unless otherwise provided, remove the leaf node and only return the parently hiearchy
  if (!includeLeaf) {
    hiearchy.pop()
  }

  return hiearchy
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
export const buildHierarchicalAutocompleteTitle = ({ type, value, fields }) => {
  let hierarchy = ''

  const parents = buildHierarchy({ fields, includeLeaf: true })

  // Parents will have a value if a value was provided in the `fields` field
  // and we're requesting to include the leaf node which will match the `value` field
  if (parents.length > 0) {
    hierarchy = parents.join(' > ')
  } else {
    // If no hiearchy was returned fallback to using the `value` field
    hierarchy = value
  }

  let title = startCase(type)

  if (hierarchy) {
    title = `${title}:`
  }

  return [title, hierarchy].filter(Boolean).join('\n')
}
