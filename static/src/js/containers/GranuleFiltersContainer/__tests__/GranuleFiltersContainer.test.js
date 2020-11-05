import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { GranuleFiltersContainer } from '../GranuleFiltersContainer'
import GranuleFiltersActions from '../../../components/GranuleFilters/GranuleFiltersActions'
import GranuleFiltersBody from '../../../components/GranuleFilters/GranuleFiltersBody'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    cmrFacetParams: {},
    collectionMetadata: {
      title: 'Test Collection'
    },
    collectionQuery: {},
    granuleQuery: {},
    errors: {},
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    handleReset: jest.fn(),
    handleSubmit: jest.fn(),
    isValid: true,
    onApplyGranuleFilters: jest.fn(),
    setFieldTouched: jest.fn(),
    setFieldValue: jest.fn(),
    touched: {},
    values: {}
  }

  const enzymeWrapper = shallow(<GranuleFiltersContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleFiltersContainer component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBeDefined()
  })

  describe('GranuleFiltersBody', () => {
    test('renders with the correct body prop and passes the correct props', () => {
      const { enzymeWrapper, props } = setup()

      const granuleFiltersFormProps = enzymeWrapper.find(GranuleFiltersBody).props().granuleFiltersForm.props

      // expect(enzymeWrapper.find(GranuleFiltersBody).length).toEqual(1)

      expect(granuleFiltersFormProps.values).toEqual(props.values)
      expect(granuleFiltersFormProps.touched).toEqual(props.touched)
      expect(granuleFiltersFormProps.errors).toEqual(props.errors)
      expect(granuleFiltersFormProps.handleChange).toEqual(props.handleChange)
      expect(granuleFiltersFormProps.handleBlur).toEqual(props.handleBlur)
      expect(granuleFiltersFormProps.setFieldValue).toEqual(props.setFieldValue)
      expect(granuleFiltersFormProps.setFieldTouched).toEqual(props.setFieldTouched)
      expect(granuleFiltersFormProps.portal).toEqual(props.portal)
    })
  })

  describe('GranuleFiltersActions', () => {
    test('renders with the correct body prop and passes the correct props', () => {
      const { enzymeWrapper, props } = setup()

      const granuleFiltersActionsProps = enzymeWrapper.find(GranuleFiltersActions).props()

      expect(granuleFiltersActionsProps.isValid).toEqual(true)
      expect(granuleFiltersActionsProps.onApplyClick).toEqual(props.handleSubmit)
      expect(granuleFiltersActionsProps.onClearClick)
        .toEqual(enzymeWrapper.instance().onClearGranuleFilters)
    })
  })

  describe('onApplyClick', () => {
    test('calls the correct functions', () => {
      const { enzymeWrapper, props } = setup()

      const granuleFiltersActionsProps = enzymeWrapper.find(GranuleFiltersActions).props()

      granuleFiltersActionsProps.onApplyClick()
      expect(props.handleSubmit).toHaveBeenCalledTimes(1)
      expect(props.handleSubmit).toHaveBeenCalledWith()
    })
  })

  describe('onClearClick', () => {
    test('calls the correct functions', () => {
      const { enzymeWrapper, props } = setup()

      const granuleFiltersActionsProps = enzymeWrapper.find(GranuleFiltersActions).props()

      granuleFiltersActionsProps.onClearClick()
      expect(props.handleReset).toHaveBeenCalledTimes(1)
      expect(props.handleReset).toHaveBeenCalledWith()
      expect(props.onApplyGranuleFilters).toHaveBeenCalledTimes(1)
      expect(props.onApplyGranuleFilters).toHaveBeenCalledWith({})
    })
  })
})
