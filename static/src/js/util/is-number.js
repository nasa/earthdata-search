const reg = new RegExp(/^\d+$/)

/**
 * Returns true or false if the string contains a number
 * @return {boolean}
 */
export const isNumber = string => reg.test(string)

export default isNumber
