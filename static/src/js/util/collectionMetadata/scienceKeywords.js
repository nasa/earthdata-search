import {
  capitalize,
  isEqual,
  startCase,
  uniqWith
} from 'lodash'

const fixCase = keyword => startCase(capitalize(keyword))

export const buildScienceKeywords = (ummJson) => {
  const keywords = ummJson.science_keywords

  if (!keywords) return []

  return uniqWith(keywords.map(keyword => ([
    fixCase(keyword.category),
    fixCase(keyword.topic),
    fixCase(keyword.term)
  ])), isEqual)
}

export default buildScienceKeywords
