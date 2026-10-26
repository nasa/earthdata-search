import { buildCollectionSearchParams, prepareCollectionParams } from '../collections'
import useEdscStore from '../../zustand/useEdscStore'

describe('#prepareCollectionParams', () => {
  test('preserves advanced collection identifiers', () => {
    useEdscStore.setState((state) => ({
      query: {
        ...state.query,
        collection: {
          ...state.query.collection,
          entryId: ['ATL03_004', 'ATL06_006']
        }
      }
    }))

    expect(prepareCollectionParams()).toEqual(expect.objectContaining({
      entryId: ['ATL03_004', 'ATL06_006']
    }))
  })

  describe('when the customize facet is selected', () => {
    test('includes the correct serviceType', () => {
      useEdscStore.setState({
        facetParams: {
          featureFacets: {
            customizable: true
          }
        }
      })

      const params = prepareCollectionParams({})

      expect(params).toEqual(
        expect.objectContaining({
          serviceType: [
            'esi',
            'opendap',
            'harmony'
          ]
        })
      )
    })
  })
})

describe('#buildCollectionSearchParams', () => {
  test('passes advanced collection filters to CMR', () => {
    const advancedFilters = {
      doi: '10.5067/EXAMPLE',
      entryTitle: 'Example Collection',
      consortium: ['CEOS'],
      hasGranulesCreatedAt: '2026-01-01T00:00:00Z,',
      collectionDataType: ['SCIENCE_QUALITY'],
      collectionProgress: ['ACTIVE', 'COMPLETE'],
      downloadable: true,
      browsable: true,
      variableName: 'temperature',
      serviceName: 'Harmony',
      toolName: 'NASA_GISS_Panoply'
    }

    expect(buildCollectionSearchParams({
      ...advancedFilters,
      featureFacets: {},
      viewAllFacets: {}
    })).toEqual(expect.objectContaining(advancedFilters))
  })

  test('passes multiple Entry IDs to CMR', () => {
    expect(buildCollectionSearchParams({
      entryId: ['ATL03_004', 'ATL06_006'],
      featureFacets: {},
      viewAllFacets: {}
    })).toEqual(expect.objectContaining({
      entryId: ['ATL03_004', 'ATL06_006']
    }))
  })

  test('preserves short name and version', () => {
    expect(buildCollectionSearchParams({
      shortName: 'ATL03',
      version: '003',
      featureFacets: {},
      viewAllFacets: {}
    })).toEqual(expect.objectContaining({
      shortName: 'ATL03',
      version: '003'
    }))
  })

  describe('when the keyword does not have a quoted string', () => {
    test('the wildcard character is added between words', () => {
      const params = buildCollectionSearchParams({
        featureFacets: {},
        keyword: 'modis terra',
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        keyword: 'modis* terra*'
      }))
    })
  })

  describe('when the keyword has a quoted string', () => {
    test('the wildcard character is not added between words', () => {
      const params = buildCollectionSearchParams({
        featureFacets: {},
        keyword: '"modis" terra',
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        keyword: '"modis" terra'
      }))
    })
  })

  describe('options parameter', () => {
    test('adds correct options when multiple science keywords facets exist', () => {
      const params = buildCollectionSearchParams({
        cmrFacets: {
          science_keywords_h: [{
            topic: 'Agriculture'
          }, {
            topic: 'Atmosphere'
          }]
        },
        featureFacets: {},
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        options: {
          science_keywords_h: {
            or: true
          }
        }
      }))
    })

    test('adds correct options when multiple platforms facets exist', () => {
      const params = buildCollectionSearchParams({
        cmrFacets: {
          platforms_h: [{
            basis: 'Space-based Platforms'
          }, {
            basis: 'Air-based Platforms'
          }]
        },
        featureFacets: {},
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        options: {
          platforms_h: {
            or: true
          }
        }
      }))
    })

    test('adds correct options when multiple spatial exists', () => {
      const params = buildCollectionSearchParams({
        point: [
          38.8048355,
          -77.0469214
        ],
        bounding_box: [
          -77.0372879,
          -77.144359,
          38.845011,
          38.785216
        ],
        featureFacets: {},
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        options: {
          spatial: {
            or: true
          }
        }
      }))
    })

    test('adds correct options when temporal exists', () => {
      const params = buildCollectionSearchParams({
        temporalString: '2022-01-01T00:00:00.000Z,2022-01-31T23:59:59.999Z',
        featureFacets: {},
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        options: {
          temporal: {
            limit_to_granules: true
          }
        }
      }))
    })
  })
})
