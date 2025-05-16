import React from 'react'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  SearchFormContainer
} from '../SearchFormContainer'
import SearchForm from '../../../components/SearchForm/SearchForm'

import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/SearchForm/SearchForm', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SearchFormContainer,
  defaultProps: {
    advancedSearch: {},
    autocomplete: {},
    drawingNewLayer: false,
    gridCoords: '',
    keywordSearch: 'Test value',
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
})

describe('mapDispatchToProps', () => {
  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onChangeFocusedCollection calls actions.changeFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedCollection')

    mapDispatchToProps(dispatch).onChangeFocusedCollection('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
  })

  test('onClearFilters calls actions.clearFilters', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'clearFilters')

    mapDispatchToProps(dispatch).onClearFilters()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onToggleAdvancedSearchModal calls actions.toggleAdvancedSearchModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAdvancedSearchModal')

    mapDispatchToProps(dispatch).onToggleAdvancedSearchModal(false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
  })

  test('onCancelAutocomplete calls actions.cancelAutocomplete', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'cancelAutocomplete')

    mapDispatchToProps(dispatch).onCancelAutocomplete()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onClearAutocompleteSuggestions calls actions.clearAutocompleteSuggestions', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'clearAutocompleteSuggestions')

    mapDispatchToProps(dispatch).onClearAutocompleteSuggestions()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onFetchAutocomplete calls actions.fetchAutocomplete', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAutocomplete')

    mapDispatchToProps(dispatch).onFetchAutocomplete({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onSelectAutocompleteSuggestion calls actions.selectAutocompleteSuggestion', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'selectAutocompleteSuggestion')

    mapDispatchToProps(dispatch).onSelectAutocompleteSuggestion({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
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
      ui: {
        map: {
          drawingNewLayer: false
        }
      }
    }

    const expectedState = {
      advancedSearch: {},
      autocomplete: {},
      keywordSearch: '',
      temporalSearch: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SearchFormContainer component', () => {
  test('passes its props and renders a single SearchForm component', () => {
    const { props } = setup()

    expect(SearchForm).toHaveBeenCalledTimes(1)
    expect(SearchForm).toHaveBeenCalledWith({
      advancedSearch: props.advancedSearch,
      autocomplete: props.autocomplete,
      keywordSearch: props.keywordSearch,
      onCancelAutocomplete: props.onCancelAutocomplete,
      onChangeQuery: props.onChangeQuery,
      onChangeFocusedCollection: props.onChangeFocusedCollection,
      onClearFilters: props.onClearFilters,
      onToggleAdvancedSearchModal: props.onToggleAdvancedSearchModal,
      onFetchAutocomplete: props.onFetchAutocomplete,
      onSelectAutocompleteSuggestion: props.onSelectAutocompleteSuggestion,
      onClearAutocompleteSuggestions: props.onClearAutocompleteSuggestions
    }, {})
  })
})
