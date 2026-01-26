import { getSearchWords } from '../getSearchWords'

describe('getSearchWords', () => {
  // Tests that the regex gets converted when using *s in the front and back of a search term
  test('generates correct search words', () => {
    const searchWords = getSearchWords(['*abc*'])

    expect(searchWords).toEqual([/(abc)/])
  })

  // Tests that the regex gets converted correctly when using *s with ?s
  test('generates correct search words with 1 ?', () => {
    const searchWords = getSearchWords(['*a?c*'])

    expect(searchWords).toEqual([/(a.c)/])
  })

  // Tests that the regex converts correctly with multiple ?s
  test('generates correct search words with multiple ?', () => {
    const searchWords = getSearchWords(['*a?cde?*'])

    expect(searchWords).toEqual([/(a.cde.)/])
  })

  // Tests that regex is generated correctly when missing a * in the front
  test('generates correct search when no star in front', () => {
    const searchWords = getSearchWords(['a?cde?*'])

    expect(searchWords).toEqual([/(a.cde.)/])
  })

  // Tests that regex is generated correctly when missing a * in the end of the search term
  test('generates correct search when no star in the end', () => {
    const searchWords = getSearchWords(['*a?cde?'])

    expect(searchWords).toEqual([/(a.cde.)/])
  })

  // Testing mutliple search terms get converted correctly.
  test('generates correct search words when there are multiple terms', () => {
    const searchWords = getSearchWords(['*a?cde*', '*123?4*'])

    expect(searchWords).toEqual([
      /(a.cde)/,
      /(123.4)/
    ])
  })
})
