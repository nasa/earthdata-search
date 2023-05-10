import { get } from 'sendero'
import { unparse } from 'papaparse'

/**
 * Converts an array of JSON objects to a CSV
 * @param {Array} jsonArray - array of JSON objects
 * @param {Array} columns - array of column objects with name and dot path to value, such as [{ name: "Platform", path: "platforms.shortName" }, ...]
 * @returns {String} csv
 */
export const jsonToCsv = (jsonArray, columns) => {
  const data = jsonArray.map((item) => (
    columns.reduce((row, { name, path }) => ({
      ...row,
      [name]: get(item, path, {
        clean: true, sort: true, stringify: true, unique: true
      }).join(', ')
    }), {})
  ))

  const config = {
    columns: columns.map(({ name }) => name)
  }

  return `${unparse(data, config)}\r\n`
}
