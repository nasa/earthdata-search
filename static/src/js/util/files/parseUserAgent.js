import { camelCase } from 'lodash'

/**
 * Get the operating system of the client
 * @param {String} userAgent - A string containing the navigator.userAgent from browser
 * @return {String} The operating system from the client as a string being returned
 */
export const getOperatingSystem = (userAgent) => {
  const patterns = [
    { name: 'Windows', pattern: /Windows\s(?:NT\s)?([^\s;)]+)/ },
    { name: 'Mac OS', pattern: /Macintosh.*?([^\s;)]+)/ },
    { name: 'Linux', pattern: /Linux(?:\si686|\samd64)?(?:\su;)?\s?([^\s;)]+)/ }
  ]
  let operatingSystem
  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i]
    const match = userAgent.match(pattern.pattern)
    if (match) {
      operatingSystem = camelCase(`${pattern.name}`)
      return operatingSystem
    }
  }
  return null
}
