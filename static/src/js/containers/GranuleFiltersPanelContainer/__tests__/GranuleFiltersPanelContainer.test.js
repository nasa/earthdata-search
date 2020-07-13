import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { GranuleFiltersPanelContainer } from '../GranuleFiltersPanelContainer'
import SecondaryOverlayPanelContainer from '../../SecondaryOverlayPanelContainer/SecondaryOverlayPanelContainer'
import GranuleFiltersHeaderContainer from '../../GranuleFiltersHeaderContainer/GranuleFiltersHeaderContainer'
import { GranuleFiltersBody } from '../../../components/GranuleFilters/GranuleFiltersBody'
import { GranuleFiltersActions } from '../../../components/GranuleFilters/GranuleFiltersActions'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: {
      byId: {
        collectionId: {
          metadata: {
            dataset_id: 'Test Collection'
          }
        }
      }
    },
    errors: {},
    focusedCollection: 'collectionId',
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

  const enzymeWrapper = shallow(<GranuleFiltersPanelContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleFiltersPanelContainer component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBeDefined()
  })

  describe('SecondaryOverlayPanelContainer', () => {
    test('renders with the correct header prop and passes the correct props', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(SecondaryOverlayPanelContainer).length).toEqual(1)
      expect(enzymeWrapper.find(SecondaryOverlayPanelContainer).prop('header').type).toEqual(GranuleFiltersHeaderContainer)
    })

    test('renders with the correct body prop and passes the correct props', () => {
      const { enzymeWrapper, props } = setup()
      const granuleFiltersFormProps = enzymeWrapper.find(SecondaryOverlayPanelContainer).prop('body').props.granuleFiltersForm.props

      expect(enzymeWrapper.find(SecondaryOverlayPanelContainer).length).toEqual(1)
      expect(enzymeWrapper.find(SecondaryOverlayPanelContainer).prop('body').type).toEqual(GranuleFiltersBody)
      expect(granuleFiltersFormProps.metadata).toEqual(props.collections.byId.collectionId.metadata)
      expect(granuleFiltersFormProps.values).toEqual(props.values)
      expect(granuleFiltersFormProps.touched).toEqual(props.touched)
      expect(granuleFiltersFormProps.errors).toEqual(props.errors)
      expect(granuleFiltersFormProps.handleChange).toEqual(props.handleChange)
      expect(granuleFiltersFormProps.handleBlur).toEqual(props.handleBlur)
      expect(granuleFiltersFormProps.setFieldValue).toEqual(props.setFieldValue)
      expect(granuleFiltersFormProps.setFieldTouched).toEqual(props.setFieldTouched)
      expect(granuleFiltersFormProps.portal).toEqual(props.portal)
    })

    test('renders with the correct footer prop and passes the correct props', () => {
      const { enzymeWrapper, props } = setup()
      const granuleFiltersActionsProps = enzymeWrapper.find(SecondaryOverlayPanelContainer).prop('footer').props

      expect(enzymeWrapper.find(SecondaryOverlayPanelContainer).length).toEqual(1)
      expect(enzymeWrapper.find(SecondaryOverlayPanelContainer).prop('footer').type).toEqual(GranuleFiltersActions)
      expect(granuleFiltersActionsProps.isValid).toEqual(true)
      expect(granuleFiltersActionsProps.onApplyClick).toEqual(props.handleSubmit)
      expect(granuleFiltersActionsProps.onClearClick)
        .toEqual(enzymeWrapper.instance().onClearGranuleFilters)
    })
  })

  describe('onApplyClick', () => {
    test('calls the correct functions', () => {
      const { enzymeWrapper, props } = setup()
      const granuleFiltersActionsProps = enzymeWrapper.find(SecondaryOverlayPanelContainer).prop('footer').props

      granuleFiltersActionsProps.onApplyClick()
      expect(props.handleSubmit).toHaveBeenCalledTimes(1)
      expect(props.handleSubmit).toHaveBeenCalledWith()
    })
  })

  describe('onClearClick', () => {
    test('calls the correct functions', () => {
      const { enzymeWrapper, props } = setup()
      const granuleFiltersActionsProps = enzymeWrapper.find(SecondaryOverlayPanelContainer).prop('footer').props

      granuleFiltersActionsProps.onClearClick()
      expect(props.handleReset).toHaveBeenCalledTimes(1)
      expect(props.handleReset).toHaveBeenCalledWith()
      expect(props.onApplyGranuleFilters).toHaveBeenCalledTimes(1)
      expect(props.onApplyGranuleFilters).toHaveBeenCalledWith('collectionId', {})
    })
  })
})
