import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { MemoryRouter } from 'react-router-dom'

import { createMemoryHistory } from 'history'
import {
  Search,
  mapDispatchToProps,
  mapStateToProps
} from '../Search'

import actions from '../../../actions'
import Providers from '../../../providers/Providers/Providers'
import configureStore from '../../../store/configureStore'

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

// Mock the lazy loaded components
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

const history = createMemoryHistory()
const mockStore = configureStore()

function setup() {
  const props = {
    collectionQuery: {},
    match: { path: '/search' },
    advancedSearch: {},
    onChangeQuery: jest.fn(),
    onTogglePortalBrowserModal: jest.fn(),
    onUpdateAdvancedSearch: jest.fn()
  }

  render(
    <Provider store={mockStore}>
      <Providers>
        <MemoryRouter>
          <Route history={history} location={props.location}>
            <Search {...props} />
          </Route>
        </MemoryRouter>
      </Providers>
    </Provider>
  )
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

// TODO fix these tests
describe.skip('Search component', () => {
  test('should render self', async () => {
    setup()
    const searchResultMatches = await screen.findAllByText('Search Results')
    expect(searchResultMatches[0]).toBeDefined()
  })

  test('renders AdvancedSearchModalContainer under PortalFeatureContainer', async () => {
    setup()
    await screen.findByRole('button', { name: 'Advanced Search' })
  })

  test('renders the Additional Filters under PortalFeatureContainer', async () => {
    setup()
    expect(await screen.findByText('Additional Filters')).toBeInTheDocument()
  })

  test('renders the "Include collections without granules" checkbox under PortalFeatureContainer', async () => {
    setup()
    expect(await screen.findByText('Include collections without granules')).toBeInTheDocument()
  })

  test('renders the "Include only EOSDIS collections" checkbox under PortalFeatureContainer', async () => {
    setup()
    expect(await screen.findByText('Include only EOSDIS collections')).toBeInTheDocument()
  })

  describe.skip('handleCheckboxCheck', () => {
    test('checking the "Include collections without granules" checkbox calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      const event = {
        target: {
          checked: true,
          id: 'input__only-granules'
        }
      }

      enzymeWrapper.find('#input__only-granules').props().onChange(event)

      expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeQuery).toHaveBeenCalledWith({
        collection: {
          hasGranulesOrCwic: undefined
        }
      })
    })

    test('checking the "Include only EOSDIS collections" checkbox calls onChangeQuery', () => {
      const { enzymeWrapper, props } = setup()

      const event = {
        target: {
          checked: true,
          id: 'input__non-eosdis'
        }
      }

      enzymeWrapper.find('#input__non-eosdis').props().onChange(event)

      expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
      expect(props.onChangeQuery).toHaveBeenCalledWith({
        collection: {
          onlyEosdisCollections: true
        }
      })
    })
  })
})
