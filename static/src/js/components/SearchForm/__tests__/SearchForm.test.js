import React from 'react'
import { Provider } from 'react-redux'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Autosuggest from 'react-autosuggest'

import SearchForm from '../SearchForm'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'
import AdvancedSearchDisplayContainer from '../../../containers/AdvancedSearchDisplayContainer/AdvancedSearchDisplayContainer'
import configureStore from '../../../store/configureStore'
import * as triggerKeyboardShortcut from '../../../util/triggerKeyboardShortcut'

Enzyme.configure({ adapter: new Adapter() })

const windowEventMap = {}

beforeEach(() => {
  jest.clearAllTimers()
  jest.clearAllMocks()

  window.addEventListener = jest.fn((event, cb) => {
    windowEventMap[event] = cb
  })

  window.removeEventListener = jest.fn()
})

const store = configureStore()

// use shallowMount, unless we require instance properties like refs
function setup(overrideProps, useShallow = true) {
  const props = {
    advancedSearch: {},
    autocomplete: {
      suggestions: []
    },
    authToken: '',
    keywordSearch: 'Test value',
    showFilterStackToggle: false,
    onCancelAutocomplete: jest.fn(),
    onChangeQuery: jest.fn(),
    onChangeFocusedCollection: jest.fn(),
    onClearFilters: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn(),
    onClearAutocompleteSuggestions: jest.fn(),
    onFetchAutocomplete: jest.fn(),
    onSelectAutocompleteSuggestion: jest.fn(),
    onSuggestionsFetchRequested: jest.fn(),
    onSuggestionsClearRequested: jest.fn(),
    ...overrideProps
  }

  if (useShallow) {
    return {
      enzymeWrapper: shallow(<SearchForm {...props} />),
      props
    }
  }

  // Allow the rendered component to affect the document scope
  const container = document.createElement('div')
  document.body.appendChild(container)
  return {
    enzymeWrapper: mount(
      <Provider store={store}>
        <SearchForm {...props} />
      </Provider>,
      { attachTo: container }
    ),
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
    test('renders the advanced search button under PortalFeatureContainer', () => {
      const { enzymeWrapper } = setup()

      const button = enzymeWrapper
        .find(PortalFeatureContainer)
        .find('.search-form__button--advanced-search')
      const portalFeatureContainer = button.parents(PortalFeatureContainer)

      expect(button.exists()).toBeTruthy()
      expect(portalFeatureContainer.props().advancedSearch).toBeTruthy()
    })

    test('renders the AdvancedSearchDisplayContainer under PortalFeatureContainer', () => {
      const { enzymeWrapper } = setup()

      const advancedSearchDisplayContainer = enzymeWrapper
        .find(PortalFeatureContainer)
        .find(AdvancedSearchDisplayContainer)
      const portalFeatureContainer = advancedSearchDisplayContainer.parents(PortalFeatureContainer)

      expect(advancedSearchDisplayContainer.exists()).toBeTruthy()
      expect(portalFeatureContainer.props().advancedSearch).toBeTruthy()
    })

    test('fires the action to open the advanced search modal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.search-form__button--advanced-search').simulate('click')

      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledWith(true)
    })
  })

  describe('autocomplete', () => {
    test('cancels inflight requests if search form is submitted', () => {
      const { enzymeWrapper, props } = setup({
        keywordSearch: 'AST'
      })

      // Force the state change so that the form submit actually happens
      enzymeWrapper.setState({
        keywordSearch: 'ASTER'
      })

      enzymeWrapper.find('.search-form__form').simulate('submit', { preventDefault: jest.fn() })

      expect(props.onCancelAutocomplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('onWindowKeyup', () => {
    describe('when the / key is pressed', () => {
      test('focuses the search input', () => {
        const preventDefaultMock = jest.fn()
        const stopPropagationMock = jest.fn()

        const shortcutSpy = jest.spyOn(triggerKeyboardShortcut, 'triggerKeyboardShortcut')

        const { enzymeWrapper } = setup({}, false)

        const { inputRef } = enzymeWrapper.find(SearchForm).instance()
        const inputElement = inputRef.current.input

        // Trigger the simulated window event
        windowEventMap.keyup({
          key: '/',
          tagName: 'body',
          type: 'keyup',
          preventDefault: preventDefaultMock,
          stopPropagation: stopPropagationMock
        })

        expect(shortcutSpy).toHaveBeenCalledTimes(1)
        expect(document.activeElement).toBe(inputElement)
        expect(preventDefaultMock).toHaveBeenCalledTimes(1)
        expect(stopPropagationMock).toHaveBeenCalledTimes(1)
      })
    })

    describe('while in an input', () => {
      test('does not focus', () => {
        const preventDefaultMock = jest.fn()
        const stopPropagationMock = jest.fn()

        const shortcutSpy = jest.spyOn(triggerKeyboardShortcut, 'triggerKeyboardShortcut')

        const { enzymeWrapper } = setup({}, false)

        const { inputRef } = enzymeWrapper.find(SearchForm).instance()
        const inputElement = inputRef.current.input
        const focusSpy = jest.spyOn(inputElement, 'focus')

        windowEventMap.keyup({
          key: '/',
          tagName: 'input',
          type: 'keyup',
          preventDefault: preventDefaultMock,
          stopPropagation: stopPropagationMock
        })

        expect(shortcutSpy).toHaveBeenCalledTimes(1)
        expect(focusSpy).toHaveBeenCalledTimes(1)
        expect(preventDefaultMock).toHaveBeenCalledTimes(1)
        expect(stopPropagationMock).toHaveBeenCalledTimes(1)
      })
    })
  })
})
