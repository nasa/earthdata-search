import { isNumber } from 'lodash'

/**
 * @typedef {Object} Indicies
 * @property {Number} rowIndex - The X Coordinate
 * @property {Number} columnIndex - The Y Coordinate
 */

/**
 * Given the zero-based index in a list and a number of columns, returns an object
 * containing the zero-based row and column indicies of the item.
 * @param {Number} index The number to commafy.
 * @param {Number} numColumns The number to commafy.
 * @returns {Indicies} The item location.
 */
export const itemToRowColumnIndicies = (index, numColumns) => {
  if (!isNumber(index) || !isNumber(numColumns)) return undefined

  const rowIndex = Math.floor(index / numColumns)
  const columnIndex = index % numColumns

  return {
    rowIndex,
    columnIndex
  }
}
