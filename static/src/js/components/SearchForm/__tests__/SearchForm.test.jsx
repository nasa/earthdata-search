import React from 'react'
import { Provider } from 'react-redux'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { useLocation } from 'react-router-dom'

import SearchForm from '../SearchForm'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'
import AdvancedSearchDisplayContainer from '../../../containers/AdvancedSearchDisplayContainer/AdvancedSearchDisplayContainer'
import configureStore from '../../../store/configureStore'

Enzyme.configure({ adapter: new Adapter() })

const windowEventMap = {}

jest.mock('../../SpatialDisplay/SpatialSelectionDropdown', () => {
  const mockSpatialSelectionDropdown = jest.fn(({ children }) => (
    <mock-mockSpatialSelectionDropdown data-testid="mockSpatialSelectionDropdown">
      {children}
    </mock-mockSpatialSelectionDropdown>
  ))

  return mockSpatialSelectionDropdown
})

// Mock react react-router-dom so that the tests do not think we are on the homepage
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

useLocation.mockReturnValue({
  pathname: '/search',
  search: '',
  hash: '',
  state: null,
  key: 'testKey'
})

beforeEach(() => {
  jest.clearAllTimers()
  jest.clearAllMocks()

  window.addEventListener = jest.fn((event, cb) => {
    windowEventMap[event] = cb
  })

  window.removeEventListener = jest.fn()
})

const store = configureStore()

// Use shallowMount, unless we require instance properties like refs
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

    expect(enzymeWrapper.find('.search-form').exists()).toBeTruthy()
  })

  test('should call onClearFilters when the Clear Button is clicked', () => {
    const { enzymeWrapper, props } = setup()
    const button = enzymeWrapper.find('.search-form__button--clear')

    button.simulate('click')

    expect(props.onClearFilters.mock.calls.length).toBe(1)
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
})
