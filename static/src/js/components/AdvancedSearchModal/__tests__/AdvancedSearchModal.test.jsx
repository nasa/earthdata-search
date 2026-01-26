import {
  act,
  screen,
  waitFor
} from '@testing-library/react'
import { ApolloError } from '@apollo/client'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import AdvancedSearchModal from '../AdvancedSearchModal'

import AdvancedSearchForm from '../AdvancedSearchForm'
import RegionSearchResults from '../RegionSearchResults'

import REGIONS from '../../../operations/queries/regions'
import { MODAL_NAMES } from '../../../constants/modalNames'

vi.mock('../AdvancedSearchForm', () => ({
  default: vi.fn(() => null)
}))

vi.mock('../RegionSearchResults', () => ({
  default: vi.fn(() => null)
}))

const setup = setupTest({
  Component: AdvancedSearchModal,
  defaultProps: {
    fields: [],
    errors: {},
    handleBlur: vi.fn(),
    handleChange: vi.fn(),
    handleSubmit: vi.fn(),
    isValid: true,
    resetForm: vi.fn(),
    setFieldValue: vi.fn(),
    setFieldTouched: vi.fn(),
    touched: {},
    values: {},
    validateForm: vi.fn()
  },
  defaultZustandState: {
    ui: {
      modals: {
        openModal: MODAL_NAMES.ADVANCED_SEARCH,
        setOpenModal: vi.fn()
      }
    }
  },
  withApolloClient: true
})

describe('AdvancedSearchModal component', () => {
  describe('when the modal is not open', () => {
    test('should not render the form', () => {
      setup({
        overrideZustandState: {
          ui: {
            modals: {
              openModal: null
            }
          }
        }
      })

      expect(AdvancedSearchForm).toHaveBeenCalledTimes(0)
    })
  })

  describe('when the modal is open', () => {
    test('should render a form', () => {
      setup()

      expect(AdvancedSearchForm).toHaveBeenCalledTimes(1)
      expect(AdvancedSearchForm).toHaveBeenCalledWith({
        errors: {},
        fields: [],
        handleBlur: expect.any(Function),
        handleChange: expect.any(Function),
        handleSearch: expect.any(Function),
        isValid: true,
        modalInnerRef: {
          current: expect.anything()
        },
        setFieldTouched: expect.any(Function),
        setFieldValue: expect.any(Function),
        setModalOverlay: expect.any(Function),
        touched: {},
        validateForm: expect.any(Function),
        values: {}
      }, {})
    })
  })

  describe('onModalClose', () => {
    test('should call the callback to close the modal', async () => {
      const { user, zustandState } = setup()

      const button = screen.getByRole('button', { name: 'Close' })
      await user.click(button)

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
    })
  })

  describe('onApplyClick', () => {
    test('should call the callback to close the modal', async () => {
      const { user, zustandState } = setup()

      const button = screen.getByRole('button', { name: 'Apply' })
      await user.click(button)

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
    })
  })

  describe('onCancelClick', () => {
    test('should call the callback to close the modal', async () => {
      const { user, zustandState } = setup()

      const button = screen.getByRole('button', { name: 'Cancel' })
      await user.click(button)

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
    })
  })

  describe('onWindowKeyup', () => {
    describe('when the "a" key is pressed', () => {
      test('opens the modal when it is closed', async () => {
        const { user, zustandState } = setup({
          overrideZustandState: {
            ui: {
              modals: {
                openModal: null
              }
            }
          }
        })

        await user.keyboard('a')

        await waitFor(() => {
          expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
        })

        expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(
          MODAL_NAMES.ADVANCED_SEARCH
        )
      })

      test('closes the modal when it is opened', async () => {
        const { user, zustandState } = setup()

        await user.keyboard('a')

        await waitFor(() => {
          expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
        })

        expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
      })
    })
  })

  describe('when submitting the search form', () => {
    test('calls regionsQuery and passes data to RegionSearchResults', async () => {
      setup({
        overrideProps: {
          isOpen: true
        },
        overrideApolloClientMocks: [{
          request: {
            query: REGIONS,
            variables: {
              endpoint: 'region',
              exact: true,
              keyword: 'California Region'
            }
          },
          result: {
            data: {
              regions: {
                count: 1,
                keyword: 'California Region',
                regions: [{
                  id: '18',
                  name: 'California Region',
                  spatial: '-121.63690052163548,43.34028642543558,-121.71937759754917,43.23098080164692',
                  type: 'huc'
                }]
              }
            }
          }
        }]
      })

      const componentProps = AdvancedSearchForm.mock.calls[0][0]
      const { handleSearch, setModalOverlay } = componentProps

      vi.clearAllMocks()

      await act(async () => {
        handleSearch({
          endpoint: 'region',
          exact: true,
          keyword: 'California Region'
        })

        setModalOverlay('regionSearchResults')
      })

      await waitFor(() => {
        expect(RegionSearchResults).toHaveBeenCalledTimes(2)
      })

      expect(RegionSearchResults).toHaveBeenNthCalledWith(1, {
        modalInnerRef: { current: expect.any(Node) },
        regionResults: {
          count: undefined,
          error: undefined,
          keyword: undefined,
          loading: true,
          regions: undefined
        },
        setFieldValue: expect.any(Function),
        setModalOverlay: expect.any(Function)
      }, {})

      expect(RegionSearchResults).toHaveBeenNthCalledWith(2, {
        modalInnerRef: { current: expect.any(Node) },
        regionResults: {
          count: 1,
          error: undefined,
          keyword: 'California Region',
          loading: false,
          regions: [{
            id: '18',
            name: 'California Region',
            spatial: '-121.63690052163548,43.34028642543558,-121.71937759754917,43.23098080164692',
            type: 'huc'
          }]
        },
        setFieldValue: expect.any(Function),
        setModalOverlay: expect.any(Function)
      }, {})
    })

    describe('when the request fails', () => {
      test('calls handleError and passes data to RegionSearchResults', async () => {
        const { zustandState } = setup({
          overrideProps: {
            isOpen: true
          },
          overrideApolloClientMocks: [{
            request: {
              query: REGIONS,
              variables: {
                endpoint: 'region',
                exact: true,
                keyword: 'California Region'
              }
            },
            error: new ApolloError({ errorMessage: 'Unknown error' })
          }],
          overrideZustandState: {
            errors: {
              handleError: vi.fn()
            }
          }
        })

        const componentProps = AdvancedSearchForm.mock.calls[0][0]
        const { handleSearch, setModalOverlay } = componentProps

        vi.clearAllMocks()

        await act(async () => {
          handleSearch({
            endpoint: 'region',
            exact: true,
            keyword: 'California Region'
          })

          setModalOverlay('regionSearchResults')
        })

        await waitFor(() => {
          expect(RegionSearchResults).toHaveBeenCalledTimes(2)
        })

        expect(RegionSearchResults).toHaveBeenNthCalledWith(1, {
          modalInnerRef: { current: expect.any(Node) },
          regionResults: {
            count: undefined,
            error: undefined,
            keyword: undefined,
            loading: true,
            regions: undefined
          },
          setFieldValue: expect.any(Function),
          setModalOverlay: expect.any(Function)
        }, {})

        expect(RegionSearchResults).toHaveBeenNthCalledWith(2, {
          modalInnerRef: { current: expect.any(Node) },
          regionResults: {
            count: undefined,
            error: 'Unknown error',
            keyword: undefined,
            loading: false,
            regions: undefined
          },
          setFieldValue: expect.any(Function),
          setModalOverlay: expect.any(Function)
        }, {})

        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
        expect(zustandState.errors.handleError).toHaveBeenCalledWith({
          action: 'getRegions',
          error: new ApolloError({ errorMessage: 'Unknown error' }),
          notificationType: 'none',
          resource: 'regions'
        })
      })
    })
  })
})
