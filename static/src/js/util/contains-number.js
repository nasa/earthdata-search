const reg = new RegExp(/^\d+$/)

/**
 * Returns true or false if the string contains a number
 * @return {boolean}
 */
export const containsNumber = string => reg.test(string)

export default containsNumber
