/**
 * Select only desired keys from a provided object.
 * @param {object} providedObj - An object containing any keys.
 * @param {array} keys - An array of strings that represent the keys to be picked.
 * @return {obj} An object containing only the desired keys.
 */
export const pick = (providedObj = {}, keys) => {
  let obj = null

  // if `null` is provided the default parameter will not be
  // set so we'll handle it manually
  if (providedObj == null) {
    obj = {}
  } else {
    obj = providedObj
  }

  Object.keys(obj).forEach((k) => {
    if (!keys.includes(k)) {
      delete obj[k]
    }
  })

  return obj
}

/**
 * Returns the JWT Token from our custom authorizer context
 * @param {object} event Lambda function event parameter
 */
export const getJwtToken = (event) => {
  const { requestContext } = event
  const { authorizer } = requestContext
  const { jwtToken } = authorizer
  return jwtToken
}

/**
 * Split an array into an array of smaller arrays
 * @param {Array} myArray The array to be split up into chunks
 * @param {Number} chunkSize The size of the chunks to split the array into
 * @return {Array} An array of arrays split up into the requested sizes
 */
export const chunkArray = (myArray, chunkSize) => {
  let index = 0
  const arrayLength = myArray.length
  const tempArray = []

  for (index = 0; index < arrayLength; index += chunkSize) {
    const myChunk = myArray.slice(index, index + chunkSize)

    tempArray.push(myChunk)
  }

  return tempArray
}
