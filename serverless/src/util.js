// Select only desired keys from a provided object
export const pick = (providedObj = {}, keys) => {
  const pickedObj = {}

  let obj = null

  // if `null` is provided the default parameter will not be
  // set so we'll handle it manually
  if (providedObj == null) {
    obj = {}
  } else {
    obj = providedObj
  }

  Object.keys(obj).forEach((k) => {
    if (keys.includes(k)) {
      pickedObj[k] = obj[k]
    }
  })

  return pickedObj
}

// Converts an object to a query string
export const objToQueryString = (obj = {}) => {
  const result = []
  Object.keys(obj).forEach((k) => {
    const keyStr = encodeURIComponent(k)
    const val = obj[k]
    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i += 1) {
        // Use [] syntax for defining arrays in the query string
        result.push(`${keyStr}[]=${encodeURIComponent(val[i])}`)
      }
    } else {
      result.push(`${keyStr}=${encodeURIComponent(val)}`)
    }
  })

  return result.join('&')
}
