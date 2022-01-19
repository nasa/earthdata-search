import {
  capitalize,
  isEqual,
  startCase,
  uniqWith
} from 'lodash'

const fixCase = (keyword) => startCase(capitalize(keyword))

export const buildScienceKeywords = (json) => {
  const { scienceKeywords } = json

  if (!scienceKeywords) return []

  return uniqWith(scienceKeywords.map((keyword) => ([
    fixCase(keyword.category),
    fixCase(keyword.topic),
    fixCase(keyword.term)
  ])), isEqual)
}

export default buildScienceKeywords
