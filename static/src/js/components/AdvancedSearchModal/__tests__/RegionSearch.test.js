import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Formik } from 'formik'

import RegionSearchForm from '../RegionSearchForm'
import RegionSearch from '../RegionSearch'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    field: {
      name: 'regionSearch',
      fields: []
    },
    errors: {},
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    onChangeRegionQuery: jest.fn(),
    regionSearchResults: {},
    setFieldValue: jest.fn(),
    setModalOverlay: jest.fn(),
    touched: {},
    values: {},
    validateForm: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<RegionSearch {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('RegionSearch component', () => {
  test('should render the region search form', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find(Formik).length).toEqual(1)
  })

  test('should render the RegionSearchForm', () => {
    const { enzymeWrapper } = setup()

    const wrapper = enzymeWrapper.renderProp('children')({
      touched: {},
      values: {}
    })

    expect(wrapper.find(RegionSearchForm).length).toEqual(1)
  })

  describe('the form', () => {
    test('onSumbit should call onSearchSubmit', () => {
      const onSubmitMock = jest.fn()

      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().onSearchSubmit = onSubmitMock
      enzymeWrapper.find(Formik).prop('onSubmit')({
        test: 'test'
      })

      expect(onSubmitMock).toHaveBeenCalledTimes(1)
      expect(onSubmitMock).toHaveBeenCalledWith({
        test: 'test'
      })
    })
  })

  describe('onSearchSubmit', () => {
    test('calls the action to update the state', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find(Formik).renderProp('children')({
        errors: {},
        values: {
          endpoint: 'huc'
        },
        touched: {
          keyword: true
        }
      })

      const values = {
        keyword: 'Test',
        endpoint: 'test-endpoint',
        exact: true
      }

      enzymeWrapper.instance().onSearchSubmit(values)

      expect(props.onChangeRegionQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeRegionQuery).toHaveBeenCalledWith({
        keyword: 'Test',
        endpoint: 'test-endpoint',
        exact: true
      }, undefined)
    })

    test('renders the search results', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.find(Formik).renderProp('children')({
        errors: {},
        values: {
          endpoint: 'huc'
        },
        touched: {
          keyword: true
        }
      })

      const renderSearchResultsMock = jest.fn()

      enzymeWrapper.instance().renderSearchResults = renderSearchResultsMock

      const values = {
        keyword: 'Test',
        endpoint: 'test-endpoint',
        exact: true
      }

      enzymeWrapper.instance().onSearchSubmit(values)

      expect(renderSearchResultsMock).toHaveBeenCalledTimes(1)
      expect(renderSearchResultsMock).toHaveBeenCalledWith()
    })
  })

  describe('when searched but not selected', () => {
    test('sets the modal overlay', () => {
      const setResultsMock = jest.fn()

      const { enzymeWrapper, props } = setup({
        setModalOverlay: setResultsMock
      })

      enzymeWrapper.find(Formik).renderProp('children')({
        errors: {},
        values: {
          endpoint: 'huc'
        },
        touched: {
          keyword: true
        }
      })

      const values = {
        keyword: 'Test',
        endpoint: 'test-endpoint',
        exact: true
      }

      enzymeWrapper.instance().onSearchSubmit(values)

      expect(props.setModalOverlay).toHaveBeenCalledTimes(1)
      expect(props.setModalOverlay).toHaveBeenCalledWith('regionSearchResults')
    })
  })

  describe('onRemoveSelected', () => {
    test('sets the field value', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().onRemoveSelected()

      expect(props.setFieldValue).toHaveBeenCalledTimes(1)
      expect(props.setFieldValue).toHaveBeenCalledWith('regionSearch.selectedRegion')
    })

    test('sets the state correctly', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().onRemoveSelected()

      expect(props.setFieldValue).toHaveBeenCalledTimes(1)
      expect(props.setFieldValue).toHaveBeenCalledWith('regionSearch.selectedRegion')
      expect(props.setModalOverlay).toHaveBeenCalledTimes(1)
      expect(props.setModalOverlay).toHaveBeenCalledWith(null)
    })

    test('resets the modal overlay', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().onRemoveSelected()

      expect(props.setModalOverlay).toHaveBeenCalledTimes(1)
      expect(props.setModalOverlay).toHaveBeenCalledWith(null)
    })
  })
})
