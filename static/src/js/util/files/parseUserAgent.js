/**
 * Get the operating system of the client
 * @param {String} userAgent - A string containing the navigator.userAgent from browser
 * @return {String} The operating system from the client as a string being returned
 */
export const getOperatingSystem = (userAgent) => {
  const patterns = [
    {
      name: 'Windows',
      pattern: /Windows\s(?:NT\s)?([^\s;)]+)/
    },
    {
      name: 'Mac OS',
      pattern: /Macintosh.*?([^\s;)]+)/
    },
    {
      name: 'Linux',
      pattern: /Linux(?:\si686|\samd64)?(?:\su;)?\s?([^\s;)]+)/
    }
  ]
  let operatingSystem = null

  patterns.forEach((pattern) => {
    const match = userAgent.match(pattern.pattern)
    if (match) {
      operatingSystem = `${pattern.name}`
      if (operatingSystem === 'Mac OS') operatingSystem = 'macOS'
    }
  })

  return operatingSystem
}
