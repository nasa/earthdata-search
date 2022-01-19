/**
 * Lookup a object key given a value
 * @param {string} object JavaScript Object with key-value pairs
 * @param {string} value A value in the object
 * @return {string} A key in the object
 */
const getObjectKeyByValue = (object, value) => Object.keys(object)
  .find((key) => object[key] === value)

export default getObjectKeyByValue
