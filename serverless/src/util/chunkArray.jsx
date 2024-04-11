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
