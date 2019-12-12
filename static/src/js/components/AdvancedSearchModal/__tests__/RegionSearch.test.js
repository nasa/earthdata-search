import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Form } from 'react-bootstrap'

import Button from '../../Button/Button'
import RegionSearch from '../RegionSearch'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    field: {
      name: 'regionSearch'
    },
    errors: {},
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
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
  test('should render the region search', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.region-search').length).toEqual(1)
  })

  describe('when not searched or selected', () => {
    const { enzymeWrapper } = setup()

    test('renders the regionType select', () => {
      expect(enzymeWrapper.find(Form.Control).at(0).prop('name')).toEqual('regionSearch.regionType')
    })

    test('renders the searchValue input', () => {
      expect(enzymeWrapper.find(Form.Control).at(1).prop('name')).toEqual('regionSearch.searchValue')
    })

    test('renders the exactMatch input', () => {
      expect(enzymeWrapper.find(Form.Check).at(0).prop('name')).toEqual('regionSearch.exactMatch')
    })

    test('renders the submit', () => {
      expect(enzymeWrapper.find(Button).at(0).prop('label')).toEqual('Search')
    })

    describe('when clicking the submit button', () => {
      test('calls onSetResults', () => {
        const { enzymeWrapper } = setup()
        const setResultsMock = jest.fn()
        const searchButton = enzymeWrapper.find(Button).at(0)

        enzymeWrapper.instance().onSetResults = setResultsMock
        enzymeWrapper.instance().forceUpdate()

        searchButton.simulate('click')

        expect(setResultsMock).toHaveBeenCalledTimes(1)
        expect(setResultsMock).toHaveBeenCalledWith()
      })
    })
  })

  describe('onSetResults', () => {
    test('sets the state correctly', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().onSetResults()

      expect(enzymeWrapper.state().hasSearched).toEqual(true)
      expect(enzymeWrapper.state().hasSelected).toEqual(false)
      expect(enzymeWrapper.state().results.length).toEqual(2)
    })

    test('renders the search results', () => {
      const { enzymeWrapper } = setup()
      const renderSearchResultsMock = jest.fn()

      enzymeWrapper.instance().renderSearchResults = renderSearchResultsMock
      enzymeWrapper.instance().onSetResults()

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
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().onRemoveSelected()

      expect(enzymeWrapper.state().hasSelected).toEqual(false)
      expect(enzymeWrapper.state().hasSearched).toEqual(false)
      expect(enzymeWrapper.state().results).toEqual([])
    })

    test('resets the modal overlay', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().onRemoveSelected()

      expect(props.setModalOverlay).toHaveBeenCalledTimes(1)
      expect(props.setModalOverlay).toHaveBeenCalledWith(null)
    })
  })

  describe('onSetSelected', () => {
    test('sets the field value', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().onSetSelected({
        test: 'test'
      })

      expect(props.setFieldValue).toHaveBeenCalledTimes(1)
      expect(props.setFieldValue).toHaveBeenCalledWith(
        'regionSearch.selectedRegion',
        {
          test: 'test'
        }
      )
    })

    test('sets the state correctly', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().onSetSelected({
        test: 'test'
      })

      expect(enzymeWrapper.state().hasSelected).toEqual(true)
      expect(enzymeWrapper.state().hasSearched).toEqual(false)
      expect(enzymeWrapper.state().results).toEqual([])
    })

    test('resets the modal overlay', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().onSetSelected({
        test: 'test'
      })

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

      const { enzymeWrapper } = setup({
        setModalOverlay: setResultsMock
      })

      enzymeWrapper.instance().onSetResults()

      expect(passedComponent.props.className).toEqual('region-search__results-overlay')
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

      expect(enzymeWrapper.find('.region-search__selected-region')
        .length).toEqual(1)
      expect(enzymeWrapper.find('.region-search__selected-region-id')
        .text()).toEqual('HUC 12341231235')
      expect(enzymeWrapper.find('.region-search__selected-region-name')
        .text()).toEqual('(Upper Cayote Creek)')
    })

    describe('when clicking the remove button', () => {
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

      const onRemoveSelectedMock = jest.fn()

      enzymeWrapper.instance().onRemoveSelected = onRemoveSelectedMock

      const button = enzymeWrapper.find(Button)
      expect(button.prop('label')).toEqual('Remove')

      button.simulate('click')
      expect(onRemoveSelectedMock).toHaveBeenCalledTimes(1)
      expect(onRemoveSelectedMock).toHaveBeenCalledWith()
    })
  })
})
