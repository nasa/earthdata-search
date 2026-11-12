import React from 'react'
import { screen, within } from '@testing-library/react'

import { Search } from '../Search'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'
import { encodeUrlQuery } from '../../../util/url/url'

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
        showOnlyGranulesCheckbox: true,
        includeInactiveCollectionsCheckbox: true
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
    test('opens the advanced filter column and restores focus when closed', async () => {
      const { user } = setup()
      const expand = screen.getByRole('button', { name: /Expand Advanced Filters/ })

      expect(screen.queryByRole('form', { name: 'Advanced Filters' })).not.toBeInTheDocument()
      await user.click(expand)

      expect(expand).toHaveAttribute('aria-expanded', 'true')
      const filters = screen.getByRole('form', { name: 'Advanced Filters' })
      expect(filters).toBeVisible()
      expect(screen.getByRole('group', { name: 'DOI Value' })).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Close Advanced Filters' }))

      expect(screen.queryByRole('form', { name: 'Advanced Filters' })).not.toBeInTheDocument()
      expect(expand).toHaveFocus()
      expect(expand).toHaveAttribute('aria-expanded', 'false')
    })

    test('shows the active advanced filter count on its toggle button', () => {
      setup({
        overrideZustandState: {
          query: {
            collection: {
              doi: ['10.5067/EXAMPLE'],
              entryId: ['ATL03_004', 'ATL06_006']
            }
          }
        }
      })

      const toggle = screen.getByRole('button', { name: 'Expand Advanced Filters, 3 selected' })
      const toggleContent = within(toggle).getByTestId('advanced-filters-toggle-content')

      expect(within(toggleContent).getByText('3')).toBeVisible()
      expect(within(toggleContent).getByText('Expand Advanced Filters')).toBeVisible()
      expect(toggleContent).toHaveClass('advanced-search-filters__toggle-content')
      expect(within(toggleContent).getByText('3')).toHaveClass('facets-group__selected-count')
    })

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

    test('hides consortium controls when the portal defines a consortium', async () => {
      const { user } = setup({
        overrideZustandState: {
          portal: { query: { consortium: ['CWIC'] } },
          query: {
            collection: {
              consortium: ['CEOS']
            }
          }
        }
      })

      expect(screen.queryByRole('checkbox', { name: 'Include only EOSDIS collections' })).not.toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Expand Advanced Filters' }))
      expect(screen.queryByRole('group', { name: /Consortium/ })).not.toBeInTheDocument()
    })

    test('disables advanced consortium choices when EOSDIS-only is selected', async () => {
      const { user } = setup({
        overrideZustandState: {
          query: {
            collection: {
              consortium: ['CEOS'],
              onlyEosdisCollections: true
            }
          }
        }
      })

      expect(screen.getByRole('checkbox', { name: 'Include only EOSDIS collections' })).toBeChecked()
      await user.click(screen.getByRole('button', { name: 'Expand Advanced Filters' }))
      const consortium = within(screen.getByRole('group', { name: /Consortium/ }))
      consortium.getAllByRole('checkbox').forEach((checkbox) => {
        expect(checkbox).toBeDisabled()
        expect(checkbox).not.toBeChecked()
      })

      expect(screen.getByRole('heading', { name: 'Advanced Filters' })).toBeVisible()
    })

    test('renders the "Include inactive collections" checkbox under PortalFeatureContainer', async () => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig')
        .mockReturnValue({
          showInactiveCollections: 'true'
        })

      const { user } = setup()

      const checkbox = await screen.findByLabelText('Include inactive collections')
      expect(checkbox).toBeInTheDocument()

      const tooltip = within(screen.getByText('Include inactive collections')).getByRole('graphics-symbol')
      await user.hover(tooltip)
      expect(screen.getByText('Include collections labeled as planned, deprecated, preprint, in review, or not provided in results')).toBeInTheDocument()
    })

    test('does not render the "Include inactive collections" checkbox if showInactiveCollections is false', async () => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig')
        .mockReturnValue({
          showInactiveCollections: 'false'
        })

      setup()

      const checkbox = screen.queryByLabelText('Include inactive collections')
      expect(checkbox).not.toBeInTheDocument()
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

      test('checking EOSDIS-only clears the advanced consortium selection', async () => {
        const { user, zustandState } = setup({
          overrideZustandState: {
            query: { collection: { consortium: ['FEDEO'] } }
          }
        })

        const onlyEosdisCollectionsCheckbox = await screen.findByText('Include only EOSDIS collections')

        await user.click(onlyEosdisCollectionsCheckbox)

        expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
        expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
          collection: {
            onlyEosdisCollections: true,
            consortium: undefined
          }
        })

        const [{ collection }] = zustandState.query.changeQuery.mock.calls[0]
        const url = encodeUrlQuery({
          pathname: '/search',
          collectionsQuery: {
            ...zustandState.query.collection,
            ...collection
          }
        })
        const { searchParams } = new URL(url, 'http://localhost')
        expect(searchParams.get('oe')).toEqual('t')
        expect(searchParams.has('consortium[0]')).toBe(false)
      })

      test('unchecking EOSDIS-only only clears its flag', async () => {
        const { user, zustandState } = setup({
          overrideZustandState: {
            query: {
              collection: {
                onlyEosdisCollections: true,
                consortium: ['CEOS']
              }
            }
          }
        })

        await user.click(screen.getByRole('checkbox', { name: 'Include only EOSDIS collections' }))

        expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
        expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
          collection: {
            onlyEosdisCollections: undefined
          }
        })
      })

      test('checking the "Include inactive collections" checkbox calls changeQuery', async () => {
        vi.spyOn(getApplicationConfig, 'getApplicationConfig')
          .mockReturnValue({
            showInactiveCollections: 'true'
          })

        const { user, zustandState } = setup()

        const includeInactiveCollectionsCheckbox = await screen.findByText('Include inactive collections')

        await user.click(includeInactiveCollectionsCheckbox)

        expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
        expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
          collection: {
            includeInactiveCollections: true
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
