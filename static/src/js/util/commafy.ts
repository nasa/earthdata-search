const commaRegex = /\B(?=(\d{3})+(?!\d))/g

/**
 * Returns a commafied number.
 * @param number The number to commafy.
 * @returns A commafied number string.
 */
export const commafy = (number: number | string): string => {
  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  const num = `${number}`
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(commaRegex, ',')

  return parts.join('.')
}

export default commafy
