import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, SearchFormContainer } from '../SearchFormContainer'
import SearchForm from '../../../components/SearchForm/SearchForm'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    autocomplete: {},
    drawingNewLayer: false,
    boundingBoxSearch: [],
    circleSearch: [],
    gridCoords: '',
    keywordSearch: 'Test value',
    lineSearch: [],
    pointSearch: [],
    polygonSearch: [],
    shapefile: {},
    temporalSearch: {},
    temporalSearchordSearch: 'Test value',
    onCancelAutocomplete: jest.fn(),
    onClearFilters: jest.fn(),
    onChangeQuery: jest.fn(),
    onChangeFocusedCollection: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn(),
    onFetchAutocomplete: jest.fn(),
    onSelectAutocompleteSuggestion: jest.fn(),
    onClearAutocompleteSuggestions: jest.fn()
  }

  const enzymeWrapper = shallow(<SearchFormContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onChangeFocusedCollection calls actions.changeFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedCollection')

    mapDispatchToProps(dispatch).onChangeFocusedCollection('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onClearFilters calls actions.clearFilters', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'clearFilters')

    mapDispatchToProps(dispatch).onClearFilters()

    expect(spy).toBeCalledTimes(1)
  })

  test('onToggleAdvancedSearchModal calls actions.toggleAdvancedSearchModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAdvancedSearchModal')

    mapDispatchToProps(dispatch).onToggleAdvancedSearchModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })

  test('onCancelAutocomplete calls actions.cancelAutocomplete', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'cancelAutocomplete')

    mapDispatchToProps(dispatch).onCancelAutocomplete()

    expect(spy).toBeCalledTimes(1)
  })

  test('onClearAutocompleteSuggestions calls actions.clearAutocompleteSuggestions', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'clearAutocompleteSuggestions')

    mapDispatchToProps(dispatch).onClearAutocompleteSuggestions()

    expect(spy).toBeCalledTimes(1)
  })

  test('onFetchAutocomplete calls actions.fetchAutocomplete', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAutocomplete')

    mapDispatchToProps(dispatch).onFetchAutocomplete({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onSelectAutocompleteSuggestion calls actions.selectAutocompleteSuggestion', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'selectAutocompleteSuggestion')

    mapDispatchToProps(dispatch).onSelectAutocompleteSuggestion({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      advancedSearch: {},
      autocomplete: {},
      focusedCollection: 'collectionId',
      query: {
        collection: {
          keyword: '',
          spatial: {
            boundingBox: [],
            circle: [],
            line: [],
            point: [],
            polygon: []
          },
          temporal: {}
        }
      },
      shapefile: {},
      ui: {
        map: {
          drawingNewLayer: false
        }
      }
    }

    const expectedState = {
      advancedSearch: {},
      autocomplete: {},
      boundingBoxSearch: [],
      circleSearch: [],
      drawingNewLayer: false,
      keywordSearch: '',
      lineSearch: [],
      pointSearch: [],
      polygonSearch: [],
      shapefile: {},
      temporalSearch: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SearchFormContainer component', () => {
  test('passes its props and renders a single SearchForm component', () => {
    const { enzymeWrapper, props } = setup()

    const searchForm = enzymeWrapper.find(SearchForm)
    const searchFormProps = searchForm.props()

    expect(searchForm.length).toBe(1)
    expect(searchFormProps.keywordSearch)
      .toEqual('Test value')
    expect(searchFormProps.onCancelAutocomplete)
      .toEqual(props.onCancelAutocomplete)
    expect(searchFormProps.onClearFilters)
      .toEqual(props.onClearFilters)
    expect(searchFormProps.onChangeQuery)
      .toEqual(props.onChangeQuery)
    expect(searchFormProps.onToggleAdvancedSearchModal)
      .toEqual(props.onToggleAdvancedSearchModal)
    expect(searchFormProps.showFilterStackToggle)
      .toEqual(false)
  })
})
