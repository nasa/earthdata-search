import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { MemoryRouter } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { createMemoryHistory } from 'history'
import userEvent from '@testing-library/user-event'
import {
  Search,
  mapDispatchToProps,
  mapStateToProps
} from '../Search'

import actions from '../../../actions'

const mockClassListAdd = jest.fn()
const mockClassListRemove = jest.fn()

jest.spyOn(document, 'querySelector').mockImplementation(() => ({
  getBoundingClientRect: jest.fn(() => ({
    height: 100,
    width: 100
  })),
  classList: {
    add: mockClassListAdd,
    remove: mockClassListRemove
  }
}))

// Needed to get the test to render
beforeEach(() => {
  // Create a div with id 'root' for portals
  const rootDiv = document.createElement('div')
  rootDiv.id = 'root'
  document.body.appendChild(rootDiv)
})

afterEach(() => {
  // Clean up the DOM
  // eslint-disable-next-line testing-library/no-node-access
  const rootDiv = document.getElementById('root')
  if (rootDiv) {
    document.body.removeChild(rootDiv)
  }
})

// Mock router components
jest.mock('../../../containers/RelatedUrlsModalContainer/RelatedUrlsModalContainer', () => {
  const RelatedUrlsModalContainer = () => <div data-testid="mocked-RelatedUrlsModalContainer" />

  return RelatedUrlsModalContainer
})

jest.mock('../../../containers/FacetsModalContainer/FacetsModalContainer', () => {
  const FacetsModalContainer = () => <div data-testid="mocked-FacetsModalContainer" />

  return FacetsModalContainer
})

jest.mock('../../../containers/FacetsContainer/FacetsContainer', () => {
  const FacetsContainer = () => <div data-testid="mocked-FacetsContainer" />

  return FacetsContainer
})

jest.mock('../../../containers/MapContainer/MapContainer', () => {
  const MapContainer = () => <div data-testid="mock-MapContainer" />

  return MapContainer
})

jest.mock('../../../containers/CollectionDetailsHighlightsContainer/CollectionDetailsHighlightsContainer', () => {
  const CollectionDetailsHighlightsContainer = () => <div data-testid="mock-CollectionDetailsHighlightsContainer" />

  return CollectionDetailsHighlightsContainer
})

jest.mock('../../../containers/GranuleResultsHighlightsContainer/GranuleResultsHighlightsContainer', () => {
  const GranuleResultsHighlightsContainer = () => <div data-testid="mock-GranuleResultsHighlightsContainer" />

  return GranuleResultsHighlightsContainer
})

jest.mock('../../../containers/GranuleFiltersContainer/GranuleFiltersContainer', () => {
  const GranuleFiltersContainer = () => <div data-testid="mock-GranuleFiltersContainer" />

  return GranuleFiltersContainer
})

jest.mock('../../../containers/SearchSidebarHeaderContainer/SearchSidebarHeaderContainer', () => {
  const SearchSidebarHeaderContainer = () => <div data-testid="mock-SearchSidebarHeaderContainer" />

  return SearchSidebarHeaderContainer
})

jest.mock('../../../containers/SearchPanelsContainer/SearchPanelsContainer', () => {
  const SearchPanelsContainer = () => <div data-testid="mock-SearchPanelsContainer" />

  return SearchPanelsContainer
})

const history = createMemoryHistory()
const mockStore = configureMockStore([thunk])

function setup() {
  const user = userEvent.setup()

  const props = {
    collectionQuery: {},
    match: { path: '/search' },
    advancedSearch: {},
    onChangeQuery: jest.fn(),
    onTogglePortalBrowserModal: jest.fn(),
    onUpdateAdvancedSearch: jest.fn()
  }

  const store = mockStore({
    portal: {
      ui: {
        showNonEosdisCheckbox: true,
        showOnlyGranulesCheckbox: true
      }
    },
    ui: {
      portalBrowserModal: {
        isOpen: false
      }
    }
  })

  const { unmount } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/search']}>
        <Route history={history} path="/search">
          <Search {...props} />
        </Route>
      </MemoryRouter>
    </Provider>
  )

  return {
    props,
    unmount,
    user
  }
}

describe('mapDispatchToProps', () => {
  test('onChangeQuery calls actions.changeQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeQuery')

    mapDispatchToProps(dispatch).onChangeQuery({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onTogglePortalBrowserModal calls actions.togglePortalBrowserModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'togglePortalBrowserModal')

    mapDispatchToProps(dispatch).onTogglePortalBrowserModal({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onUpdateAdvancedSearch calls actions.updateAdvancedSearch', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdvancedSearch')

    mapDispatchToProps(dispatch).onUpdateAdvancedSearch({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      query: {
        collection: {}
      }
    }

    const expectedState = {
      collectionQuery: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('Search component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when on the /search route', () => {
    test('should render search panels', async () => {
      setup()

      const searchResultsPanel = await screen.findByTestId('mock-SearchPanelsContainer')
      expect(searchResultsPanel).toBeInTheDocument()
    })

    test('renders SearchSidebarHeaderContainer', async () => {
      setup()

      expect(await screen.findByTestId('mock-SearchSidebarHeaderContainer')).toBeInTheDocument()
    })

    test('renders the "Include collections without granules" checkbox under PortalFeatureContainer', async () => {
      setup()

      expect(await screen.findByText('Include collections without granules')).toBeInTheDocument()
    })

    test('renders the "Include only EOSDIS collections" checkbox under PortalFeatureContainer', async () => {
      setup()
      expect(await screen.findByText('Include only EOSDIS collections')).toBeInTheDocument()
    })

    describe('handleCheckboxCheck', () => {
      test('checking the "Include collections without granules" checkbox calls onChangeQuery', async () => {
        const { user, props } = setup()

        const includeWithoutGranulesCheckbox = await screen.findByText('Include collections without granules')

        await user.click(includeWithoutGranulesCheckbox)

        expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
        expect(props.onChangeQuery).toHaveBeenCalledWith({
          collection: {
            hasGranulesOrCwic: true
          }
        })
      })

      test('checking the "Include only EOSDIS collections" checkbox calls onChangeQuery', async () => {
        const { user, props } = setup()

        const includeWithoutGranulesCheckbox = await screen.findByText('Include only EOSDIS collections')

        await user.click(includeWithoutGranulesCheckbox)

        expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
        expect(props.onChangeQuery).toHaveBeenCalledWith({
          collection: {
            onlyEosdisCollections: true
          }
        })
      })
    })
  })

  describe('when mounting the component', () => {
    test('adds the root__app--fixed-footer class to the root', () => {
      setup()

      expect(mockClassListAdd).toHaveBeenCalledTimes(1)
      expect(mockClassListAdd).toHaveBeenCalledWith('root__app--fixed-footer')

      expect(mockClassListRemove).toHaveBeenCalledTimes(0)
    })
  })

  describe('when unmounting the component', () => {
    test('removes the root__app--fixed-footer class to the root', () => {
      const { unmount } = setup()

      expect(mockClassListAdd).toHaveBeenCalledTimes(1)
      expect(mockClassListAdd).toHaveBeenCalledWith('root__app--fixed-footer')

      unmount()

      expect(mockClassListRemove).toHaveBeenCalledTimes(1)
      expect(mockClassListRemove).toHaveBeenCalledWith('root__app--fixed-footer')
    })
  })
})
