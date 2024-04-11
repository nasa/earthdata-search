/**
 * Decodes an boolean parameter
 * @param {Boolean} boolean
 */
export const decodeBoolean = (boolean) => {
  if (boolean === 't') {
    return true
  }

  return undefined
}

/**
 * Encodes an boolean parameter
 * @param {Boolean} boolean
 */
export const encodeBoolean = (boolean) => {
  if (boolean === true) {
    return 't'
  }

  return undefined
}
