import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SearchFormContainer } from '../SearchFormContainer'
import SearchForm from '../../../components/SearchForm/SearchForm'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    drawingNewLayer: false,
    boundingBoxSearch: '',
    gridName: '',
    gridCoords: '',
    keywordSearch: 'Test value',
    lineSearch: '',
    pointSearch: '',
    polygonSearch: '',
    selectingNewGrid: false,
    shapefile: {},
    temporalSearch: {},
    temporalSearchordSearch: 'Test value',
    onClearFilters: jest.fn(),
    onChangeQuery: jest.fn(),
    onChangeFocusedCollection: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn()
  }

  const enzymeWrapper = shallow(<SearchFormContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SearchFormContainer component', () => {
  test('passes its props and renders a single SearchForm component', () => {
    const { enzymeWrapper, props } = setup()

    const searchForm = enzymeWrapper.find(SearchForm)
    const searchFormProps = searchForm.props()

    expect(searchForm.length).toBe(1)
    expect(searchFormProps.keywordSearch)
      .toEqual('Test value')
    expect(searchFormProps.onClearFilters)
      .toEqual(props.onClearFilters)
    expect(searchFormProps.onChangeQuery)
      .toEqual(props.onChangeQuery)
    expect(searchFormProps.onToggleAdvancedSearchModal)
      .toEqual(props.onToggleAdvancedSearchModal)
    expect(searchFormProps.showFilterStackToggle)
      .toEqual(true)
  })
})
