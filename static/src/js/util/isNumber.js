const reg = new RegExp(/^\d+$/)

/**
 * Returns true the string contains only number characters and false if there are any non-number characters
 * @return {boolean}
 */
export const isNumber = (string) => reg.test(string)

export default isNumber
