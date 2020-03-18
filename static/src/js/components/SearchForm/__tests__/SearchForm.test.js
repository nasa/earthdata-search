import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Autosuggest from 'react-autosuggest'

import SearchForm from '../SearchForm'
import TextField from '../../FormFields/TextField/TextField'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    advancedSearch: {},
    autocomplete: {
      suggestions: []
    },
    authToken: '',
    keywordSearch: 'Test value',
    showFilterStackToggle: false,
    onChangeQuery: jest.fn(),
    onChangeFocusedCollection: jest.fn(),
    onClearFilters: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn(),
    onClearAutocompleteSuggestions: jest.fn(),
    onFetchAutocomplete: jest.fn(),
    onSelectAutocompleteSuggestion: jest.fn(),
    onSuggestionsFetchRequested: jest.fn(),
    onSuggestionsClearRequested: jest.fn()
  }

  const enzymeWrapper = shallow(<SearchForm {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SearchForm component', () => {
  test('should render self and form fields', () => {
    const { enzymeWrapper } = setup()
    const keywordSearch = enzymeWrapper.find(Autosuggest)

    expect(keywordSearch.prop('inputProps')).toEqual(expect.objectContaining({
      name: 'keywordSearch',
      value: 'Test value'
    }))
  })

  test('onAutoSuggestChange updates the state', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.state().keywordSearch).toEqual('Test value')

    enzymeWrapper.instance().onAutoSuggestChange({}, { newValue: 'new value' })
    expect(enzymeWrapper.state().keywordSearch).toEqual('new value')
  })

  test('onKeywordBlur calls onChangeQuery', () => {
    const { enzymeWrapper, props } = setup()
    // const input = enzymeWrapper.find(Autosuggest)

    // input.simulate('change', 'keywordSearch', 'new value')
    // input.simulate('blur')
    enzymeWrapper.setState({ keywordSearch: 'new value' })
    enzymeWrapper.instance().onKeywordBlur()

    expect(props.onChangeQuery.mock.calls.length).toBe(1)
    expect(props.onChangeQuery.mock.calls[0]).toEqual([{
      collection: {
        keyword: 'new value'
      }
    }])
    expect(props.onChangeFocusedCollection.mock.calls.length).toBe(1)
    expect(props.onChangeFocusedCollection.mock.calls[0]).toEqual([''])
  })

  test('should call onClearFilters when the Clear Button is clicked', () => {
    const { enzymeWrapper, props } = setup()
    const button = enzymeWrapper.find('.search-form__button--clear')

    button.simulate('click')

    expect(props.onClearFilters.mock.calls.length).toBe(1)
  })

  test('componentWillReceiveProps sets the state', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.state().keywordSearch).toEqual('Test value')
    const newSearch = 'new seach'
    enzymeWrapper.setProps({ keywordSearch: newSearch })
    expect(enzymeWrapper.state().keywordSearch).toEqual(newSearch)
  })

  describe('advanced search button', () => {
    test('fires the action to open the advanced search modal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.search-form__button--advanced-search').simulate('click')

      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledWith(true)
    })
  })
})
