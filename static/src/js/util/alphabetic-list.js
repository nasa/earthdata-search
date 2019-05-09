export const alphabet = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

/**
 * Returns an object where the keys are the alphbetic characters and the values are empty arrays.
 * ie: { #: [], A: [], B: [], ... Z: []}
 * @return {object} The formatted object.
 */
export const createEmptyAlphabeticListObj = () => {
  const alphabeticList = {}

  alphabet.forEach((letter) => {
    alphabeticList[letter] = []
  })

  return alphabeticList
}
