export const encodeGridCoords = (gridCoords) => {
  if (!gridCoords) return ''

  const encodedCoords = gridCoords
    .trim()
    .replace(/,/g, ':')
    .replace(/\s+/g, ',')
    .replace(/(^|,)(\d+)($|:)/g, '$1$2-$2$3')
    .replace(/(^|:)(\d+)($|,)/g, '$1$2-$2$3')

  return encodedCoords
}

export const decodeGridCoords = (string) => {
  if (!string) return undefined

  const decodedString = string
    .replace(/,/g, ' ')
    .replace(/:/g, ',')
    .replace(/(\d+)-(\d+)/g, (m, m0, m1) => {
      if (m0 === m1) return m0
      return m
    })

  return decodedString
}
