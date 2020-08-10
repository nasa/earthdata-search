import {
  computeKeyword,
  computeSpatialType,
  computeTemporalType,
  computeCollectionsViewed,
  computeCollectionsAdded,
  computeFacets
} from '../helpers'

describe('helpers', () => {
  describe('computeKeyword', () => {
    test('returns null when no keyword is applied', () => {
      const state = {
        query: {
          collection: {
            keyword: undefined
          }
        }
      }
      const value = computeKeyword(state)
      expect(value).toEqual(null)
    })

    test('returns null when no keyword is applied', () => {
      const state = {
        query: {
          collection: {
            keyword: 'test keyword'
          }
        }
      }
      const value = computeKeyword(state)
      expect(value).toEqual('test keyword')
    })
  })

  describe('computeSpatialType', () => {
    test('returns null when no spatial is applied', () => {
      const state = {
        query: {
          collection: {
            spatial: {
              boundingBox: undefined,
              polygon: undefined,
              point: undefined
            }
          }
        }
      }
      const value = computeSpatialType(state)
      expect(value).toEqual(null)
    })

    test('returns Bounding Box when bounding box is applied', () => {
      const state = {
        query: {
          collection: {
            spatial: {
              boundingBox: '-15.310546875000002,47.08492103009955,17.5550537109375,61.17149911040902',
              polygon: undefined,
              point: undefined
            }
          }
        }
      }
      const value = computeSpatialType(state)
      expect(value).toEqual('Bounding Box')
    })

    test('returns Bounding Box when bounding box is applied', () => {
      const state = {
        query: {
          collection: {
            spatial: {
              boundingBox: '-15.310546875000002,47.08492103009955,17.5550537109375,61.17149911040902',
              polygon: undefined,
              point: undefined
            }
          }
        }
      }
      const value = computeSpatialType(state)
      expect(value).toEqual('Bounding Box')
    })

    test('returns Polygon when polygon is applied', () => {
      const state = {
        query: {
          collection: {
            spatial: {
              boundingBox: undefined,
              polygon: '18.630615234375,52.411131961365896,14.657958984375,46.928897935258945,19.78253173828125,45.649948059241616,18.630615234375,52.411131961365896',
              point: undefined
            }
          }
        }
      }
      const value = computeSpatialType(state)
      expect(value).toEqual('Polygon')
    })

    test('returns Point when point is applied', () => {
      const state = {
        query: {
          collection: {
            spatial: {
              boundingBox: undefined,
              polygon: undefined,
              point: '4.5, 29.868554589199988'
            }
          }
        }
      }
      const value = computeSpatialType(state)
      expect(value).toEqual('Point')
    })
  })

  describe('computeTemporalType', () => {
    test('returns null when no temporal is applied', () => {
      const state = {
        query: {
          collection: {
            temporal: undefined
          }
        }
      }
      const value = computeTemporalType(state)
      expect(value).toEqual(null)
    })

    test('returns Standard Temporal when no temporal is applied', () => {
      const state = {
        query: {
          collection: {
            temporal: {
              startDate: '2019-09-11T00:00:00.000Z',
              endDate: '2019-09-11T23:59:59.999Z'
            }
          }
        }
      }
      const value = computeTemporalType(state)
      expect(value).toEqual('Standard Temporal')
    })

    test('returns Recurring Temporal when no temporal is applied', () => {
      const state = {
        query: {
          collection: {
            temporal: {
              startDate: '09-11T00:00:00.000Z',
              endDate: '09-11T23:59:59.999Z',
              recurring: true
            }
          }
        }
      }
      const value = computeTemporalType(state)
      expect(value).toEqual('Recurring Temporal')
    })
  })

  describe('computeCollectionsViewed', () => {
    test('returns null when no keyword is applied', () => {
      const state = {
        focusedCollection: undefined
      }
      const value = computeCollectionsViewed(state)
      expect(value).toEqual(null)
    })

    test('returns collection id when no keyword is applied', () => {
      const state = {
        focusedCollection: 'TEST-COLL-ID'
      }
      const value = computeCollectionsViewed(state)
      expect(value).toEqual('TEST-COLL-ID')
    })
  })

  describe('computeCollectionsAdded', () => {
    test('returns null when no collection is added', () => {
      const state = {
        project: {
          collections: {
            allIds: []
          }
        }
      }
      const value = computeCollectionsAdded(state)
      expect(value).toEqual(null)
    })

    test('returns the last collection added', () => {
      const state = {
        project: {
          collections: {
            allIds: ['COLL_ID_1', 'COLL_ID_2']
          }
        }
      }
      const value = computeCollectionsAdded(state)
      expect(value).toEqual('COLL_ID_2')
    })
  })

  describe('computeFacets', () => {
    test('returns null when no facets are applied', () => {
      const state = {
        facetsParams: {
          feature: undefined,
          cmr: undefined
        }
      }
      const value = computeFacets(state)
      expect(value).toEqual(null)
    })

    describe('feature facets', () => {
      test('returns correctly when Map Imagery is applied', () => {
        const state = {
          facetsParams: {
            feature: {
              mapImagery: true
            },
            cmr: undefined
          }
        }
        const value = computeFacets(state)
        expect(value).toEqual('features/Map Imagery ')
      })

      test('returns correctly when Near Real Time is applied', () => {
        const state = {
          facetsParams: {
            feature: {
              nearRealTime: true
            },
            cmr: undefined
          }
        }
        const value = computeFacets(state)
        expect(value).toEqual('features/Near Real Time ')
      })

      test('returns correctly when Customizable is applied', () => {
        const state = {
          facetsParams: {
            feature: {
              customizable: true
            },
            cmr: undefined
          }
        }
        const value = computeFacets(state)
        expect(value).toEqual('features/Customizable ')
      })

      test('returns correctly when multiple feature facets are applied', () => {
        const state = {
          facetsParams: {
            feature: {
              mapImagery: true,
              customizable: true
            },
            cmr: undefined
          }
        }
        const value = computeFacets(state)
        expect(value).toEqual('features/Map Imagery features/Customizable ')
      })
    })

    describe('cmr facets', () => {
      test('returns correctly when science keyword is applied', () => {
        const state = {
          facetsParams: {
            feature: undefined,
            cmr: {
              science_keywords_h: [{
                variable_level_1: 'Emissions',
                term: 'Air Quality',
                topic: 'Atmosphere'
              }]
            }
          }
        }

        const value = computeFacets(state)
        expect(value).toEqual('topic/Atmosphere term/Air Quality variable_level_1/Emissions ')
      })

      test('returns correctly when a normal category is applied', () => {
        const state = {
          facetsParams: {
            feature: undefined,
            cmr: {
              instrument_h: ['CHEMILUMINESCENCE']
            }
          }
        }

        const value = computeFacets(state)
        expect(value).toEqual('instrument/CHEMILUMINESCENCE ')
      })
    })
  })
})
