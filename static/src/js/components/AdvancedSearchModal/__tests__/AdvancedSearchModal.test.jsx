import {
  act,
  screen,
  waitFor
} from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdvancedSearchModal from '../AdvancedSearchModal'

import * as triggerKeyboardShortcut from '../../../util/triggerKeyboardShortcut'
import AdvancedSearchForm from '../AdvancedSearchForm'
import RegionSearchResults from '../RegionSearchResults'

import REGIONS from '../../../operations/queries/regions'

jest.mock('../AdvancedSearchForm', () => jest.fn(() => null))
jest.mock('../RegionSearchResults', () => jest.fn(() => null))

const windowEventMap = {}

const setup = setupTest({
  Component: AdvancedSearchModal,
  defaultProps: {
    isOpen: false,
    fields: [],
    errors: {},
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    isValid: true,
    onToggleAdvancedSearchModal: jest.fn(),
    resetForm: jest.fn(),
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
    touched: {},
    values: {},
    validateForm: jest.fn()
  },
  withApolloClient: true
})

beforeEach(() => {
  window.addEventListener = jest.fn((event, cb) => {
    windowEventMap[event] = cb
  })
})

describe('AdvancedSearchModal component', () => {
  describe('when isOpen is false', () => {
    test('should not render the form', () => {
      setup()

      expect(AdvancedSearchForm).toHaveBeenCalledTimes(0)
    })
  })

  describe('when isOpen is true', () => {
    test('should render a form', () => {
      setup({
        overrideProps: {
          isOpen: true
        }
      })

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
      const { props, user } = setup({
        overrideProps: {
          isOpen: true
        }
      })

      const button = screen.getByRole('button', { name: 'Close' })
      await user.click(button)

      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledWith(false)
    })
  })

  describe('onApplyClick', () => {
    test('should call the callback to close the modal', async () => {
      const { props, user } = setup({
        overrideProps: {
          isOpen: true
        }
      })

      const button = screen.getByRole('button', { name: 'Apply' })
      await user.click(button)

      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledWith(false)
    })
  })

  describe('onCancelClick', () => {
    test('should call the callback to close the modal', async () => {
      const { props, user } = setup({
        overrideProps: {
          isOpen: true
        }
      })

      const button = screen.getByRole('button', { name: 'Cancel' })
      await user.click(button)

      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledWith(false)
    })
  })

  describe('onWindowKeyup', () => {
    describe('when the "a" key is pressed', () => {
      test('opens the modal when it is closed', () => {
        const preventDefaultMock = jest.fn()
        const stopPropagationMock = jest.fn()

        const shortcutSpy = jest.spyOn(triggerKeyboardShortcut, 'triggerKeyboardShortcut')

        const { props } = setup({
          overrideProps: {
            isOpen: false
          }
        })

        windowEventMap.keyup({
          key: 'a',
          tagName: 'body',
          type: 'keyup',
          preventDefault: preventDefaultMock,
          stopPropagation: stopPropagationMock
        })

        expect(shortcutSpy).toHaveBeenCalledTimes(1)
        expect(preventDefaultMock).toHaveBeenCalledTimes(1)
        expect(stopPropagationMock).toHaveBeenCalledTimes(1)
        expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledWith(true)
      })

      test('closes the modal when it is opened', () => {
        const preventDefaultMock = jest.fn()
        const stopPropagationMock = jest.fn()

        const { props } = setup({
          overrideProps: {
            isOpen: true
          }
        })

        windowEventMap.keyup({
          key: 'a',
          tagName: 'body',
          type: 'keyup',
          preventDefault: preventDefaultMock,
          stopPropagation: stopPropagationMock
        })

        expect(preventDefaultMock).toHaveBeenCalledTimes(1)
        expect(stopPropagationMock).toHaveBeenCalledTimes(1)
        expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledWith(false)
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

      jest.clearAllMocks()

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
            error: new Error('Unknown error')
          }],
          overrideZustandState: {
            errors: {
              handleError: jest.fn()
            }
          }
        })

        const componentProps = AdvancedSearchForm.mock.calls[0][0]
        const { handleSearch, setModalOverlay } = componentProps

        jest.clearAllMocks()

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
          error: new Error('Unknown error'),
          notificationType: 'none',
          resource: 'regions'
        })
      })
    })
  })
})
