const pairs = (array) => {
  const len = array.length

  const results = []
  for (let i = 0; i < len; i += 1) {
    results.push([array[i], array[(i + 1) % len]])
  }

  return results
}

// Is a given path clockwise?
export const isClockwiseLatLng = (path) => {
  let sum = 0
  pairs(path).forEach(([p0, p1]) => {
    sum += (p1.lng - p0.lng) * (p1.lat + p0.lat)
  })

  return sum > 0
}
