import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import AdvancedSearchModal from '../AdvancedSearchModal'
import EDSCModalContainer from '../../../containers/EDSCModalContainer/EDSCModalContainer'

import * as triggerKeyboardShortcut from '../../../util/triggerKeyboardShortcut'

Enzyme.configure({ adapter: new Adapter() })

const windowEventMap = {}

function setup(overrideProps) {
  const props = {
    advancedSearch: {},
    isOpen: false,
    fields: [],
    errors: {},
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    isValid: true,
    onChangeRegionQuery: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn(),
    resetForm: jest.fn(),
    regionSearchResults: {},
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
    touched: {},
    values: {},
    validateForm: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<AdvancedSearchModal {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()

  window.addEventListener = jest.fn((event, cb) => {
    windowEventMap[event] = cb
  })
})

describe('AdvancedSearchModal component', () => {
  describe('when isOpen is false', () => {
    test('should not render a modal', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(EDSCModalContainer).length).toEqual(1)
    })
  })

  describe('when isOpen is true', () => {
    test('should render a modal', () => {
      const { enzymeWrapper } = setup({
        isOpen: true
      })

      expect(enzymeWrapper.find(EDSCModalContainer).length).toEqual(1)
    })
  })

  describe('onModalClose', () => {
    test('should call the callback to close the modal', () => {
      const { enzymeWrapper, props } = setup({
        isOpen: true
      })

      enzymeWrapper.instance().onModalClose()

      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledWith(false)
    })
  })

  describe('onApplyClick', () => {
    test('should call the callback to close the modal', () => {
      const { enzymeWrapper, props } = setup({
        isOpen: true
      })

      enzymeWrapper.instance().onApplyClick()

      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledWith(false)
    })
  })

  describe('onCancelClick', () => {
    test('should call the callback to close the modal', () => {
      const { enzymeWrapper, props } = setup({
        isOpen: true
      })

      enzymeWrapper.instance().onCancelClick()

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
          isOpen: false
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
          isOpen: true
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
