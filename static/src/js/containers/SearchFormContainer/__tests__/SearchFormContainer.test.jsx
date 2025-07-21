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
    keywordSearch: 'Test value',
    temporalSearch: {},
    onClearFilters: jest.fn(),
    onChangeQuery: jest.fn(),
    onChangeFocusedCollection: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn()
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
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      advancedSearch: {},
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
      keywordSearch: props.keywordSearch,
      onChangeQuery: props.onChangeQuery,
      onChangeFocusedCollection: props.onChangeFocusedCollection,
      onClearFilters: props.onClearFilters,
      onToggleAdvancedSearchModal: props.onToggleAdvancedSearchModal
    }, {})
  })
})
