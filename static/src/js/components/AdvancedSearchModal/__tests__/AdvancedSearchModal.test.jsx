import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdvancedSearchModal from '../AdvancedSearchModal'

import * as triggerKeyboardShortcut from '../../../util/triggerKeyboardShortcut'
import AdvancedSearchForm from '../AdvancedSearchForm'

jest.mock('../AdvancedSearchForm', () => jest.fn(() => null))

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
    regionSearchResults: {},
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
    touched: {},
    values: {},
    validateForm: jest.fn()
  }
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
        isValid: true,
        modalInnerRef: {
          current: expect.anything()
        },
        regionSearchResults: {},
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
})
