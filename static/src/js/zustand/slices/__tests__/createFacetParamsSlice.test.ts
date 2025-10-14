import useEdscStore from '../../useEdscStore'

// @ts-expect-error This file does not have types
import configureStore from '../../../store/configureStore'

// @ts-expect-error This file does not have types
import actions from '../../../actions'

jest.mock('../../../store/configureStore', () => jest.fn())

jest.mock('../../../actions', () => ({
  getViewAllFacets: jest.fn(),
  removeSubscriptionDisabledFields: jest.fn(),
  toggleFacetsModal: jest.fn()
}))

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
      const { facetParams: updatedFacetParams } = updatedState
      expect(updatedFacetParams).toEqual({
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
      const { facetParams: updatedFacetParams } = updatedState

      expect(updatedFacetParams.cmrFacets).toEqual({
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
      useEdscStore.setState((state) => {
        state.facetParams.setCmrFacets = jest.fn()
        state.facetParams.viewAllFacets.instrument_h = ['AIRS']
        state.query.changeQuery = jest.fn()
      })

      // Apply the viewAllFacets
      applyViewAllFacets()

      const updatedState = useEdscStore.getState()
      const {
        facetParams: updatedFacetParams
      } = updatedState

      expect(updatedFacetParams.setCmrFacets).toHaveBeenCalledTimes(1)
      expect(updatedFacetParams.setCmrFacets).toHaveBeenCalledWith({
        instrument_h: ['AIRS']
      })

      // Ensure the facets modal is closed
      expect(actions.toggleFacetsModal).toHaveBeenCalledTimes(1)
    })

    test('clears viewAllFacets after applying them', () => {
      const zustandState = useEdscStore.getState()
      const { facetParams } = zustandState
      const { applyViewAllFacets } = facetParams

      // Set initial viewAllFacets
      useEdscStore.setState((state) => {
        state.facetParams.setCmrFacets = jest.fn()
        state.facetParams.viewAllFacets = {
          instrument_h: ['AIRS'],
          data_center_h: ['NASA']
        }

        state.query.changeQuery = jest.fn()
      })

      // Apply the viewAllFacets
      applyViewAllFacets()

      const updatedState = useEdscStore.getState()
      const {
        facetParams: updatedFacetParams
      } = updatedState

      // ViewAllFacets should be cleared after applying
      expect(updatedFacetParams.viewAllFacets).toEqual({})
    })
  })

  describe('setFeatureFacets', () => {
    test('updates featureFacets', () => {
      useEdscStore.setState((state) => {
        state.collections.getCollections = jest.fn()
        state.query.changeQuery = jest.fn()
      })

      const zustandState = useEdscStore.getState()
      const { facetParams } = zustandState
      const { setFeatureFacets } = facetParams
      setFeatureFacets({ availableInEarthdataCloud: true })

      const updatedState = useEdscStore.getState()
      const {
        collections,
        facetParams: updatedFacetParams,
        query
      } = updatedState

      expect(updatedFacetParams.featureFacets).toEqual({
        availableInEarthdataCloud: true,
        customizable: false,
        mapImagery: false
      })

      expect(collections.getCollections).toHaveBeenCalledTimes(1)
      expect(collections.getCollections).toHaveBeenCalledWith()

      expect(query.changeQuery).toHaveBeenCalledTimes(1)
      expect(query.changeQuery).toHaveBeenCalledWith({
        collection: {
          pageNum: 1
        }
      })

      expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
      expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
    })
  })

  describe('setCmrFacets', () => {
    describe('when setting science keywords', () => {
      describe('when the facet is being applied', () => {
        test('updates cmrFacets', () => {
          useEdscStore.setState((state) => {
            state.collections.getCollections = jest.fn()
            state.query.changeQuery = jest.fn()
          })

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
          const {
            collections,
            facetParams: updatedFacetParams,
            query
          } = updatedState

          expect(updatedFacetParams.cmrFacets).toEqual({
            science_keywords_h: [{ topic: 'Agriculture' }]
          })

          expect(collections.getCollections).toHaveBeenCalledTimes(1)
          expect(collections.getCollections).toHaveBeenCalledWith()

          expect(query.changeQuery).toHaveBeenCalledTimes(1)
          expect(query.changeQuery).toHaveBeenCalledWith({
            collection: {
              pageNum: 1
            }
          })

          expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
          expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
        })

        describe('when the facet is being removed', () => {
          test('updates cmrFacets', () => {
            useEdscStore.setState((state) => {
              state.collections.getCollections = jest.fn()
              state.query.changeQuery = jest.fn()
            })

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
            const {
              collections,
              facetParams: updatedFacetParams,
              query
            } = updatedState

            expect(updatedFacetParams.cmrFacets).toEqual({
              science_keywords_h: []
            })

            expect(collections.getCollections).toHaveBeenCalledTimes(1)
            expect(collections.getCollections).toHaveBeenCalledWith()

            expect(query.changeQuery).toHaveBeenCalledTimes(1)
            expect(query.changeQuery).toHaveBeenCalledWith({
              collection: {
                pageNum: 1
              }
            })

            expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
            expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
          })
        })
      })
    })

    describe('when setting platforms', () => {
      test('updates cmrFacets', () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.changeQuery = jest.fn()
        })

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
        const {
          collections,
          facetParams: updatedFacetParams,
          query
        } = updatedState

        expect(updatedFacetParams.cmrFacets).toEqual({
          platforms_h: [{ basis: 'Land-based+Platforms' }]
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(query.changeQuery).toHaveBeenCalledTimes(1)
        expect(query.changeQuery).toHaveBeenCalledWith({
          collection: {
            pageNum: 1
          }
        })

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when setting instruments', () => {
      test('updates cmrFacets', () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.changeQuery = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            instrument_h: ['AIRS']
          }
        )

        const updatedState = useEdscStore.getState()
        const {
          collections,
          facetParams: updatedFacetParams,
          query
        } = updatedState

        expect(updatedFacetParams.cmrFacets).toEqual({
          instrument_h: ['AIRS']
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(query.changeQuery).toHaveBeenCalledTimes(1)
        expect(query.changeQuery).toHaveBeenCalledWith({
          collection: {
            pageNum: 1
          }
        })

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when setting organizations', () => {
      test('updates cmrFacets', () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.changeQuery = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            data_center_h: ['Alaska+Satellite+Facility']
          }
        )

        const updatedState = useEdscStore.getState()
        const {
          collections,
          facetParams: updatedFacetParams,
          query
        } = updatedState

        expect(updatedFacetParams.cmrFacets).toEqual({
          data_center_h: ['Alaska+Satellite+Facility']
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(query.changeQuery).toHaveBeenCalledTimes(1)
        expect(query.changeQuery).toHaveBeenCalledWith({
          collection: {
            pageNum: 1
          }
        })

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when setting projects', () => {
      test('updates cmrFacets', () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.changeQuery = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            project_h: ['ABoVE']
          }
        )

        const updatedState = useEdscStore.getState()
        const {
          collections,
          facetParams: updatedFacetParams,
          query
        } = updatedState

        expect(updatedFacetParams.cmrFacets).toEqual({
          project_h: ['ABoVE']
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(query.changeQuery).toHaveBeenCalledTimes(1)
        expect(query.changeQuery).toHaveBeenCalledWith({
          collection: {
            pageNum: 1
          }
        })

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when setting processing level id', () => {
      test('updates cmrFacets', () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.changeQuery = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            processing_level_id_h: ['0+-+Raw+Data']
          }
        )

        const updatedState = useEdscStore.getState()
        const {
          collections,
          facetParams: updatedFacetParams,
          query
        } = updatedState

        expect(updatedFacetParams.cmrFacets).toEqual({
          processing_level_id_h: ['0+-+Raw+Data']
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(query.changeQuery).toHaveBeenCalledTimes(1)
        expect(query.changeQuery).toHaveBeenCalledWith({
          collection: {
            pageNum: 1
          }
        })

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when setting data format', () => {
      test('updates cmrFacets', () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.changeQuery = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            granule_data_format_h: ['ASCII']
          }
        )

        const updatedState = useEdscStore.getState()
        const {
          collections,
          facetParams: updatedFacetParams,
          query
        } = updatedState

        expect(updatedFacetParams.cmrFacets).toEqual({
          granule_data_format_h: ['ASCII']
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(query.changeQuery).toHaveBeenCalledTimes(1)
        expect(query.changeQuery).toHaveBeenCalledWith({
          collection: {
            pageNum: 1
          }
        })

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when setting tiling system', () => {
      test('updates cmrFacets', () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.changeQuery = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            two_d_coordinate_system_name: ['CALIPSO']
          }
        )

        const updatedState = useEdscStore.getState()
        const {
          collections,
          facetParams: updatedFacetParams,
          query
        } = updatedState

        expect(updatedFacetParams.cmrFacets).toEqual({
          two_d_coordinate_system_name: ['CALIPSO']
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(query.changeQuery).toHaveBeenCalledTimes(1)
        expect(query.changeQuery).toHaveBeenCalledWith({
          collection: {
            pageNum: 1
          }
        })

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when setting horizontal data resolution', () => {
      test('updates cmrFacets', () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.changeQuery = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            horizontal_data_resolution_range: ['0+to+1+meter']
          }
        )

        const updatedState = useEdscStore.getState()
        const {
          collections,
          facetParams: updatedFacetParams,
          query
        } = updatedState

        expect(updatedFacetParams.cmrFacets).toEqual({
          horizontal_data_resolution_range: ['0+to+1+meter']
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(query.changeQuery).toHaveBeenCalledTimes(1)
        expect(query.changeQuery).toHaveBeenCalledWith({
          collection: {
            pageNum: 1
          }
        })

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when setting latency', () => {
      test('updates cmrFacets', () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.changeQuery = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams
        setCmrFacets(
          {
            latency: ['1+to+3+hours']
          }
        )

        const updatedState = useEdscStore.getState()
        const {
          collections,
          facetParams: updatedFacetParams,
          query
        } = updatedState

        expect(updatedFacetParams.cmrFacets).toEqual({
          latency: ['1+to+3+hours']
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(query.changeQuery).toHaveBeenCalledTimes(1)
        expect(query.changeQuery).toHaveBeenCalledWith({
          collection: {
            pageNum: 1
          }
        })

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when combining viewAllFacets with cmrFacets', () => {
      test('combines viewAllFacets and cmrFacets when setCmrFacets is called', () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.changeQuery = jest.fn()
          // Set up existing viewAllFacets
          state.facetParams.viewAllFacets = {
            instrument_h: ['AIRS']
          }
        })

        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams

        // Call setCmrFacets with new facets
        setCmrFacets({
          science_keywords_h: [{ topic: 'Agriculture' }],
          data_center_h: ['NASA']
        })

        const updatedState = useEdscStore.getState()
        const {
          collections,
          facetParams: updatedFacetParams,
          query
        } = updatedState

        // Should combine viewAllFacets with the new cmrFacets
        expect(updatedFacetParams.cmrFacets).toEqual({
          instrument_h: ['AIRS'],
          science_keywords_h: [{ topic: 'Agriculture' }],
          data_center_h: ['NASA']
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(query.changeQuery).toHaveBeenCalledTimes(1)
        expect(query.changeQuery).toHaveBeenCalledWith({
          collection: {
            pageNum: 1
          }
        })

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })

      test('handles empty viewAllFacets when combining', () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.changeQuery = jest.fn()
          // Set up empty viewAllFacets
          state.facetParams.viewAllFacets = {}
        })

        const zustandState = useEdscStore.getState()
        const { facetParams } = zustandState
        const { setCmrFacets } = facetParams

        // Call setCmrFacets with new facets
        setCmrFacets({
          science_keywords_h: [{ topic: 'Agriculture' }]
        })

        const updatedState = useEdscStore.getState()
        const {
          collections,
          facetParams: updatedFacetParams,
          query
        } = updatedState

        // Should only have the new cmrFacets when viewAllFacets is empty
        expect(updatedFacetParams.cmrFacets).toEqual({
          science_keywords_h: [{ topic: 'Agriculture' }]
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(query.changeQuery).toHaveBeenCalledTimes(1)
        expect(query.changeQuery).toHaveBeenCalledWith({
          collection: {
            pageNum: 1
          }
        })

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
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
        const { facetParams: updatedFacetParams } = updatedState
        expect(updatedFacetParams.viewAllFacets).toEqual({
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
        const { facetParams: updatedFacetParams } = updatedState
        expect(updatedFacetParams.viewAllFacets).toEqual({
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
        const { facetParams: updatedFacetParams } = updatedState
        expect(updatedFacetParams.viewAllFacets).toEqual({
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
        const { facetParams: updatedFacetParams } = updatedState
        expect(updatedFacetParams.viewAllFacets).toEqual({
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

      expect(actions.getViewAllFacets).toHaveBeenCalledTimes(1)
      expect(actions.getViewAllFacets).toHaveBeenCalledWith('instrument_h')

      // Check that the viewAllFacets state is set to the current cmrFacets
      const updatedState = useEdscStore.getState()
      const { facetParams: updatedFacetParams } = updatedState
      expect(updatedFacetParams.viewAllFacets).toEqual({
        instrument_h: ['AIRS']
      })
    })
  })
})
