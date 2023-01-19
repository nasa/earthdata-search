import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Form } from 'react-bootstrap'

import Button from '../../Button/Button'
import EDSCAlert from '../../EDSCAlert/EDSCAlert'
import RegionSearchForm from '../RegionSearchForm'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    regionSearchForm: {
      errors: {},
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      touched: {},
      values: {
        endpoint: 'huc'
      },
      validateForm: jest.fn(),
      isValid: false
    },
    selectedRegion: {},
    onRemoveSelected: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<RegionSearchForm {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('RegionSearchForm component', () => {
  test('should render the region search form elements', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.prop('className')).toEqual('region-search')
  })

  describe('when not searched or selected', () => {
    const { enzymeWrapper } = setup()

    test('renders the regionType select', () => {
      expect(enzymeWrapper.find(Form.Control).at(0).prop('name')).toEqual('endpoint')
    })

    test('renders the searchValue input', () => {
      expect(enzymeWrapper.find(Form.Control).at(1).prop('name')).toEqual('keyword')
    })

    test('renders the exactMatch input', () => {
      expect(enzymeWrapper.find(Form.Check).at(0).prop('name')).toEqual('exact')
    })

    test('renders the submit', () => {
      expect(enzymeWrapper.find(Button).at(0).prop('label')).toEqual('Search')
    })

    describe('when clicking the submit button', () => {
      test('calls onSetResults', () => {
        const { enzymeWrapper, props } = setup()

        const searchButton = enzymeWrapper.find(Button).at(0)

        searchButton.simulate('click')

        expect(props.regionSearchForm.handleSubmit).toHaveBeenCalledTimes(1)
        expect(props.regionSearchForm.handleSubmit).toHaveBeenCalledWith()
      })
    })
  })

  describe('shows extra information in an alert box', () => {
    test('when the huc endpoint is selected', () => {
      const { enzymeWrapper } = setup({
        regionSearchForm: {
          errors: {},
          handleBlur: jest.fn(),
          handleChange: jest.fn(),
          handleSubmit: jest.fn(),
          touched: {},
          values: {
            endpoint: 'huc'
          },
          validateForm: jest.fn(),
          isValid: false
        },
        selectedRegion: {},
        onRemoveSelected: jest.fn()
      })

      const alertChildren = enzymeWrapper.find(EDSCAlert).children()

      expect(alertChildren.at(0).text()).toEqual('Find more information about Hydrological Units at')
      expect(alertChildren.at(2).prop('href')).toEqual('https://water.usgs.gov/GIS/huc.html')
      expect(alertChildren.at(2).text()).toEqual('https://water.usgs.gov/GIS/huc.html')
    })
  })

  describe('when keyword input is invalid', () => {
    const { enzymeWrapper } = setup({
      regionSearchForm: {
        errors: {
          keyword: 'The keyword is invalid'
        },
        handleBlur: jest.fn(),
        handleChange: jest.fn(),
        handleSubmit: jest.fn(),
        touched: {
          keyword: true
        },
        values: {
          endpoint: 'huc'
        },
        validateForm: jest.fn(),
        isValid: false
      },
      selectedRegion: {},
      onRemoveSelected: jest.fn()
    })

    expect(enzymeWrapper.find({ name: 'keyword' }).prop('isInvalid')).toEqual(true)
  })

  describe('when searched and selected', () => {
    test('renders the selected result', () => {
      const { enzymeWrapper } = setup({
        selectedRegion: {
          type: 'huc',
          id: '12341231235',
          name: 'Upper Cayote Creek',
          polygon: '30.57275390625,61.4593006372525,24.90106201171875,56.06661507755054,36.52569580078125,51.63698756452315,30.57275390625,61.4593006372525'
        }
      })

      expect(enzymeWrapper.find('.region-search__selected-region')
        .length).toEqual(1)
      expect(enzymeWrapper.find('.region-search__selected-region-id')
        .text()).toEqual('HUC 12341231235')
      expect(enzymeWrapper.find('.region-search__selected-region-name')
        .text()).toEqual('(Upper Cayote Creek)')
    })

    describe('when clicking the remove button', () => {
      const { enzymeWrapper, props } = setup({
        selectedRegion: {
          type: 'huc',
          id: '12341231235',
          name: 'Upper Cayote Creek',
          polygon: '30.57275390625,61.4593006372525,24.90106201171875,56.06661507755054,36.52569580078125,51.63698756452315,30.57275390625,61.4593006372525'
        }
      })

      const button = enzymeWrapper.find(Button)

      expect(button.prop('label')).toEqual('Remove')

      button.simulate('click')

      expect(props.onRemoveSelected).toHaveBeenCalledTimes(1)
      expect(props.onRemoveSelected).toHaveBeenCalledWith()
    })
  })
})
