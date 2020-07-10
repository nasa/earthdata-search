import { isEmpty } from 'lodash'

/**
 * Encodes the Autocomplete Selected params into an object
 * @param {Object} selected autocomplete selected object from the store
 */
export const encodeAutocomplete = (selected) => {
  if (!selected || selected.length === 0) return ''

  const param = {}
  selected.forEach(({ type, fields }) => {
    if (Object.keys(param).includes(type)) {
      param[type].push(fields)
    } else {
      param[type] = [fields]
    }
  })

  return param
}

/**
 * Decodes a parameter object into an Autocomplete Selected array
 * @param {Object} params URL parameter object from parsing the URL parameter string
 */
export const decodeAutocomplete = (params) => {
  if (!params || isEmpty(params)) return undefined

  const values = []

  Object.keys(params).forEach((key) => {
    const items = params[key]
    Object.keys(items).forEach((index) => {
      // Pull out the colon delimited value
      const fields = items[index]

      // Split the fields and pop the last element (which represents the leaf node)
      const value = fields.split(':').slice(-1)

      // slice returns an array, select the element
      const [selectedValue] = value

      values.push({ type: key, fields: items[index], value: selectedValue })
    })
  })

  return values
}
