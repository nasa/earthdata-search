import { isEmpty } from 'lodash'

/**
 * Encodes the Autocomplete Selected params into an object
 * @param {Object} selected autocomplete selected object from the store
 */
export const encodeAutocomplete = (selected) => {
  if (!selected || selected.length === 0) return ''

  const param = {}
  selected.forEach(({ type, value }) => {
    if (Object.keys(param).includes(type)) {
      param[type].push(value)
    } else {
      param[type] = [value]
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
      values.push({ type: key, value: items[index] })
    })
  })

  return values
}
