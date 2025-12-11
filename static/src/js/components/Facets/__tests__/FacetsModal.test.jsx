import React from 'react'
import { act, screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import FacetsModal from '../FacetsModal'
import FacetsModalNav from '../FacetsModalNav'
import FacetsList from '../FacetsList'
import Skeleton from '../../Skeleton/Skeleton'

import EDSCModalContainer from '../../../containers/EDSCModalContainer/EDSCModalContainer'

import useEdscStore from '../../../zustand/useEdscStore'
import { MODAL_NAMES } from '../../../constants/modalNames'

jest.mock('../../../containers/EDSCModalContainer/EDSCModalContainer', () => jest.fn((props) => (
  <>
    {props.body}
    {props.footerMeta}
    {props.innerHeader}
  </>
)))

jest.mock('../FacetsList', () => jest.fn(() => <div />))
jest.mock('../FacetsModalNav', () => jest.fn(() => <div />))
jest.mock('../../Skeleton/Skeleton', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: FacetsModal,
  defaultProps: {
    collectionHits: null,
    viewAllFacets: {
      allIds: ['Test Category'],
      byId: {
        'Test Category': {}
      },
      hits: null,
      isLoaded: false,
      isLoading: false,
      selectedCategory: 'Test Category'
    },
    onApplyViewAllFacets: jest.fn(),
    onChangeViewAllFacet: jest.fn(),
    onToggleFacetsModal: jest.fn()
  },
  defaultZustandState: {
    facetParams: {
      applyViewAllFacets: jest.fn(),
      setViewAllFacets: jest.fn()
    },
    ui: {
      modals: {
        openModal: MODAL_NAMES.VIEW_ALL_FACETS,
        setOpenModal: jest.fn()
      }
    }
  }
})

describe('FacetsModal component', () => {
  describe('when selected category is not defined', () => {
    test('the modal does not render', () => {
      setup({
        overrideProps: {
          viewAllFacets: {
            allIds: [],
            byId: {},
            hits: null,
            isLoaded: false,
            isLoading: false,
            selectedCategory: null
          }
        },
        overrideZustandState: {
          ui: {
            modals: {
              openModal: null
            }
          }
        }
      })

      expect(EDSCModalContainer).toHaveBeenCalledTimes(0)
    })
  })

  describe('when selected category is defined', () => {
    test('the modal is not visible', () => {
      setup({
        overrideZustandState: {
          ui: {
            modals: {
              openModal: null
            }
          }
        }
      })

      expect(EDSCModalContainer).toHaveBeenCalledTimes(0)
      expect(FacetsModalNav).toHaveBeenCalledTimes(0)
      expect(FacetsList).toHaveBeenCalledTimes(0)
    })
  })

  describe('when modal is open and is loading', () => {
    test('the modal renders correctly', () => {
      setup({
        overrideProps: {
          collectionHits: null,
          viewAllFacets: {
            allIds: [],
            byId: {
              'Test Category': {}
            },
            hits: null,
            isLoaded: false,
            isLoading: true,
            selectedCategory: 'Test Category'
          }
        }
      })

      expect(EDSCModalContainer).toHaveBeenCalledTimes(1)
      expect(EDSCModalContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          bodyPadding: false,
          className: 'facets-modal',
          fixedHeight: 'lg',
          id: 'facets',
          isOpen: true,
          onClose: expect.any(Function),
          onPrimaryAction: expect.any(Function),
          onSecondaryAction: expect.any(Function),
          primaryAction: 'Apply',
          secondaryAction: 'Cancel',
          size: 'lg',
          spinner: true,
          title: 'Filter collections by Test Category'
        }),
        {}
      )

      expect(FacetsModalNav).toHaveBeenCalledTimes(1)
      expect(FacetsModalNav).toHaveBeenCalledWith(
        {
          activeLetters: undefined
        },
        {}
      )

      expect(FacetsList).toHaveBeenCalledTimes(1)
      expect(FacetsList).toHaveBeenCalledWith(
        {
          changeHandler: expect.any(Function),
          facetCategory: 'Test Category',
          facets: undefined,
          liftSelectedFacets: false,
          sortBy: 'alpha',
          variation: 'light'
        },
        {}
      )

      expect(Skeleton).toHaveBeenCalledTimes(1)
      expect(screen.queryByText('Matching Collection')).not.toBeInTheDocument()
    })
  })

  describe('when modal is open and has loaded', () => {
    test('the modal renders correctly', () => {
      setup({
        overrideProps: {
          collectionHits: 100,
          viewAllFacets: {
            allIds: ['Test Category'],
            byId: {
              'Test Category': {
                title: 'Test Category',
                children: [
                  {
                    title: '1234'
                  },
                  {
                    title: 'Another'
                  }
                ],
                startingLetters: ['#', 'A', 'B']
              }
            },
            hits: 100,
            isLoaded: true,
            isLoading: false,
            selectedCategory: 'Test Category'
          }
        }
      })

      expect(EDSCModalContainer).toHaveBeenCalledTimes(1)
      expect(EDSCModalContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          bodyPadding: false,
          className: 'facets-modal',
          fixedHeight: 'lg',
          id: 'facets',
          isOpen: true,
          onClose: expect.any(Function),
          onPrimaryAction: expect.any(Function),
          onSecondaryAction: expect.any(Function),
          primaryAction: 'Apply',
          secondaryAction: 'Cancel',
          size: 'lg',
          spinner: false,
          title: 'Filter collections by Test Category'
        }),
        {}
      )

      expect(FacetsModalNav).toHaveBeenCalledTimes(1)
      expect(FacetsModalNav).toHaveBeenCalledWith(
        {
          activeLetters: ['#', 'A', 'B']
        },
        {}
      )

      expect(FacetsList).toHaveBeenCalledTimes(1)
      expect(FacetsList).toHaveBeenCalledWith(
        {
          changeHandler: expect.any(Function),
          facetCategory: 'Test Category',
          facets: [
            {
              title: '1234'
            },
            {
              title: 'Another'
            }
          ],
          liftSelectedFacets: false,
          sortBy: 'alpha',
          variation: 'light'
        },
        {}
      )

      expect(Skeleton).toHaveBeenCalledTimes(0)
      expect(screen.getByText('100 Matching Collections')).toBeInTheDocument()
    })
  })

  describe('when the close button is clicked', () => {
    test('the callback fires correctly', () => {
      const { zustandState } = setup({
        overrideProps: {
          collectionHits: 100,
          viewAllFacets: {
            allIds: ['Test Category'],
            byId: {
              'Test Category': {
                title: 'Test Category',
                children: [
                  {
                    title: '1234'
                  },
                  {
                    title: 'Another'
                  }
                ],
                startingLetters: ['#', 'A', 'B']
              }
            },
            hits: 100,
            isLoaded: true,
            isLoading: false,
            selectedCategory: 'Test Category'
          }
        }
      })

      EDSCModalContainer.mock.calls[0][0].onClose()

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
    })
  })

  describe('when the apply button is clicked', () => {
    test('the callback fires correctly', async () => {
      setup({
        overrideProps: {
          collectionHits: 100,
          viewAllFacets: {
            allIds: ['Test Category'],
            byId: {
              'Test Category': {
                title: 'Test Category',
                children: [
                  {
                    title: '1234'
                  },
                  {
                    title: 'Another'
                  }
                ],
                startingLetters: ['#', 'A', 'B']
              }
            },
            hits: 100,
            isLoaded: true,
            isLoading: false,
            selectedCategory: 'Test Category'
          }
        }
      })

      await act(() => {
        EDSCModalContainer.mock.calls[0][0].onPrimaryAction()
      })

      const zustandState = useEdscStore.getState()
      const { applyViewAllFacets } = zustandState.facetParams

      expect(applyViewAllFacets).toHaveBeenCalledTimes(1)
      expect(applyViewAllFacets).toHaveBeenCalledWith()
    })
  })

  describe('when the change handler button is fired', () => {
    test('the callback fires correctly', () => {
      setup({
        overrideProps: {
          collectionHits: 100,
          viewAllFacets: {
            allIds: ['Test Category'],
            byId: {
              'Test Category': {
                title: 'Test Category',
                children: [
                  {
                    title: '1234'
                  },
                  {
                    title: 'Another'
                  }
                ],
                startingLetters: ['#', 'A', 'B']
              }
            },
            hits: 100,
            isLoaded: true,
            isLoading: false,
            selectedCategory: 'Test Category'
          }
        }
      })

      FacetsList.mock.calls[0][0].changeHandler({}, {
        destination: 'https://cmr.earthdata.nasa.gov:443/search/collections.json?page_num=1&include_granule_counts=true&facets_size%5Binstrument%5D=10000&has_granules_or_cwic=true&instrument_h%5B%5D=AIRS&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score&sort_key%5B%5D=-create-data-date&include_tags=edsc.*%2Copensearch.granule.osdd&page_size=20&include_has_granules=true&include_facets=v2',
        title: 'AIRS'
      })

      const zustandState = useEdscStore.getState()
      const { setViewAllFacets } = zustandState.facetParams

      expect(setViewAllFacets).toHaveBeenCalledTimes(1)
      expect(setViewAllFacets).toHaveBeenCalledWith({
        data_center_h: undefined,
        horizontal_data_resolution_range: undefined,
        instrument_h: ['AIRS'],
        latency: undefined,
        platforms_h: undefined,
        processing_level_id_h: undefined,
        project_h: undefined,
        science_keywords_h: undefined,
        two_d_coordinate_system_name: undefined
      }, 'Test Category')
    })
  })
})
