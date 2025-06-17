import useEdscStore from '../../useEdscStore'

// @ts-expect-error This file does not have types
import configureStore from '../../../store/configureStore'

import {
  REMOVE_SUBSCRIPTION_DISABLED_FIELDS,
  TOGGLE_VIEW_ALL_FACETS_MODAL,
  UPDATE_COLLECTION_QUERY
  // @ts-expect-error This file does not have types
} from '../../../constants/actionTypes'

jest.mock('../../../store/configureStore', () => jest.fn())

const mockDispatch = jest.fn()
const mockGetState = jest.fn()
configureStore.mockReturnValue({
  dispatch: mockDispatch,
  getState: mockGetState
})

describe('createFacetParamsSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { facetParams } = zustandState

    expect(facetParams).toEqual({
      featureFacets: {
        availableInEarthdataCloud: false,
        customizable: false,
        mapImagery: false
      },
      cmrFacets: {},
      viewAllFacets: {},
      addCmrFacetFromAutocomplete: expect.any(Function),
      applyViewAllFacets: expect.any(Function),
      resetFacetParams: expect.any(Function),
      setCmrFacets: expect.any(Function),
      setFeatureFacets: expect.any(Function),
      setViewAllFacets: expect.any(Function),
      triggerViewAllFacets: expect.any(Function)
    })
  })

  describe('resetFacetParams', () => {
    test('resets facetParams to initial state', () => {
      const zustandState = useEdscStore.getState()
      const { facetParams } = zustandState
      const { resetFacetParams } = facetParams
      resetFacetParams()

      const updatedState = useEdscStore.getState()
      const { facetParams: updatedFacetParamss } = updatedState
      expect(updatedFacetParamss).toEqual({
        featureFacets: {
          availableInEarthdataCloud: false,
          customizable: false,
          mapImagery: false
        },
        cmrFacets: {},
        viewAllFacets: {},
        addCmrFacetFromAutocomplete: expect.any(Function),
        applyViewAllFacets: expect.any(Function),
        resetFacetParams: expect.any(Function),
        setCmrFacets: expect.any(Function),
        setFeatureFacets: expect.any(Function),
        setViewAllFacets: expect.any(Function),
        triggerViewAllFacets: expect.any(Function)
      })
    })
  })

  describe('addCmrFacetFromAutocomplete', () => {
    test('adds a facet to cmrFacets', () => {
      const zustandState = useEdscStore.getState()
      const { facetParams } = zustandState
      const { addCmrFacetFromAutocomplete } = facetParams
      addCmrFacetFromAutocomplete({
        science_keywords_h: {
          topic: 'Agriculture',
          term: 'Soils'
        }
      })

      const updatedState = useEdscStore.getState()
      const { facetParams: updatedFacetParamss } = updatedState
      expect(updatedFacetParamss.cmrFacets).toEqual({
        science_keywords_h: [{
          topic: 'Agriculture',
          term: 'Soils'
        }]
      })

      expect(mockDispatch).toHaveBeenCalledTimes(0)
    })
  })

  describe('applyViewAllFacets', () => {
    test('applies viewAllFacets to cmrFacets', () => {
      const zustandState = useEdscStore.getState()
      const { facetParams } = zustandState
      const { applyViewAllFacets } = facetParams

      // Set initial viewAllFacets
      useEdscStore.setState({
        facetParams: {
          ...facetParams,
          viewAllFacets: {
            instrument_h: ['AIRS']
          }
        }
      })

      // Apply the viewAllFacets
      applyViewAllFacets()

      const updatedState = useEdscStore.getState()
      const { facetParams: updatedFacetParamss } = updatedState
      expect(updatedFacetParamss.cmrFacets).toEqual({
        instrument_h: ['AIRS']
      })

      expect(mockDispatch).toHaveBeenCalledTimes(4)
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload: { pageNum: 1 },
        type: UPDATE_COLLECTION_QUERY
      })

      expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
      expect(mockDispatch).toHaveBeenNthCalledWith(3, {
        type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
      })

      expect(mockDispatch).toHaveBeenNthCalledWith(4, {
        type: TOGGLE_VIEW_ALL_FACETS_MODAL,
        payload: false
      })
    })
  })

  describe('setFeatureFacets', () => {
    test('updates featureFacets', () => {
      const zustandState = useEdscStore.getState()
      const { facetParams } = zustandState
      const { setFeatureFacets } = facetParams
      setFeatureFacets({ availableInEarthdataCloud: true })

      const updatedState = useEdscStore.getState()
      const { facetParams: updatedFacetParamss } = updatedState
      expect(updatedFacetParamss.featureFacets).toEqual({
        availableInEarthdataCloud: true,
        customizable: false,
        mapImagery: false
      })

      expect(mockDispatch).toHaveBeenCalledTimes(3)
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        payload: { pageNum: 1 },
        type: UPDATE_COLLECTION_QUERY
      })

      expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
      expect(mockDispatch).toHaveBeenNthCalledWith(3, {
        type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
      })
    })
  })

  describe('setCmrFacets', () => {
    describe('when setting science keywords', () => {
      describe('when the facet is being applied', () => {
        test('updates cmrFacets', () => {
          const zustandState = useEdscStore.getState()
          const { facetParams } = zustandState
          const { setCmrFacets } = facetParams
          setCmrFacets(
            {
              science_keywords_h: [
                {
                  topic: 'Agriculture'
                }
              ]
            }
          )

          const updatedState = useEdscStore.getState()
          const { facetParams: updatedFacetParamss } = updatedState
          expect(updatedFacetParamss.cmrFacets).toEqual({
            science_keywords_h: [{ topic: 'Agriculture' }]
          })

          expect(mockDispatch).toHaveBeenCalledTimes(3)
          expect(mockDispatch).toHaveBeenNthCalledWith(1, {
            payload: { pageNum: 1 },
            type: UPDATE_COLLECTION_QUERY
          })

          expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
          expect(mockDispatch).toHaveBeenNthCalledWith(3, {
            type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
          })
        })

        describe('when the facet is being removed', () => {
          test('updates cmrFacets', () => {
            mockGetState.mockReturnValue({
              autocomplete: {
                selected: {}
              }
            })

            const zustandState = useEdscStore.getState()
            const { facetParams } = zustandState
            const { setCmrFacets } = facetParams
            setCmrFacets(
              {
                science_keywords_h: []
              }
            )

            const updatedState = useEdscStore.getState()
            const { facetParams: updatedFacetParamss } = updatedState
            expect(updatedFacetParamss.cmrFacets).toEqual({
              science_keywords_h: []
            })

            expect(mockDispatch).toHaveBeenCalledTimes(3)

            expect(mockDispatch).toHaveBeenNthCalledWith(1, {
              payload: { pageNum: 1 },
              type: UPDATE_COLLECTION_QUERY
            })

            expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
            expect(mockDispatch).toHaveBeenNthCalledWith(3, {
              type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
            })
          })
        })
      })
    })

    describe('when setting platforms', () => {
      test('updates cmrFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            platforms_h: [
              {
                basis: 'Land-based+Platforms'
              }
            ]
          }
        )

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.cmrFacets).toEqual({
          platforms_h: [{ basis: 'Land-based+Platforms' }]
        })

        expect(mockDispatch).toHaveBeenCalledTimes(3)
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          payload: { pageNum: 1 },
          type: UPDATE_COLLECTION_QUERY
        })

        expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
        })
      })
    })

    describe('when setting instruments', () => {
      test('updates cmrFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            instrument_h: ['AIRS']
          }
        )

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.cmrFacets).toEqual({
          instrument_h: ['AIRS']
        })

        expect(mockDispatch).toHaveBeenCalledTimes(3)
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          payload: { pageNum: 1 },
          type: UPDATE_COLLECTION_QUERY
        })

        expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
        })
      })
    })

    describe('when setting organizations', () => {
      test('updates cmrFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            data_center_h: ['Alaska+Satellite+Facility']
          }
        )

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.cmrFacets).toEqual({
          data_center_h: ['Alaska+Satellite+Facility']
        })

        expect(mockDispatch).toHaveBeenCalledTimes(3)
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          payload: { pageNum: 1 },
          type: UPDATE_COLLECTION_QUERY
        })

        expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
        })
      })
    })

    describe('when setting projects', () => {
      test('updates cmrFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            project_h: ['ABoVE']
          }
        )

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.cmrFacets).toEqual({
          project_h: ['ABoVE']
        })

        expect(mockDispatch).toHaveBeenCalledTimes(3)
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          payload: { pageNum: 1 },
          type: UPDATE_COLLECTION_QUERY
        })

        expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
        })
      })
    })

    describe('when setting processing level id', () => {
      test('updates cmrFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            processing_level_id_h: ['0+-+Raw+Data']
          }
        )

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.cmrFacets).toEqual({
          processing_level_id_h: ['0+-+Raw+Data']
        })

        expect(mockDispatch).toHaveBeenCalledTimes(3)
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          payload: { pageNum: 1 },
          type: UPDATE_COLLECTION_QUERY
        })

        expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
        })
      })
    })

    describe('when setting data format', () => {
      test('updates cmrFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            granule_data_format_h: ['ASCII']
          }
        )

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.cmrFacets).toEqual({
          granule_data_format_h: ['ASCII']
        })

        expect(mockDispatch).toHaveBeenCalledTimes(3)
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          payload: { pageNum: 1 },
          type: UPDATE_COLLECTION_QUERY
        })

        expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
        })
      })
    })

    describe('when setting tiling system', () => {
      test('updates cmrFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            two_d_coordinate_system_name: ['CALIPSO']
          }
        )

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.cmrFacets).toEqual({
          two_d_coordinate_system_name: ['CALIPSO']
        })

        expect(mockDispatch).toHaveBeenCalledTimes(3)
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          payload: { pageNum: 1 },
          type: UPDATE_COLLECTION_QUERY
        })

        expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
        })
      })
    })

    describe('when setting horizontal data resolution', () => {
      test('updates cmrFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            horizontal_data_resolution_range: ['0+to+1+meter']
          }
        )

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.cmrFacets).toEqual({
          horizontal_data_resolution_range: ['0+to+1+meter']
        })

        expect(mockDispatch).toHaveBeenCalledTimes(3)
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          payload: { pageNum: 1 },
          type: UPDATE_COLLECTION_QUERY
        })

        expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
        })
      })
    })

    describe('when setting latency', () => {
      test('updates cmrFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            latency: ['1+to+3+hours']
          }
        )

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.cmrFacets).toEqual({
          latency: ['1+to+3+hours']
        })

        expect(mockDispatch).toHaveBeenCalledTimes(3)
        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          payload: { pageNum: 1 },
          type: UPDATE_COLLECTION_QUERY
        })

        expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.any(Function))
        expect(mockDispatch).toHaveBeenNthCalledWith(3, {
          type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
        })
      })
    })
  })

  describe('setViewAllFacets', () => {
    describe('when setting instruments', () => {
      test('updates viewAllFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setViewAllFacets } = facetParams
        setViewAllFacets({
          instrument_h: ['AIRS']
        }, 'instrument_h')

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.viewAllFacets).toEqual({
          instrument_h: ['AIRS']
        })
      })
    })

    describe('when setting organizations', () => {
      test('updates viewAllFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setViewAllFacets } = facetParams
        setViewAllFacets({
          data_center_h: ['Alaska+Satellite+Facility']
        }, 'data_center_h')

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.viewAllFacets).toEqual({
          data_center_h: ['Alaska+Satellite+Facility']
        })
      })
    })

    describe('when setting projects', () => {
      test('updates viewAllFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setViewAllFacets } = facetParams
        setViewAllFacets({
          project_h: ['ABoVE']
        }, 'project_h')

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.viewAllFacets).toEqual({
          project_h: ['ABoVE']
        })
      })
    })

    describe('when setting data format', () => {
      test('updates viewAllFacets', () => {
        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setViewAllFacets } = facetParams
        setViewAllFacets({
          granule_data_format_h: ['ASCII']
        }, 'granule_data_format_h')

        const updatedState = useEdscStore.getState()
        const { facetParams: updatedFacetParamss } = updatedState
        expect(updatedFacetParamss.viewAllFacets).toEqual({
          granule_data_format_h: ['ASCII']
        })
      })
    })
  })

  describe('triggerViewAllFacets', () => {
    test('triggers the View All Facets modal', () => {
      const zustandState = useEdscStore.getState()
      const { facetParams } = zustandState
      const { triggerViewAllFacets } = facetParams

      useEdscStore.setState({
        facetParams: {
          ...facetParams,
          cmrFacets: {
            instrument_h: ['AIRS']
          }
        }
      })

      // Trigger the View All Facets modal for instruments
      triggerViewAllFacets('instrument_h')

      expect(mockDispatch).toHaveBeenCalledTimes(1)
      expect(mockDispatch).toHaveBeenNthCalledWith(1, expect.any(Function))

      // Check that the viewAllFacets state is set to the current cmrFacets
      const updatedState = useEdscStore.getState()
      const { facetParams: updatedFacetParamss } = updatedState
      expect(updatedFacetParamss.viewAllFacets).toEqual({
        instrument_h: ['AIRS']
      })
    })
  })
})
