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
    authToken: '',
    onToggleAdvancedSearchModal: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
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
      authToken: '',
      ui: {
        map: {
          drawingNewLayer: false
        }
      }
    }

    const expectedState = {
      authToken: ''
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SearchFormContainer component', () => {
  test('passes its props and renders a single SearchForm component', () => {
    const { props } = setup()

    expect(SearchForm).toHaveBeenCalledTimes(1)
    expect(SearchForm).toHaveBeenCalledWith({
      authToken: props.authToken,
      onClearFilters: expect.any(Function),
      onToggleAdvancedSearchModal: props.onToggleAdvancedSearchModal,
      selectedRegion: {}
    }, {})
  })
})
