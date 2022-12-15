const { encodeFacets, decodeFacets } = require('../facetEncoders')

describe('encodeFacets', () => {
  test('encodes facets array into a string', () => {
    const facets = [
      'Facet 1',
      'Facet & Facet'
    ]

    const expectedResult = 'Facet%201!Facet%20%26%20Facet'

    expect(encodeFacets(facets)).toEqual(expectedResult)
  })

  test('returns an empty string if no facets exist', () => {
    expect(encodeFacets()).toEqual('')
  })
})

describe('decodeFacets', () => {
  test('decodes facet string into an array and leave values encoded', () => {
    const string = 'Facet%201!Facet%20%26%20Facet'

    const expectedResult = [
      'Facet%201',
      'Facet%20%26%20Facet'
    ]

    expect(decodeFacets(string)).toEqual(expectedResult)
  })

  test('returns undefined if passed an empty string', () => {
    expect(decodeFacets('')).toEqual(undefined)
  })
})
