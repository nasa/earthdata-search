/**
 * Select only desired keys from a provided object.
 * @param {Object} providedObj - An object containing any keys.
 * @param {Array} keys - An array of strings that represent the keys to be picked.
 * @return {Object} An object containing only the desired keys.
 */
export const pick = (providedObj = {}, keys = []) => {
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
