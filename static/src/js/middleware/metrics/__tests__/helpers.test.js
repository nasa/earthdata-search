import spatialTypes from '../../../constants/spatialTypes'
import useEdscStore from '../../../zustand/useEdscStore'
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
      const value = computeKeyword()
      expect(value).toEqual(null)
    })

    test('returns null when no keyword is applied', () => {
      useEdscStore.setState({
        query: {
          collection: {
            keyword: 'test keyword'
          }
        }
      })

      const value = computeKeyword()
      expect(value).toEqual('test keyword')
    })
  })

  describe('computeSpatialType', () => {
    test('returns null when no spatial is applied', () => {
      const value = computeSpatialType()
      expect(value).toEqual(null)
    })

    test('returns Bounding Box when bounding box is applied', () => {
      useEdscStore.setState({
        query: {
          collection: {
            spatial: {
              boundingBox: ['-15.310546875000002,47.08492103009955,17.5550537109375,61.17149911040902']
            }
          }
        }
      })

      const value = computeSpatialType()
      expect(value).toEqual(spatialTypes.BOUNDING_BOX)
    })

    test('returns Polygon when polygon is applied', () => {
      useEdscStore.setState({
        query: {
          collection: {
            spatial: {
              polygon: ['18.630615234375,52.411131961365896,14.657958984375,46.928897935258945,19.78253173828125,45.649948059241616,18.630615234375,52.411131961365896']
            }
          }
        }
      })

      const value = computeSpatialType()
      expect(value).toEqual(spatialTypes.POLYGON)
    })

    test('returns Point when point is applied', () => {
      useEdscStore.setState({
        query: {
          collection: {
            spatial: {
              point: ['4.5, 29.868554589199988']
            }
          }
        }
      })

      const value = computeSpatialType()
      expect(value).toEqual(spatialTypes.POINT)
    })

    test('returns Circle when circle is applied', () => {
      useEdscStore.setState({
        query: {
          collection: {
            spatial: {
              circle: ['50.20313,41.0444,1042319']
            }
          }
        }
      })

      const value = computeSpatialType()
      expect(value).toEqual(spatialTypes.CIRCLE)
    })
  })

  describe('computeTemporalType', () => {
    test('returns null when no temporal is applied', () => {
      const value = computeTemporalType()
      expect(value).toEqual(null)
    })

    test('returns Standard Temporal when no temporal is applied', () => {
      useEdscStore.setState({
        query: {
          collection: {
            temporal: {
              startDate: '2019-09-11T00:00:00.000Z',
              endDate: '2019-09-11T23:59:59.999Z'
            }
          }
        }
      })

      const value = computeTemporalType()
      expect(value).toEqual('Standard Temporal')
    })

    test('returns Recurring Temporal when no temporal is applied', () => {
      useEdscStore.setState({
        query: {
          collection: {
            temporal: {
              startDate: '09-11T00:00:00.000Z',
              endDate: '09-11T23:59:59.999Z',
              recurring: true
            }
          }
        }
      })

      const value = computeTemporalType()
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
      useEdscStore.setState({
        project: {
          collections: {
            allIds: []
          }
        }
      })

      const value = computeCollectionsAdded()
      expect(value).toEqual(null)
    })

    test('returns the last collection added', () => {
      useEdscStore.setState({
        project: {
          collections: {
            allIds: ['COLL_ID_1', 'COLL_ID_2']
          }
        }
      })

      const value = computeCollectionsAdded()
      expect(value).toEqual('COLL_ID_2')
    })
  })

  describe('computeFacets', () => {
    test('returns null when no facets are applied', () => {
      useEdscStore.setState({
        facetParams: {
          featureFacets: {
            availableInEarthdataCloud: false,
            customizable: false,
            mapImagery: false
          },
          cmrFacets: {}
        }
      })

      const value = computeFacets()
      expect(value).toEqual(null)
    })

    describe('feature facets', () => {
      test('returns correctly when Map Imagery is applied', () => {
        useEdscStore.setState({
          facetParams: {
            featureFacets: {
              mapImagery: true
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('features/Map Imagery ')
      })

      test('returns correctly when Aavailable In Earthdata Cloud is applied', () => {
        useEdscStore.setState({
          facetParams: {
            featureFacets: {
              availableInEarthdataCloud: true
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('features/Aavailable In Earthdata Cloud ')
      })

      test('returns correctly when Customizable is applied', () => {
        useEdscStore.setState({
          facetParams: {
            featureFacets: {
              customizable: true
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('features/Customizable ')
      })

      test('returns correctly when multiple feature facets are applied', () => {
        useEdscStore.setState({
          facetParams: {
            featureFacets: {
              mapImagery: true,
              customizable: true
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('features/Map Imagery features/Customizable ')
      })
    })

    describe('cmr facets', () => {
      test('returns correctly when science keyword is applied', () => {
        useEdscStore.setState({
          facetParams: {
            cmrFacets: {
              science_keywords_h: [{
                variable_level_1: 'Emissions',
                term: 'Air Quality',
                topic: 'Atmosphere'
              }]
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('topic/Atmosphere term/Air Quality variable_level_1/Emissions ')
      })

      test('returns correctly when platform is applied', () => {
        useEdscStore.setState({
          facetParams: {
            cmrFacets: {
              platforms_h: [{
                basis: 'Space-based Platforms',
                category: 'Earth Observation Satellites',
                sub_category: 'Landsat',
                short_name: 'LANDSAT-8'
              }]
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('basis/Space-based Platforms category/Earth Observation Satellites sub_category/Landsat short_name/LANDSAT-8 ')
      })

      test('returns correctly when instrument is applied', () => {
        useEdscStore.setState({
          facetParams: {
            cmrFacets: {
              instrument_h: ['CHEMILUMINESCENCE']
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('instrument/CHEMILUMINESCENCE ')
      })

      test('returns correctly when data_center is applied', () => {
        useEdscStore.setState({
          facetParams: {
            cmrFacets: {
              data_center_h: ['Alaska+Satellite+Facility']
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('data_center/Alaska+Satellite+Facility ')
      })

      test('returns correctly when project is applied', () => {
        useEdscStore.setState({
          facetParams: {
            cmrFacets: {
              project_h: ['ABoVE']
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('project/ABoVE ')
      })

      test('returns correctly when processing_level_id is applied', () => {
        useEdscStore.setState({
          facetParams: {
            cmrFacets: {
              processing_level_id_h: ['0+-+Raw+Data']
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('processing_level_id/0+-+Raw+Data ')
      })

      test('returns correctly when granule_data_format is applied', () => {
        useEdscStore.setState({
          facetParams: {
            cmrFacets: {
              granule_data_format_h: ['ASCII']
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('granule_data_format/ASCII ')
      })

      test('returns correctly when two_d_coordinate_system_name is applied', () => {
        useEdscStore.setState({
          facetParams: {
            cmrFacets: {
              two_d_coordinate_system_name: ['CALIPSO']
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('two_d_coordinate_system_name/CALIPSO ')
      })

      test('returns correctly when horizontal_data_resolution_range is applied', () => {
        useEdscStore.setState({
          facetParams: {
            cmrFacets: {
              horizontal_data_resolution_range: ['0+to+1+meter']
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('horizontal_data_resolution_range/0+to+1+meter ')
      })

      test('returns correctly when latency is applied', () => {
        useEdscStore.setState({
          facetParams: {
            cmrFacets: {
              latency: ['1+to+3+hours']
            }
          }
        })

        const value = computeFacets()
        expect(value).toEqual('latency/1+to+3+hours ')
      })
    })
  })
})
