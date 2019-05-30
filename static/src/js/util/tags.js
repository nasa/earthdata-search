const cmrTagNamespace = 'edsc.extra'

export const getValueForTag = (key, tags) => {
  if (!tags) return undefined
  console.warn('tags', tags)
  // if (tags && Array.isArray(tags)) {
  // }
  const tag = `${cmrTagNamespace}.${key}`
  if (tags[tag] && tags[tag].data) return tags[tag].data
  return undefined
}

export default getValueForTag
