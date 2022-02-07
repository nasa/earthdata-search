/**
 * Decodes an integer parameter (returns the same value as an integer)
 * @param {Integer} integer
 */
export const decodeInteger = (integer) => parseInt(integer, 10) || undefined

/**
 * Encodes an integer parameter (returns the same value as a string)
 * @param {Integer} integer
 */
export const encodeInteger = (integer) => integer || ''
