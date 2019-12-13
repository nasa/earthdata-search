import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Formik } from 'formik'
import { Form } from 'react-bootstrap'

import Button from '../../Button/Button'
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

  describe('when not searched or selected', () => {
    const { enzymeWrapper } = setup()

    const formikWrapper = enzymeWrapper.find(Formik).renderProp('children')({
      errors: {},
      values: {}
    })

    test('renders the regionType select', () => {
      expect(formikWrapper.find(Form.Control).at(0).prop('name')).toEqual('endpoint')
    })

    test('renders the searchValue input', () => {
      expect(formikWrapper.find(Form.Control).at(1).prop('name')).toEqual('keyword')
    })

    test('renders the exactMatch input', () => {
      expect(formikWrapper.find(Form.Check).at(0).prop('name')).toEqual('exact')
    })

    test('renders the submit', () => {
      expect(formikWrapper.find(Button).at(0).prop('label')).toEqual('Search')
    })

    describe('when clicking the submit button', () => {
      test('calls onSetResults', () => {
        const { enzymeWrapper } = setup()
        const handleSubmitMock = jest.fn()
        const formikWrapper = enzymeWrapper.find(Formik).renderProp('children')({
          errors: {},
          values: {},
          handleSubmit: handleSubmitMock
        })

        const searchButton = formikWrapper.find(Button).at(0)

        searchButton.simulate('click')

        expect(handleSubmitMock).toHaveBeenCalledTimes(1)
        expect(handleSubmitMock).toHaveBeenCalledWith()
      })
    })
  })

  describe('onSearchSubmit', () => {
    test('calls the action to update the state', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find(Formik).renderProp('children')({
        errors: {},
        values: {}
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
        values: {}
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

  describe('when searched but not selected', () => {
    test('sets the modal overlay', () => {
      let passedComponent
      const setResultsMock = jest.fn((component) => {
        passedComponent = component
      })

      const { enzymeWrapper, props } = setup({
        setModalOverlay: setResultsMock
      })

      enzymeWrapper.find(Formik).renderProp('children')({
        errors: {},
        values: {}
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

  describe('when searched and selected', () => {
    test('renders the selected result', () => {
      const { enzymeWrapper } = setup({
        values: {
          regionSearch: {
            selectedRegion: {
              type: 'huc',
              id: '12341231235',
              name: 'Upper Cayote Creek',
              polygon: '30.57275390625,61.4593006372525,24.90106201171875,56.06661507755054,36.52569580078125,51.63698756452315,30.57275390625,61.4593006372525'
            }
          }
        }
      })

      const wrapper = enzymeWrapper.find(Formik).renderProp('children')({
        errors: {},
        values: {}
      })

      expect(wrapper.find('.region-search__selected-region')
        .length).toEqual(1)
      expect(wrapper.find('.region-search__selected-region-id')
        .text()).toEqual('HUC 12341231235')
      expect(wrapper.find('.region-search__selected-region-name')
        .text()).toEqual('(Upper Cayote Creek)')
    })

    describe('when clicking the remove button', () => {
      const { enzymeWrapper, props } = setup({
        values: {
          regionSearch: {
            selectedRegion: {
              type: 'huc',
              id: '12341231235',
              name: 'Upper Cayote Creek',
              polygon: '30.57275390625,61.4593006372525,24.90106201171875,56.06661507755054,36.52569580078125,51.63698756452315,30.57275390625,61.4593006372525'
            }
          }
        }
      })

      const wrapper = enzymeWrapper.find(Formik).renderProp('children')({
        errors: {},
        values: {}
      })

      const button = wrapper.find(Button)

      expect(button.prop('label')).toEqual('Remove')

      button.simulate('click')

      expect(props.setFieldValue).toHaveBeenCalledTimes(1)
      expect(props.setFieldValue).toHaveBeenCalledWith('regionSearch.selectedRegion')
      expect(props.setModalOverlay).toHaveBeenCalledTimes(1)
      expect(props.setModalOverlay).toHaveBeenCalledWith(null)
    })
  })
})
