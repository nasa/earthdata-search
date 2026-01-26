import React from 'react'
import { screen } from '@testing-library/react'

import { Search } from '../Search'

import setupTest from '../../../../../../vitestConfigs/setupTest'

const mockClassListAdd = vi.fn()
const mockClassListRemove = vi.fn()

vi.spyOn(document, 'querySelector').mockImplementation(() => ({
  getBoundingClientRect: vi.fn(() => ({
    height: 100,
    width: 100
  })),
  classList: {
    add: mockClassListAdd,
    remove: mockClassListRemove
  }
}))

// Mock router components
vi.mock('../../../components/CollectionDetails/RelatedUrlsModal', () => {
  const RelatedUrlsModal = () => <div data-testid="mocked-RelatedUrlsModal" />

  return { default: RelatedUrlsModal }
})

vi.mock('../../../components/Facets/FacetsModal', () => {
  const FacetsModal = () => <div data-testid="mocked-FacetsModal" />

  return { default: FacetsModal }
})

vi.mock('../../../components/Facets/Facets', () => {
  const Facets = () => <div data-testid="mocked-Facets" />

  return { default: Facets }
})

vi.mock('../../../containers/MapContainer/MapContainer', () => {
  const MapContainer = () => <div data-testid="mock-MapContainer" />

  return { default: MapContainer }
})

vi.mock('../../../components/CollectionDetailsHighlights/CollectionDetailsHighlights', () => {
  const CollectionDetailsHighlights = () => <div data-testid="mock-CollectionDetailsHighlights" />

  return { default: CollectionDetailsHighlights }
})

vi.mock('../../../components/GranuleResultsHighlights/GranuleResultsHighlights', () => {
  const GranuleResultsHighlights = () => <div data-testid="mock-GranuleResultsHighlights" />

  return { default: GranuleResultsHighlights }
})

vi.mock('../../../containers/GranuleFiltersContainer/GranuleFiltersContainer', () => {
  const GranuleFiltersContainer = () => <div data-testid="mock-GranuleFiltersContainer" />

  return { default: GranuleFiltersContainer }
})

vi.mock('../../../components/SearchSidebar/SearchSidebarHeader', () => {
  const SearchSidebarHeader = () => <div data-testid="mock-SearchSidebarHeader" />

  return { default: SearchSidebarHeader }
})

vi.mock('../../../containers/SearchPanelsContainer/SearchPanelsContainer', () => {
  const SearchPanelsContainer = () => <div data-testid="mock-SearchPanelsContainer" />

  return { default: SearchPanelsContainer }
})

const setup = setupTest({
  ComponentsByRoute: {
    '/search': Search
  },
  defaultPropsByRoute: {
    '/search': {
      match: { path: '/search' }
    }
  },
  defaultZustandState: {
    portal: {
      features: {
        advancedSearch: true,
        authentication: false
      },
      ui: {
        showNonEosdisCheckbox: true,
        showOnlyGranulesCheckbox: true
      }
    },
    query: {
      changeQuery: vi.fn()
    }
  },
  withApolloClient: true,
  withRouter: true,
  defaultRouterEntries: ['/search']
})

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

describe('Search component', () => {
  describe('when on the /search route', () => {
    test('should render search panels', async () => {
      setup()

      const searchResultsPanel = await screen.findByTestId('mock-SearchPanelsContainer')
      expect(searchResultsPanel).toBeInTheDocument()
    })

    test('renders SearchSidebarHeader', async () => {
      setup()

      expect(await screen.findByTestId('mock-SearchSidebarHeader')).toBeInTheDocument()
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
      test('checking the "Include collections without granules" checkbox calls changeQuery', async () => {
        const { user, zustandState } = setup()

        const includeWithoutGranulesCheckbox = await screen.findByText('Include collections without granules')

        await user.click(includeWithoutGranulesCheckbox)

        expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
        expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
          collection: {
            hasGranulesOrCwic: undefined
          }
        })
      })

      test('checking the "Include only EOSDIS collections" checkbox calls changeQuery', async () => {
        const { user, zustandState } = setup()

        const includeWithoutGranulesCheckbox = await screen.findByText('Include only EOSDIS collections')

        await user.click(includeWithoutGranulesCheckbox)

        expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
        expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
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
