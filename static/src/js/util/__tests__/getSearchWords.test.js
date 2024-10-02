import { getSearchWords } from '../getSearchWords'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getSearchWords', () => {
  test('generates correct search words', () => {
    const searchWords = getSearchWords(['*abc*'])

    expect(searchWords).toEqual([/(abc)/])
  })

  test('generates correct search words with 1 ?', () => {
    const searchWords = getSearchWords(['*a?c*'])

    expect(searchWords).toEqual([/(a.c)/])
  })

  test('generates correct search words with multiple ?', () => {
    const searchWords = getSearchWords(['*a?cde?*'])

    expect(searchWords).toEqual([/(a.cde.)/])
  })

  test('generates correct search when no star in front', () => {
    const searchWords = getSearchWords(['a?cde?*'])

    expect(searchWords).toEqual([/(a.cde.)/])
  })

  test('generates correct search when no star in the end', () => {
    const searchWords = getSearchWords(['*a?cde?'])

    expect(searchWords).toEqual([/(a.cde.)/])
  })

  test('generates correct search words when there are multiple terms', () => {
    const searchWords = getSearchWords(['*a?cde*', '*123?4*'])

    expect(searchWords).toEqual([
      /(a.cde)/,
      /(123.4)/
    ])
  })
})
