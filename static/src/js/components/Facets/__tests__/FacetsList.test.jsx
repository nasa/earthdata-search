import { act, waitFor } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import FacetsList from '../FacetsList'
import FacetsItem from '../FacetsItem'
import useEdscStore from '../../../zustand/useEdscStore'

vi.mock('../FacetsItem', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: FacetsList,
  defaultProps: {
    facetCategory: 'test_category',
    changeHandler: vi.fn(),
    facets: [
      {
        title: 'Facet 1',
        count: 5,
        applied: false,
        children: []
      },
      {
        title: 'Facet 2',
        count: 10,
        applied: true,
        children: []
      }
    ]
  },
  defaultZustandState: {
    collections: {
      collections: {
        isLoading: false
      }
    },
    facets: {
      viewAllFacets: {
        isLoading: false
      }
    }
  }
})

describe('FacetsList', () => {
  test('renders the facet items', () => {
    const { props } = setup()

    expect(FacetsItem).toHaveBeenCalledTimes(2)
    expect(FacetsItem).toHaveBeenNthCalledWith(1, {
      autocompleteType: null,
      changeHandler: props.changeHandler,
      facet: {
        applied: false,
        applyingFacet: null,
        children: [],
        count: 5,
        setApplyingFacet: expect.any(Function),
        title: 'Facet 1'
      },
      facetCategory: 'test_category',
      level: 0,
      uid: expect.stringContaining('facet-item_')
    }, {})

    expect(FacetsItem).toHaveBeenNthCalledWith(2, {
      autocompleteType: null,
      changeHandler: props.changeHandler,
      facet: {
        applied: true,
        applyingFacet: null,
        children: [],
        count: 10,
        setApplyingFacet: expect.any(Function),
        title: 'Facet 2'
      },
      facetCategory: 'test_category',
      level: 0,
      uid: expect.stringContaining('facet-item_')
    }, {})
  })

  describe('when viewing the facets list', () => {
    describe('when a facet is being applied', () => {
      test('passes the applyingFacet state to the FacetsItem components', async () => {
        const { props } = setup({
          overrideZustandState: {
            collections: {
              collections: {
                isLoading: true
              }
            }
          }
        })

        const firstFacet = FacetsItem.mock.calls[0][0].facet

        vi.clearAllMocks()

        // Simulate applying the first facet
        await act(() => {
          firstFacet.setApplyingFacet('Facet 1')
        })

        expect(FacetsItem).toHaveBeenCalledTimes(2)
        expect(FacetsItem).toHaveBeenNthCalledWith(1, {
          autocompleteType: null,
          changeHandler: props.changeHandler,
          facet: {
            applied: false,
            applyingFacet: 'Facet 1',
            children: [],
            count: 5,
            setApplyingFacet: expect.any(Function),
            title: 'Facet 1'
          },
          facetCategory: 'test_category',
          level: 0,
          uid: expect.stringContaining('facet-item_')
        }, {})

        expect(FacetsItem).toHaveBeenNthCalledWith(2, {
          autocompleteType: null,
          changeHandler: props.changeHandler,
          facet: {
            applied: true,
            applyingFacet: 'Facet 1',
            children: [],
            count: 10,
            setApplyingFacet: expect.any(Function),
            title: 'Facet 2'
          },
          facetCategory: 'test_category',
          level: 0,
          uid: expect.stringContaining('facet-item_')
        }, {})
      })

      describe('when the collections finish loading', () => {
        test('resets the applyingFacet state', async () => {
          setup({
            overrideZustandState: {
              collections: {
                collections: {
                  isLoading: true
                }
              }
            }
          })

          const firstFacet = FacetsItem.mock.calls[0][0].facet

          // Simulate applying the first facet
          await act(() => {
            firstFacet.setApplyingFacet('Facet 1')
          })

          vi.clearAllMocks()

          // Update the store to set isLoading to false
          await act(() => {
            useEdscStore.setState({
              collections: {
                collections: {
                  isLoading: false
                }
              }
            })
          })

          await waitFor(() => {
            expect(FacetsItem).toHaveBeenCalledTimes(4)
          })

          expect(FacetsItem).toHaveBeenNthCalledWith(3, {
            autocompleteType: null,
            changeHandler: expect.any(Function),
            facet: {
              applied: false,
              applyingFacet: null,
              children: [],
              count: 5,
              setApplyingFacet: expect.any(Function),
              title: 'Facet 1'
            },
            facetCategory: 'test_category',
            level: 0,
            uid: expect.stringContaining('facet-item_')
          }, {})

          expect(FacetsItem).toHaveBeenNthCalledWith(4, {
            autocompleteType: null,
            changeHandler: expect.any(Function),
            facet: {
              applied: true,
              applyingFacet: null,
              children: [],
              count: 10,
              setApplyingFacet: expect.any(Function),
              title: 'Facet 2'
            },
            facetCategory: 'test_category',
            level: 0,
            uid: expect.stringContaining('facet-item_')
          }, {})
        })
      })
    })
  })

  describe('when viewing the view all facets list', () => {
    describe('when a facet is being applied', () => {
      test('passes the applyingFacet state to the FacetsItem components', async () => {
        const { props } = setup({
          overrideZustandState: {
            facets: {
              viewAllFacets: {
                isLoading: true
              }
            }
          }
        })

        const firstFacet = FacetsItem.mock.calls[0][0].facet

        vi.clearAllMocks()

        // Simulate applying the first facet
        await act(() => {
          firstFacet.setApplyingFacet('Facet 1')
        })

        expect(FacetsItem).toHaveBeenCalledTimes(2)
        expect(FacetsItem).toHaveBeenNthCalledWith(1, {
          autocompleteType: null,
          changeHandler: props.changeHandler,
          facet: {
            applied: false,
            applyingFacet: 'Facet 1',
            children: [],
            count: 5,
            setApplyingFacet: expect.any(Function),
            title: 'Facet 1'
          },
          facetCategory: 'test_category',
          level: 0,
          uid: expect.stringContaining('facet-item_')
        }, {})

        expect(FacetsItem).toHaveBeenNthCalledWith(2, {
          autocompleteType: null,
          changeHandler: props.changeHandler,
          facet: {
            applied: true,
            applyingFacet: 'Facet 1',
            children: [],
            count: 10,
            setApplyingFacet: expect.any(Function),
            title: 'Facet 2'
          },
          facetCategory: 'test_category',
          level: 0,
          uid: expect.stringContaining('facet-item_')
        }, {})
      })

      describe('when the collections finish loading', () => {
        test('resets the applyingFacet state', async () => {
          setup({
            overrideZustandState: {
              facets: {
                viewAllFacets: {
                  isLoading: true
                }
              }
            }
          })

          const firstFacet = FacetsItem.mock.calls[0][0].facet

          // Simulate applying the first facet
          await act(() => {
            firstFacet.setApplyingFacet('Facet 1')
          })

          vi.clearAllMocks()

          // Update the store to set isLoading to false
          await act(() => {
            useEdscStore.setState({
              facets: {
                viewAllFacets: {
                  isLoading: false
                }
              }
            })
          })

          await waitFor(() => {
            expect(FacetsItem).toHaveBeenCalledTimes(4)
          })

          expect(FacetsItem).toHaveBeenNthCalledWith(3, {
            autocompleteType: null,
            changeHandler: expect.any(Function),
            facet: {
              applied: false,
              applyingFacet: null,
              children: [],
              count: 5,
              setApplyingFacet: expect.any(Function),
              title: 'Facet 1'
            },
            facetCategory: 'test_category',
            level: 0,
            uid: expect.stringContaining('facet-item_')
          }, {})

          expect(FacetsItem).toHaveBeenNthCalledWith(4, {
            autocompleteType: null,
            changeHandler: expect.any(Function),
            facet: {
              applied: true,
              applyingFacet: null,
              children: [],
              count: 10,
              setApplyingFacet: expect.any(Function),
              title: 'Facet 2'
            },
            facetCategory: 'test_category',
            level: 0,
            uid: expect.stringContaining('facet-item_')
          }, {})
        })
      })
    })
  })
})
