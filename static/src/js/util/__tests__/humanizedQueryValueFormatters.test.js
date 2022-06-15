import {
  formatBoolean,
  formatCircle,
  formatFacetHierarchy,
  formatPoint,
  formatPoints,
  formatTemporal
} from '../humanizedQueryValueFormatters'

describe(('formatBoolean'), () => {
  describe('when formatting a truthy value', () => {
    test('returns undefined', () => {
      const result = formatBoolean(true)
      expect(result).toEqual(undefined)
    })
  })

  describe('when formatting a falsy value', () => {
    test('returns undefined', () => {
      const result = formatBoolean(false)
      expect(result).toEqual(false)
    })
  })

  describe('when formatting undefined', () => {
    test('returns undefined', () => {
      const result = formatBoolean(undefined)
      expect(result).toEqual(undefined)
    })
  })
})

describe(('formatPoint'), () => {
  describe('when formatting an array of points', () => {
    test('returns the points in the desired format', () => {
      const result = formatPoint('2,1,4,3,6,5')
      expect(result).toEqual([
        ['1', '2'], ['3', '4'], ['5', '6']
      ])
    })
  })
})

describe(('formatPoints'), () => {
  describe('when formatting an array of points', () => {
    test('returns the points in the desired format', () => {
      const result = formatPoints([
        '2,1,4,3,6,5',
        '6,5,8,7,10,9'
      ])
      expect(result).toEqual([
        [['1', '2'], ['3', '4'], ['5', '6']],
        [['5', '6'], ['7', '8'], ['9', '10']]
      ])
    })
  })

  describe('when formatting a string of points', () => {
    test('returns the points in the desired format', () => {
      const result = formatPoints('2,1,4,3,6,5')
      expect(result).toEqual([
        [['1', '2'], ['3', '4'], ['5', '6']]
      ])
    })
  })
})

describe(('formatCircle'), () => {
  describe('when formatting an array of circles', () => {
    test('returns the circles in the desired format', () => {
      const result = formatCircle([
        '2,1,3',
        '5,4,6'
      ])
      expect(result).toEqual([
        ['1', '2', '3'],
        ['4', '5', '6']
      ])
    })
  })

  describe('when formatting a string of a circle', () => {
    test('returns the circles in the desired format', () => {
      const result = formatCircle('2,1,3')
      expect(result).toEqual([
        ['1', '2', '3']
      ])
    })
  })
})

describe(('formatTemporal'), () => {
  describe('when formatting a start and no end time', () => {
    test('returns the temporal information in the desired format', () => {
      const result = formatTemporal('2000-01-01T10:00:00Z,')
      expect(result).toEqual([
        '2000-01-01 10:00:00',
        undefined,
        undefined,
        undefined
      ])
    })
  })

  describe('when formatting a end and no start time', () => {
    test('returns the temporal information in the desired format', () => {
      const result = formatTemporal(',2010-03-10T12:00:00Z')
      expect(result).toEqual([
        undefined,
        '2010-03-10 12:00:00',
        undefined,
        undefined
      ])
    })
  })

  describe('when formatting a start and end time', () => {
    test('returns the temporal information in the desired format', () => {
      const result = formatTemporal('2000-01-01T10:00:00Z,2010-03-10T12:00:00Z')
      expect(result).toEqual([
        '2000-01-01 10:00:00',
        '2010-03-10 12:00:00',
        undefined,
        undefined
      ])
    })
  })

  describe('when formatting a non-recurring time', () => {
    test('returns the temporal information in the desired format', () => {
      const result = formatTemporal('2000-01-01T10:00:00Z,2010-03-10T12:00:00Z')
      expect(result).toEqual([
        '2000-01-01 10:00:00',
        '2010-03-10 12:00:00',
        undefined,
        undefined
      ])
    })
  })

  describe('when formatting a recurring time', () => {
    test('returns the temporal information in the desired format', () => {
      const result = formatTemporal('2000-01-01T10:00:00Z,2010-03-10T12:00:00Z,1,69')
      expect(result).toEqual([
        '2000-01-01 10:00:00',
        '2010-03-10 12:00:00',
        '2000',
        '2010'
      ])
    })
  })
})

describe(('formatFacetHierarchy'), () => {
  describe('when formatting a non-hierarchical facet', () => {
    test('returns the facet in the desired format', () => {
      const result = formatFacetHierarchy(['item one', 'item two'])
      expect(result).toEqual([['item one'], ['item two']])
    })
  })

  describe('when formatting a hierarchical facet', () => {
    describe('when a single facet is selected', () => {
      test('returns the facet in the desired format', () => {
        const result = formatFacetHierarchy([{
          term: 'term',
          topic: 'topic',
          variable_level_one: 'variable_level_one'
        }], [
          'term',
          'topic',
          'variable_level_one'
        ])
        expect(result).toEqual([['term', 'topic', 'variable_level_one']])
      })
    })

    describe('when a multiple facets are selected', () => {
      test('returns the facet in the desired format', () => {
        const result = formatFacetHierarchy([{
          term: 'term one',
          topic: 'topic one',
          variable_level_one: 'variable_level_one one'
        },
        {
          term: 'term two',
          topic: 'topic two',
          variable_level_one: 'variable_level_one two'
        }], [
          'term',
          'topic',
          'variable_level_one'
        ])

        expect(result).toEqual([
          ['term one', 'topic one', 'variable_level_one one'],
          ['term two', 'topic two', 'variable_level_one two']
        ])
      })
    })

    describe('when a key is not defined in the order array', () => {
      test('returns the facet in the desired format', () => {
        const result = formatFacetHierarchy([{
          term: 'term',
          topic: 'topic'
        },
        {
          term: 'term',
          topic: 'topic',
          variable_level_one: 'variable_level_one'
        }], [
          'term',
          'topic',
          'variable_level_one'
        ])

        expect(result).toEqual([
          ['term', 'topic'],
          ['term', 'topic', 'variable_level_one']
        ])
      })
    })
  })
})
