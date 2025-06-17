import {
  changeCmrFacet,
  getNormalizedFirstLetter,
  getStartingLetters,
  buildOrganizedFacets
} from '../facets'

import { alphabet } from '../alphabetic-list'

beforeEach(() => {
  jest.resetAllMocks()
})

describe('changeCmrFacet', () => {
  test('calls the change handler with the correct arguments', () => {
    const onChangeHandlerMock = jest.fn()

    changeCmrFacet(
      {},
      {
        destination: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?granule_data_format_h%5B%5D=ASCII'
      },
      onChangeHandlerMock,
      {},
      false
    )

    expect(onChangeHandlerMock).toHaveBeenCalledTimes(1)
    expect(onChangeHandlerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        granule_data_format_h: ['ASCII']
      })
    )
  })

  describe('when the facet has encoded characters', () => {
    test('does not decode the values', () => {
      const onChangeHandlerMock = jest.fn()

      changeCmrFacet(
        {},
        {
          destination: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?data_center_h%5B%5D=Level-1%2Band%2BAtmosphere%2BArchive%2B%2526%2BDistribution%2BSystem%2B%2528LAADS%2529'
        },
        onChangeHandlerMock,
        {},
        false
      )

      expect(onChangeHandlerMock).toHaveBeenCalledTimes(1)
      expect(onChangeHandlerMock).toHaveBeenCalledWith(
        expect.objectContaining({
          data_center_h: ['Level-1%2Band%2BAtmosphere%2BArchive%2B%2526%2BDistribution%2BSystem%2B%2528LAADS%2529']
        })
      )
    })
  })
})

describe('getNormalizedFirstLetter', () => {
  it('returns null for undefined title', () => {
    expect(getNormalizedFirstLetter(undefined)).toBeNull()
  })

  it('returns null for empty title', () => {
    expect(getNormalizedFirstLetter('')).toBeNull()
  })

  it('converts first letter to uppercase', () => {
    expect(getNormalizedFirstLetter('foo')).toBe('F')
    expect(getNormalizedFirstLetter('bar')).toBe('B')
  })

  it('returns # for numeric first character', () => {
    expect(getNormalizedFirstLetter('123')).toBe('#')
    expect(getNormalizedFirstLetter('1foo')).toBe('#')
  })
})

describe('getStartingLetters', () => {
  it('returns empty array for empty facets', () => {
    expect(getStartingLetters([])).toEqual([])
  })

  it('returns unique starting letters in order of appearance', () => {
    const facets = [
      { title: 'foo' },
      { title: 'bar' },
      { title: 'qux' },
      { title: '123' }
    ]
    expect(getStartingLetters(facets)).toEqual(['F', 'B', 'Q', '#'])
  })

  it('handles facets with undefined titles', () => {
    const facets = [
      { title: 'foo' },
      {},
      { title: undefined },
      { title: 'bar' }
    ]
    expect(getStartingLetters(facets)).toEqual(['F', 'B'])
  })

  it('does not duplicate letters', () => {
    const facets = [
      { title: 'foo' },
      { title: 'foobar' },
      { title: 'fizz' }
    ]
    expect(getStartingLetters(facets)).toEqual(['F'])
  })
})

describe('buildOrganizedFacets', () => {
  const createFacet = (title, applied = false) => ({
    title,
    applied
  })

  it('organizes facets alphabetically when not lifting', () => {
    const facets = [
      createFacet('foo'),
      createFacet('bar'),
      createFacet('123'),
      createFacet('baz')
    ]
    const options = { liftSelectedFacets: false }

    const result = buildOrganizedFacets(facets, options)

    expect(result.facetsToLift).toEqual([])
    expect(result.alphabetizedList['#']).toHaveLength(1)
    expect(result.alphabetizedList.F).toHaveLength(1)
    expect(result.alphabetizedList.B).toHaveLength(2)
  })

  it('lifts applied facets when liftSelectedFacets is true', () => {
    const facets = [
      createFacet('foo', true),
      createFacet('bar'),
      createFacet('baz', true)
    ]
    const options = { liftSelectedFacets: true }

    const result = buildOrganizedFacets(facets, options)

    expect(result.facetsToLift).toHaveLength(2)
    expect(result.alphabetizedList.B).toHaveLength(1)
    expect(result.facetsToLift).toEqual([
      createFacet('foo', true),
      createFacet('baz', true)
    ])
  })

  it('handles facets with invalid titles', () => {
    const facets = [
      createFacet(''),
      createFacet(undefined),
      createFacet('foo')
    ]
    const options = { liftSelectedFacets: false }

    const result = buildOrganizedFacets(facets, options)

    expect(result.alphabetizedList.F).toHaveLength(1)
    // Check that invalid facets were skipped
    const totalFacets = Object.values(result.alphabetizedList)
      .reduce((sum, arr) => sum + arr.length, 0)
    expect(totalFacets).toBe(1)
  })

  it('creates empty arrays for all alphabet letters that are not present', () => {
    const facets = [createFacet('foo')]
    const options = { liftSelectedFacets: false }

    const result = buildOrganizedFacets(facets, options)

    alphabet.forEach((letter) => {
      expect(Array.isArray(result.alphabetizedList[letter])).toBe(true)
      if (letter !== 'F') {
        expect(result.alphabetizedList[letter]).toHaveLength(0)
      }
    })
  })
})
