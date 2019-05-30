import {
  capitalize,
  isEqual,
  startCase,
  uniqWith
} from 'lodash'

const fixCase = keyword => startCase(capitalize(keyword))

export const buildScienceKeywords = (ummJson) => {
  const keywords = ummJson.ScienceKeywords

  if (!keywords) return []

  return uniqWith(keywords.map(keyword => ([
    fixCase(keyword.Category),
    fixCase(keyword.Topic),
    fixCase(keyword.Term)
  ])), isEqual)
}

export default buildScienceKeywords
