import React from 'react'

import actions from '../../../actions'
import { mapDispatchToProps, SearchFormContainer } from '../SearchFormContainer'
import SearchForm from '../../../components/SearchForm/SearchForm'

import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/SearchForm/SearchForm', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SearchFormContainer,
  defaultProps: {
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

describe('SearchFormContainer component', () => {
  test('passes its props and renders a single SearchForm component', () => {
    const { props } = setup()

    expect(SearchForm).toHaveBeenCalledTimes(1)
    expect(SearchForm).toHaveBeenCalledWith({
      onClearFilters: expect.any(Function),
      onToggleAdvancedSearchModal: props.onToggleAdvancedSearchModal,
      selectedRegion: {}
    }, {})
  })
})
