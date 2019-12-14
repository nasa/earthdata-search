import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import EDSCModal from '../../EDSCModal/EDSCModal'
import AdvancedSearchModal from '../AdvancedSearchModal'

Enzyme.configure({ adapter: new Adapter() })

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
})

describe('AdvancedSearchModal component', () => {
  describe('when isOpen is false', () => {
    test('should not render a modal', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(EDSCModal).length).toEqual(1)
    })
  })

  describe('when isOpen is true', () => {
    test('should render a modal', () => {
      const { enzymeWrapper } = setup({
        isOpen: true
      })

      expect(enzymeWrapper.find(EDSCModal).length).toEqual(1)
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
})
