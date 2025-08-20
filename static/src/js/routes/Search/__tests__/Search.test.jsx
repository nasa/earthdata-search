import React from 'react'
import { screen } from '@testing-library/react'

import { Search, mapDispatchToProps } from '../Search'

import actions from '../../../actions'
import setupTest from '../../../../../../jestConfigs/setupTest'

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

jest.mock('../../../components/GranuleResultsHighlights/GranuleResultsHighlights', () => {
  const GranuleResultsHighlights = () => <div data-testid="mock-GranuleResultsHighlights" />

  return GranuleResultsHighlights
})

jest.mock('../../../containers/GranuleFiltersContainer/GranuleFiltersContainer', () => {
  const GranuleFiltersContainer = () => <div data-testid="mock-GranuleFiltersContainer" />

  return GranuleFiltersContainer
})

jest.mock('../../../components/SearchSidebar/SearchSidebarHeader', () => {
  const SearchSidebarHeader = () => <div data-testid="mock-SearchSidebarHeader" />

  return SearchSidebarHeader
})

jest.mock('../../../containers/SearchPanelsContainer/SearchPanelsContainer', () => {
  const SearchPanelsContainer = () => <div data-testid="mock-SearchPanelsContainer" />

  return SearchPanelsContainer
})

const setup = setupTest({
  ComponentsByRoute: {
    '/search': Search
  },
  defaultPropsByRoute: {
    '/search': {
      collectionQuery: {},
      match: { path: '/search' },
      onUpdateAdvancedSearch: jest.fn()
    }
  },
  withRedux: true,
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
      changeQuery: jest.fn()
    }
  },
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

describe('mapDispatchToProps', () => {
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
