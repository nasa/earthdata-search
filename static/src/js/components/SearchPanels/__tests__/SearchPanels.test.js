import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'
import {
  FaBell,
  FaInfoCircle,
  FaList,
  FaMap,
  FaTable
} from 'react-icons/fa'

import configureStore from '../../../store/configureStore'
import * as PortalUtils from '../../../util/portals'

import SearchPanels from '../SearchPanels'
import Panels from '../../Panels/Panels'
import PanelGroup from '../../Panels/PanelGroup'
import PanelGroupHeader from '../../Panels/PanelGroupHeader'
import GranuleResultsActionsContainer from '../../../containers/GranuleResultsActionsContainer/GranuleResultsActionsContainer'

const store = configureStore()

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(PortalUtils, 'isDefaultPortal').mockImplementation(() => true)
})

delete window.location
window.location = { assign: jest.fn() }

// Mock ReactDOM.createPortal to prevent any errors in the MoreActionsDropdown compontent
jest.mock('react-dom', () => (
  {
    ...(jest.requireActual('react-dom')),
    createPortal: jest.fn(() => (<div />))
  }
))

function setup(overrideProps, location = '/search') {
  const props = {
    authToken: '',
    collectionMetadata: {
      hasAllMetadata: true,
      title: 'Collection Title',
      isCSDA: false,
      isOpenSearch: false
    },
    collectionQuery: {
      pageNum: 1,
      sortKey: ['']
    },
    collectionsSearch: {
      allIds: ['COLL_ID_1'],
      hits: 1,
      isLoading: false,
      isLoaded: true
    },
    granuleMetadata: {
      title: 'Granule Title'
    },
    granuleSearchResults: {
      allIds: [],
      hits: 0,
      isLoading: true,
      isLoaded: false
    },
    granuleQuery: {
      pageNum: 1,
      sortKey: '-start_date'
    },
    handoffs: {},
    isExportRunning: {
      csv: false,
      json: false
    },
    location: {
      pathname: '/search',
      search: ''
    },
    match: {
      url: '/search'
    },
    mapProjection: 'epsg4326',
    onApplyGranuleFilters: jest.fn(),
    onChangeQuery: jest.fn(),
    onFocusedCollectionChange: jest.fn(),
    onMetricsCollectionSortChange: jest.fn(),
    onToggleAboutCSDAModal: jest.fn(),
    onToggleAboutCwicModal: jest.fn(),
    onTogglePanels: jest.fn(),
    onSetActivePanel: jest.fn(),
    onExport: jest.fn(),
    panels: {
      activePanel: '0.0.0',
      isOpen: true
    },
    preferences: {
      panelState: 'default',
      collectionListView: 'default',
      granuleListView: 'default'
    },
    portal: {
      portalId: 'edsc'
    },
    subscriptions: [],
    ...overrideProps
  }

  const enzymeWrapper = mount(
    <Provider store={store}>
      <StaticRouter location={location}>
        <SearchPanels {...props} />
      </StaticRouter>
    </Provider>
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('SearchPanels component', () => {
  describe('while on the /search route', () => {
    test('sets the correct view state', () => {
      const { enzymeWrapper } = setup()
      const panels = enzymeWrapper.find(Panels)
      const collectionResultsPanel = panels.find(PanelGroup).at(0)
      const collectionResultsPanelProps = collectionResultsPanel.props()

      expect(collectionResultsPanelProps.activeView).toBe('list')
      expect(collectionResultsPanelProps.viewsArray[0].label).toBe('List')
      expect(collectionResultsPanelProps.viewsArray[0].icon).toBe(FaList)
      expect(collectionResultsPanelProps.viewsArray[0].isActive).toBe(true)
      expect(collectionResultsPanelProps.viewsArray[1].label).toBe('Table')
      expect(collectionResultsPanelProps.viewsArray[1].icon).toBe(FaTable)
      expect(collectionResultsPanelProps.viewsArray[1].isActive).toBe(false)

      expect(collectionResultsPanelProps.activeSort).toBe('')
      expect(collectionResultsPanelProps.sortsArray[0].label).toBe('Relevance')
      expect(collectionResultsPanelProps.sortsArray[0].isActive).toBe(true)
      expect(collectionResultsPanelProps.sortsArray[1].label).toBe('Usage')
      expect(collectionResultsPanelProps.sortsArray[1].isActive).toBe(false)
      expect(collectionResultsPanelProps.sortsArray[2].label).toBe('End Date')
      expect(collectionResultsPanelProps.sortsArray[2].isActive).toBe(false)
    })

    describe('when in the default portal', () => {
      test('does not show the link to the deault portal', () => {
        const { enzymeWrapper } = setup()
        const panels = enzymeWrapper.find(Panels)
        const collectionResultsPanel = panels.find(PanelGroup).at(0)
        const collectionResultsPanelProps = collectionResultsPanel.props()

        expect(collectionResultsPanelProps.footer).toBe(null)
      })
    })

    describe('when not the default portal', () => {
      test('does not show the link to the deault portal', () => {
        jest.spyOn(PortalUtils, 'isDefaultPortal').mockImplementation(() => false)

        const { enzymeWrapper } = setup()
        const panels = enzymeWrapper.find(Panels)
        const collectionResultsPanel = panels.find(PanelGroup).at(0)
        const collectionResultsPanelProps = collectionResultsPanel.props()

        expect(shallow(collectionResultsPanelProps.footer).text()).toContain('Looking for more collections?')
      })
    })

    describe('when the collections are loading', () => {
      test('shows the loading state', () => {
        const { enzymeWrapper } = setup({
          collectionsSearch: {
            allIds: [],
            hits: 0,
            isLoading: true,
            isLoaded: false
          }
        })

        const panels = enzymeWrapper.find(Panels)
        expect(panels.props().show).toBeTruthy()
        expect(panels.props().activePanel).toEqual('0.0.0')
        expect(panels.props().draggable).toBeTruthy()
        expect(panels.props().panelState).toEqual('default')

        const collectionResultsPanel = panels.find(PanelGroup).at(0)
        const collectionResultsPanelProps = collectionResultsPanel.props()

        expect(collectionResultsPanelProps.isActive).toBe(true)
        expect(collectionResultsPanelProps.isOpen).toBe(true)
        expect(collectionResultsPanelProps.activePanelId).toBe('0')
        expect(collectionResultsPanelProps.breadcrumbs).toStrictEqual([])
        expect(collectionResultsPanelProps.handoffLinks).toStrictEqual([])
        expect(collectionResultsPanelProps.headerMessage).toBe(null)
        expect(collectionResultsPanelProps.headingLink).toBe(null)
        expect(collectionResultsPanelProps.moreActionsDropdownItems).toStrictEqual([])
        expect(collectionResultsPanelProps.footer).toBe(null)
        expect(collectionResultsPanelProps.primaryHeading).toBe('0 Matching Collections')
        expect(collectionResultsPanelProps.headerMetaPrimaryLoading).toBe(true)
        expect(collectionResultsPanelProps.headerMetaPrimaryText).toBe('Showing 0 of 0 matching collections')
        expect(collectionResultsPanelProps.headerLoading).toBe(true)
      })
    })

    describe('when there is only one collection loaded', () => {
      test('renders the PanelGroup with the correct props', () => {
        const { enzymeWrapper } = setup()

        const panels = enzymeWrapper.find(Panels)
        expect(panels.props().show).toBeTruthy()
        expect(panels.props().activePanel).toEqual('0.0.0')
        expect(panels.props().draggable).toBeTruthy()
        expect(panels.props().panelState).toEqual('default')

        const collectionResultsPanel = panels.find(PanelGroup).at(0)
        const collectionResultsPanelProps = collectionResultsPanel.props()

        expect(collectionResultsPanelProps.isActive).toBe(true)
        expect(collectionResultsPanelProps.isOpen).toBe(true)
        expect(collectionResultsPanelProps.activePanelId).toBe('0')
        expect(collectionResultsPanelProps.breadcrumbs).toStrictEqual([])
        expect(collectionResultsPanelProps.handoffLinks).toStrictEqual([])
        expect(collectionResultsPanelProps.headerMessage).toBe(null)
        expect(collectionResultsPanelProps.headingLink).toBe(null)
        expect(collectionResultsPanelProps.moreActionsDropdownItems).toStrictEqual([])
        expect(collectionResultsPanelProps.footer).toBe(null)
        expect(collectionResultsPanelProps.primaryHeading).toBe('1 Matching Collection')
        expect(collectionResultsPanelProps.headerMetaPrimaryLoading).toBe(false)
        expect(collectionResultsPanelProps.headerMetaPrimaryText).toBe('Showing 1 of 1 matching collection')
        expect(collectionResultsPanelProps.headerLoading).toBe(false)
      })
    })

    describe('when there is more than one collection', () => {
      test('renders the PanelGroup with the correct props', () => {
        const { enzymeWrapper } = setup({
          collectionsSearch: {
            allIds: ['COLL_ID_1', 'COLL_ID_2'],
            hits: 4,
            isLoading: false,
            isLoaded: true
          }
        })

        const panels = enzymeWrapper.find(Panels)
        expect(panels.props().show).toBeTruthy()
        expect(panels.props().activePanel).toEqual('0.0.0')
        expect(panels.props().draggable).toBeTruthy()
        expect(panels.props().panelState).toEqual('default')

        const collectionResultsPanel = panels.find(PanelGroup).at(0)
        const collectionResultsPanelProps = collectionResultsPanel.props()

        expect(collectionResultsPanelProps.isActive).toBe(true)
        expect(collectionResultsPanelProps.isOpen).toBe(true)
        expect(collectionResultsPanelProps.activePanelId).toBe('0')
        expect(collectionResultsPanelProps.breadcrumbs).toStrictEqual([])
        expect(collectionResultsPanelProps.handoffLinks).toStrictEqual([])
        expect(collectionResultsPanelProps.headerMessage).toBe(null)
        expect(collectionResultsPanelProps.headingLink).toBe(null)
        expect(collectionResultsPanelProps.moreActionsDropdownItems).toStrictEqual([])
        expect(collectionResultsPanelProps.footer).toBe(null)
        expect(collectionResultsPanelProps.primaryHeading).toBe('4 Matching Collections')
        expect(collectionResultsPanelProps.headerMetaPrimaryLoading).toBe(false)
        expect(collectionResultsPanelProps.headerMetaPrimaryText).toBe('Showing 2 of 4 matching collections')
        expect(collectionResultsPanelProps.headerLoading).toBe(false)
      })
    })
  })

  test('renders a Panels component for granules page', () => {
    const { enzymeWrapper } = setup({}, '/search/granules')

    const panels = enzymeWrapper.find(Panels)
    expect(panels.props().show).toBeTruthy()
    expect(panels.props().activePanel).toEqual('0.1.0')
    expect(panels.props().draggable).toBeTruthy()
    expect(panels.props().panelState).toEqual('default')
  })

  describe('while on the /granules route', () => {
    test('sets the correct breadcrumbs', () => {
      const { enzymeWrapper } = setup({}, '/search/granules')
      const panels = enzymeWrapper.find(Panels)
      const granuleResultsPanel = panels.find(PanelGroup).at(1)
      const granuleResultsPanelProps = granuleResultsPanel.props()

      expect(granuleResultsPanelProps.breadcrumbs[0].link.pathname).toEqual('/search')
      expect(granuleResultsPanelProps.breadcrumbs[0].link.search).toEqual('')
      expect(typeof granuleResultsPanelProps.breadcrumbs[0].onClick).toEqual('function')
      expect(granuleResultsPanelProps.breadcrumbs[0].title).toEqual('Search Results (1 Collections)')
    })

    test('sets the correct more action dropdown items', () => {
      const { enzymeWrapper } = setup({}, '/search/granules')
      const panels = enzymeWrapper.find(Panels)
      const granuleResultsPanel = panels.find(PanelGroup).at(1)
      const granuleResultsPanelProps = granuleResultsPanel.props()

      expect(granuleResultsPanelProps.moreActionsDropdownItems).toStrictEqual([
        {
          icon: FaInfoCircle,
          link: {
            pathname: '/search/granules/collection-details',
            search: ''
          },
          title: 'Collection Details'
        }
      ])
    })

    describe('when the user is logged in', () => {
      test('sets the correct more action dropdown items', () => {
        const { enzymeWrapper } = setup({
          authToken: 'token'
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()

        expect(granuleResultsPanelProps.moreActionsDropdownItems).toStrictEqual([
          {
            icon: FaInfoCircle,
            link: {
              pathname: '/search/granules/collection-details',
              search: ''
            },
            title: 'Collection Details'
          },
          {
            icon: FaBell,
            link: {
              pathname: '/search/granules/subscriptions',
              search: ''
            },
            title: 'Subscriptions'
          }
        ])
      })
    })

    test('sets the correct primary heading', () => {
      const { enzymeWrapper } = setup({}, '/search/granules')
      const panels = enzymeWrapper.find(Panels)
      const granuleResultsPanel = panels.find(PanelGroup).at(1)
      const granuleResultsPanelProps = granuleResultsPanel.props()

      expect(granuleResultsPanelProps.primaryHeading).toBe('Collection Title')
    })

    test('displays the correct footer', () => {
      const { enzymeWrapper } = setup({}, '/search/granules')
      const panels = enzymeWrapper.find(Panels)
      const granuleResultsPanel = panels.find(PanelGroup).at(1)
      const granuleResultsPanelProps = granuleResultsPanel.props()

      expect(granuleResultsPanelProps.footer.type.displayName)
        .toBe(GranuleResultsActionsContainer.displayName)
    })

    test('sets the correct view state', () => {
      const { enzymeWrapper } = setup({}, '/search/granules')
      const panels = enzymeWrapper.find(Panels)
      const granuleResultsPanel = panels.find(PanelGroup).at(1)
      const granuleResultsPanelProps = granuleResultsPanel.props()

      expect(granuleResultsPanelProps.activeView).toBe('list')
      expect(granuleResultsPanelProps.viewsArray[0].label).toBe('List')
      expect(granuleResultsPanelProps.viewsArray[0].icon).toBe(FaList)
      expect(granuleResultsPanelProps.viewsArray[0].isActive).toBe(true)
      expect(granuleResultsPanelProps.viewsArray[1].label).toBe('Table')
      expect(granuleResultsPanelProps.viewsArray[1].icon).toBe(FaTable)
      expect(granuleResultsPanelProps.viewsArray[1].isActive).toBe(false)

      expect(granuleResultsPanelProps.activeSort).toBe('-start_date')
      expect(granuleResultsPanelProps.sortsArray[0].label).toBe('Start Date, Newest First')
      expect(granuleResultsPanelProps.sortsArray[0].isActive).toBe(true)
      expect(granuleResultsPanelProps.sortsArray[1].label).toBe('Start Date, Oldest First')
      expect(granuleResultsPanelProps.sortsArray[1].isActive).toBe(false)
      expect(granuleResultsPanelProps.sortsArray[2].label).toBe('End Date, Newest First')
      expect(granuleResultsPanelProps.sortsArray[2].isActive).toBe(false)
      expect(granuleResultsPanelProps.sortsArray[3].label).toBe('End Date, Oldest First')
      expect(granuleResultsPanelProps.sortsArray[3].isActive).toBe(false)
    })

    describe('when the granules are loading', () => {
      test('shows the loading state', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: false,
            title: 'Collection Title',
            isOpenSearch: false
          },
          granuleSearchResults: {
            allIds: [],
            hits: 0,
            isLoading: true,
            isLoaded: false
          },
          collectionsSearch: {
            allIds: ['COLL_ID_1'],
            hits: 0,
            isLoading: true,
            isLoaded: false
          }
        }, '/search/granules')

        const panels = enzymeWrapper.find(Panels)
        expect(panels.props().show).toBeTruthy()
        expect(panels.props().activePanel).toEqual('0.1.0')
        expect(panels.props().draggable).toBeTruthy()
        expect(panels.props().panelState).toEqual('default')

        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()

        expect(granuleResultsPanelProps.isActive).toBe(true)
        expect(granuleResultsPanelProps.isOpen).toBe(true)
        expect(granuleResultsPanelProps.activePanelId).toBe('0')
        expect(granuleResultsPanelProps.headerMessage.type).toBe(React.Fragment)
        expect(granuleResultsPanelProps.headerMetaPrimaryLoading).toBe(true)
        expect(granuleResultsPanelProps.headerMetaPrimaryText).toBe('Showing 0 of 0 matching granules')
        expect(granuleResultsPanelProps.headerLoading).toBe(true)
      })
    })

    describe('when there is only one granule loaded', () => {
      test('renders the PanelGroup with the correct props', () => {
        const { enzymeWrapper } = setup({
          granuleSearchResults: {
            allIds: ['GRAN_ID_1'],
            hits: 1,
            isLoading: false,
            isLoaded: true
          }
        }, '/search/granules')

        const panels = enzymeWrapper.find(Panels)
        expect(panels.props().show).toBeTruthy()
        expect(panels.props().activePanel).toEqual('0.1.0')
        expect(panels.props().draggable).toBeTruthy()
        expect(panels.props().panelState).toEqual('default')

        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()

        expect(granuleResultsPanelProps.isActive).toBe(true)
        expect(granuleResultsPanelProps.isOpen).toBe(true)
        expect(granuleResultsPanelProps.activePanelId).toBe('0')
        expect(granuleResultsPanelProps.headerMetaPrimaryLoading).toBe(false)
        expect(granuleResultsPanelProps.headerMetaPrimaryText).toBe('Showing 1 of 1 matching granule')
        expect(granuleResultsPanelProps.headerLoading).toBe(false)
      })
    })

    describe('when there is more than one granule', () => {
      test('renders the PanelGroup with the correct props', () => {
        const { enzymeWrapper } = setup({
          granuleSearchResults: {
            allIds: ['GRAN_ID_1', 'GRAN_ID_2'],
            hits: 4,
            isLoading: false,
            isLoaded: true
          }
        }, '/search/granules')

        const panels = enzymeWrapper.find(Panels)
        expect(panels.props().show).toBeTruthy()
        expect(panels.props().activePanel).toEqual('0.1.0')
        expect(panels.props().draggable).toBeTruthy()
        expect(panels.props().panelState).toEqual('default')

        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()

        expect(granuleResultsPanelProps.isActive).toBe(true)
        expect(granuleResultsPanelProps.isOpen).toBe(true)
        expect(granuleResultsPanelProps.activePanelId).toBe('0')
        expect(granuleResultsPanelProps.headerMetaPrimaryLoading).toBe(false)
        expect(granuleResultsPanelProps.headerMetaPrimaryText).toBe('Showing 2 of 4 matching granules')
        expect(granuleResultsPanelProps.headerLoading).toBe(false)
      })
    })

    describe('on a non-CSDA collection', () => {
      test('does not display a badge in the secondary heading', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: true,
            title: 'Collection Title',
            isCSDA: false,
            isOpenSearch: false
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()

        expect(granuleResultsPanelProps.secondaryHeading).toEqual(false)
      })

      test('does not display a header message', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: true,
            title: 'Collection Title',
            isCSDA: false,
            isOpenSearch: false
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()

        expect(granuleResultsPanelProps.headerMessage.props.children).toEqual([
          null,
          false
        ])
      })
    })

    describe('on a CSDA collection', () => {
      test('displays a badge in the secondary heading', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: true,
            title: 'Collection Title',
            isCSDA: true,
            isOpenSearch: false
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()

        expect(granuleResultsPanelProps.secondaryHeading.type.displayName).toEqual('Badge')
        expect(granuleResultsPanelProps.secondaryHeading.props.className).toContain('badge--purple')
        expect(granuleResultsPanelProps.secondaryHeading.props.children[1]).toEqual('CSDA')
      })

      test('displays a header message', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: true,
            title: 'Collection Title',
            isCSDA: true,
            isOpenSearch: false
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()
        const messageProps = granuleResultsPanelProps.headerMessage.props.children[1].props

        expect(messageProps.className).toEqual('search-panels__note')
        expect(shallow(messageProps.children[1]).text()).toContain('NASA Commercial Smallsat Data Acquisition (CSDA) Program')
      })

      test('displays a link to open a modal for more information', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: true,
            title: 'Collection Title',
            isCSDA: true,
            isOpenSearch: false
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()
        const messageProps = granuleResultsPanelProps.headerMessage.props.children[1].props

        expect(shallow(messageProps.children[3]).text()).toContain('More Details')
      })

      describe('when the modal button is clicked', () => {
        test('opens the modal', () => {
          const { enzymeWrapper, props } = setup({
            collectionMetadata: {
              hasAllMetadata: true,
              title: 'Collection Title',
              isCSDA: true,
              isOpenSearch: false
            }
          }, '/search/granules')
          const panels = enzymeWrapper.find(Panels)
          const granuleResultsPanel = panels.find(PanelGroup).at(1)
          const granuleResultsPanelProps = granuleResultsPanel.props()
          const messageProps = granuleResultsPanelProps.headerMessage.props.children[1].props

          const moreDetailsButton = shallow(messageProps.children[3])

          moreDetailsButton.simulate('click')

          expect(props.onToggleAboutCSDAModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleAboutCSDAModal).toHaveBeenCalledWith(true)
        })
      })
    })

    describe('on a CWIC collection', () => {
      test('displays a header message', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: true,
            isOpenSearch: true,
            consortiums: ['CWIC']
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()
        const messageProps = granuleResultsPanelProps.headerMessage.props.children[0].props

        expect(messageProps.className).toEqual('search-panels__note')
        expect(shallow(messageProps.children[1]).text()).toContain('Int\'l / Interagency Data')
      })

      test('displays a link to open a modal for more information', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: true,
            consortiums: ['CWIC'],
            isOpenSearch: true
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()
        const messageProps = granuleResultsPanelProps.headerMessage.props.children[0].props

        expect(shallow(messageProps.children[3]).text()).toContain('More Details')
      })

      describe('when the modal button is clicked', () => {
        test('opens the modal', () => {
          const { enzymeWrapper, props } = setup({
            collectionMetadata: {
              hasAllMetadata: true,
              consortiums: ['CWIC'],
              isOpenSearch: true
            }
          }, '/search/granules')
          const panels = enzymeWrapper.find(Panels)
          const granuleResultsPanel = panels.find(PanelGroup).at(1)
          const granuleResultsPanelProps = granuleResultsPanel.props()
          const messageProps = granuleResultsPanelProps.headerMessage.props.children[0].props
          const moreDetailsButton = shallow(messageProps.children[3])

          moreDetailsButton.simulate('click')

          expect(props.onToggleAboutCwicModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleAboutCwicModal).toHaveBeenCalledWith(true)
        })
      })
    })

    describe('on a CEOS collection', () => {
      test('displays a header message', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: true,
            consortiums: ['CEOS']
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()
        const messageProps = granuleResultsPanelProps.headerMessage.props.children[0].props

        expect(messageProps.className).toEqual('search-panels__note')
        expect(shallow(messageProps.children[1]).text()).toContain('Int\'l / Interagency Data')
      })

      test('does not display a link to open a modal for more information', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: true,
            consortiums: ['CEOS']
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()
        const messageProps = granuleResultsPanelProps.headerMessage.props.children[0].props

        expect(messageProps.children[3]).toBe(undefined)
      })
    })

    describe('on a FEDEO collection', () => {
      test('displays a header message', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: true,
            consortiums: ['FEDEO']
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()
        const messageProps = granuleResultsPanelProps.headerMessage.props.children[0].props

        expect(messageProps.className).toEqual('search-panels__note')
        expect(shallow(messageProps.children[1]).text()).toContain('Int\'l / Interagency Data')
      })

      test('does not display a link to open a modal for more information', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: true,
            consortiums: ['FEDEO']
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()
        const messageProps = granuleResultsPanelProps.headerMessage.props.children[0].props

        expect(messageProps.children[3]).toBe(undefined)
      })
    })

    describe('on a GEOSS collection', () => {
      test('does not display a header message', () => {
        const { enzymeWrapper } = setup({
          collectionMetadata: {
            hasAllMetadata: true,
            consortiums: ['GEOSS']
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleResultsPanel = panels.find(PanelGroup).at(1)
        const granuleResultsPanelProps = granuleResultsPanel.props()
        const messageProps = granuleResultsPanelProps.headerMessage.props.children[0]

        expect(messageProps).toBe(null)
      })
    })
  })

  test('renders a Panels component for granule details page', () => {
    const { enzymeWrapper } = setup({}, '/search/granules/granule-details')

    const panels = enzymeWrapper.find(Panels)
    expect(panels.props().show).toBeTruthy()
    expect(panels.props().activePanel).toEqual('0.3.0')
    expect(panels.props().draggable).toBeTruthy()
    expect(panels.props().panelState).toEqual('default')
  })

  describe('while on the /granules/granule-details route', () => {
    test('sets the correct breadcrumbs', () => {
      const { enzymeWrapper } = setup({}, '/search/granules/granule-details')
      const panels = enzymeWrapper.find(Panels)
      const granuleDetails = panels.find(PanelGroup).at(3)
      const granuleDetailsProps = granuleDetails.props()

      expect(granuleDetailsProps.breadcrumbs[0].link.pathname).toEqual('/search')
      expect(granuleDetailsProps.breadcrumbs[0].link.search).toEqual('')
      expect(typeof granuleDetailsProps.breadcrumbs[0].onClick).toEqual('function')
      expect(granuleDetailsProps.breadcrumbs[0].title).toEqual('Search Results')

      expect(granuleDetailsProps.breadcrumbs[1].link.pathname).toEqual('/search/granules')
      expect(granuleDetailsProps.breadcrumbs[1].link.search).toEqual('')
      expect(granuleDetailsProps.breadcrumbs[1].options.shrink).toEqual(true)
      expect(granuleDetailsProps.breadcrumbs[1].title).toEqual('Collection Title')
    })

    test('sets the correct more action dropdown items', () => {
      const { enzymeWrapper } = setup({}, '/search/granules/granule-details')
      const panels = enzymeWrapper.find(Panels)
      const granuleDetails = panels.find(PanelGroup).at(3)
      const granuleDetailsProps = granuleDetails.props()

      expect(granuleDetailsProps.moreActionsDropdownItems).toStrictEqual([
        {
          icon: FaMap,
          link: {
            pathname: '/search/granules',
            search: ''
          },
          title: 'Granules'
        },
        {
          icon: FaInfoCircle,
          link: {
            pathname: '/search/granules/collection-details',
            search: ''
          },
          title: 'Collection Details'
        }
      ])
    })

    describe('sets the correct primary heading', () => {
      test('when the granule metadata is loading', () => {
        const { enzymeWrapper } = setup({
          granuleMetadata: {
            title: ''
          }
        }, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleDetails = panels.find(PanelGroup).at(3)
        const granuleDetailsProps = granuleDetails.props()

        expect(granuleDetailsProps.primaryHeading).toBe('')
        expect(granuleDetailsProps.headerLoading).toBe(true)
      })

      test('when the granule metadata is loaded', () => {
        const { enzymeWrapper } = setup({}, '/search/granules')
        const panels = enzymeWrapper.find(Panels)
        const granuleDetails = panels.find(PanelGroup).at(3)
        const granuleDetailsProps = granuleDetails.props()

        expect(granuleDetailsProps.primaryHeading).toBe('Granule Title')
        expect(granuleDetailsProps.headerLoading).toBe(false)
      })
    })
  })

  test('renders a Panels component for collection details page', () => {
    const { enzymeWrapper } = setup({}, '/search/granules/collection-details')

    const panels = enzymeWrapper.find(Panels)
    expect(panels.props().show).toBeTruthy()
    expect(panels.props().activePanel).toEqual('0.2.0')
    expect(panels.props().draggable).toBeTruthy()
    expect(panels.props().panelState).toEqual('default')
  })

  describe('while on the /granules/collection-details route', () => {
    test('sets the correct breadcrumbs', () => {
      const { enzymeWrapper } = setup({}, '/search/granules/collection-details')
      const panels = enzymeWrapper.find(Panels)
      const granuleDetails = panels.find(PanelGroup).at(2)
      const granuleDetailsProps = granuleDetails.props()

      expect(granuleDetailsProps.breadcrumbs[0].link.pathname).toEqual('/search')
      expect(granuleDetailsProps.breadcrumbs[0].link.search).toEqual('')
      expect(typeof granuleDetailsProps.breadcrumbs[0].onClick).toEqual('function')
      expect(granuleDetailsProps.breadcrumbs[0].title).toEqual('Search Results (1 Collection)')
    })

    test('sets the correct more action dropdown items', () => {
      const { enzymeWrapper } = setup({}, '/search/granules/collection-details')
      const panels = enzymeWrapper.find(Panels)
      const granuleDetails = panels.find(PanelGroup).at(2)
      const granuleDetailsProps = granuleDetails.props()

      expect(granuleDetailsProps.moreActionsDropdownItems).toStrictEqual([
        {
          icon: FaMap,
          link: {
            pathname: '/search/granules',
            search: ''
          },
          title: 'Granules'
        }
      ])
    })

    describe('when the user is logged in', () => {
      test('sets the correct more action dropdown items', () => {
        const { enzymeWrapper } = setup({
          authToken: 'token'
        }, '/search/granules/collection-details')
        const panels = enzymeWrapper.find(Panels)
        const granuleDetails = panels.find(PanelGroup).at(2)
        const granuleDetailsProps = granuleDetails.props()

        expect(granuleDetailsProps.moreActionsDropdownItems).toStrictEqual([
          {
            icon: FaMap,
            link: {
              pathname: '/search/granules',
              search: ''
            },
            title: 'Granules'
          },
          {
            icon: FaBell,
            link: {
              pathname: '/search/granules/subscriptions',
              search: ''
            },
            title: 'Subscriptions'
          }
        ])
      })
    })

    test('sets the correct primary heading', () => {
      const { enzymeWrapper } = setup({}, '/search/granules/collection-details')
      const panels = enzymeWrapper.find(Panels)
      const granuleDetails = panels.find(PanelGroup).at(2)
      const granuleDetailsProps = granuleDetails.props()

      expect(granuleDetailsProps.primaryHeading).toBe('Collection Title')
      expect(granuleDetailsProps.headerLoading).toBe(false)
    })
  })

  describe('while on the /granules/subscriptions route', () => {
    test('sets the correct breadcrumbs', () => {
      const { enzymeWrapper } = setup({}, '/search/granules/subscriptions')
      const panels = enzymeWrapper.find(Panels)
      const subscriptionsPanel = panels.find(PanelGroup).at(4)
      const subscriptionsPanelProps = subscriptionsPanel.props()

      expect(subscriptionsPanelProps.breadcrumbs[0].link.pathname).toEqual('/search')
      expect(subscriptionsPanelProps.breadcrumbs[0].link.search).toEqual('')
      expect(typeof subscriptionsPanelProps.breadcrumbs[0].onClick).toEqual('function')
      expect(subscriptionsPanelProps.breadcrumbs[0].title).toEqual('Search Results')

      expect(subscriptionsPanelProps.breadcrumbs[1].link.pathname).toEqual('/search/granules')
      expect(subscriptionsPanelProps.breadcrumbs[1].link.search).toEqual('')
      expect(subscriptionsPanelProps.breadcrumbs[1].options.shrink).toEqual(true)
      expect(subscriptionsPanelProps.breadcrumbs[1].title).toEqual('Collection Title')
    })

    test('sets the correct more action dropdown items', () => {
      const { enzymeWrapper } = setup({}, '/search/granules/subscriptions')
      const panels = enzymeWrapper.find(Panels)
      const subscriptionsPanel = panels.find(PanelGroup).at(4)
      const subscriptionsPanelProps = subscriptionsPanel.props()

      expect(subscriptionsPanelProps.moreActionsDropdownItems).toStrictEqual([
        {
          icon: FaMap,
          link: {
            pathname: '/search/granules',
            search: ''
          },
          title: 'Granules'
        },
        {
          icon: FaInfoCircle,
          link: {
            pathname: '/search/granules/collection-details',
            search: ''
          },
          title: 'Collection Details'
        }
      ])
    })

    test('sets the correct primary heading', () => {
      const { enzymeWrapper } = setup({}, '/search/granules/subscriptions')
      const panels = enzymeWrapper.find(Panels)
      const subscriptionsPanel = panels.find(PanelGroup).at(4)
      const subscriptionsPanelProps = subscriptionsPanel.props()

      expect(subscriptionsPanelProps.primaryHeading).toBe('Subscriptions')
      expect(subscriptionsPanelProps.headerLoading).toBe(false)
    })
  })

  describe('componentDidUpdate updates the state if the panelView props have changed', () => {
    const { enzymeWrapper, props } = setup()

    const newProps = {
      ...props,
      preferences: {
        ...props.preferences,
        collectionListView: 'table'
      }
    }
    // setProps only updates the props of the root component, so we need to update the children prop to get to SearchPanels
    enzymeWrapper.setProps({
      children: (
        <StaticRouter location="/search">
          <SearchPanels {...newProps} />
        </StaticRouter>
      )
    })

    expect(enzymeWrapper.find(SearchPanels).instance().state.collectionPanelView).toEqual('table')
  })

  test('onPanelClose calls onTogglePanels', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(SearchPanels).instance().onPanelClose()
    expect(props.onTogglePanels).toHaveBeenCalledTimes(1)
    expect(props.onTogglePanels).toHaveBeenCalledWith(false)
  })

  test('onChangePanel calls onSetActivePanel', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(SearchPanels).instance().onChangePanel('0.1.0')
    expect(props.onSetActivePanel).toHaveBeenCalledTimes(1)
    expect(props.onSetActivePanel).toHaveBeenCalledWith('0.1.0')
  })

  test('onChangeCollectionPanelView sets the state', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.find(SearchPanels).instance().onChangeCollectionsPanelView('table')

    expect(enzymeWrapper.find(SearchPanels).instance().state.collectionPanelView).toEqual('table')
  })

  test('onChangeGranulePanelView sets the state', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.find(SearchPanels).instance().onChangeGranulePanelView('table')

    expect(enzymeWrapper.find(SearchPanels).instance().state.granulePanelView).toEqual('table')
  })

  test('updatePanelViewState sets the state', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.find(SearchPanels).instance().updatePanelViewState({
      collectionPanelView: 'table'
    })

    expect(enzymeWrapper.find(SearchPanels).instance().state.collectionPanelView).toEqual('table')
    expect(enzymeWrapper.find(SearchPanels).instance().state.granulePanelView).toEqual('list')
  })

  describe('exportsArray', () => {
    describe('when not exporting a csv file', () => {
      test('passes the correct props to the PanelGroupHeader', () => {
        const { enzymeWrapper } = setup()

        const panelGroupHeaderProps = enzymeWrapper.find(PanelGroup)
          .at(0).find(PanelGroupHeader).props()
        const { inProgress } = panelGroupHeaderProps.exportsArray[0]
        expect(inProgress).toEqual(false)
      })
    })

    describe('when exporting a csv file', () => {
      test('passes the correct props to the PanelGroupHeader', () => {
        const { enzymeWrapper } = setup({
          isExportRunning: {
            csv: true,
            json: false
          }
        })

        const panelGroupHeaderProps = enzymeWrapper.find(PanelGroup)
          .at(0).find(PanelGroupHeader).props()
        const { inProgress } = panelGroupHeaderProps.exportsArray[0]
        expect(inProgress).toEqual(true)
      })
    })

    describe('when not exporting a json file', () => {
      test('passes the correct props to the PanelGroupHeader', () => {
        const { enzymeWrapper } = setup()

        const panelGroupHeaderProps = enzymeWrapper.find(PanelGroup)
          .at(0).find(PanelGroupHeader).props()
        const { inProgress } = panelGroupHeaderProps.exportsArray[1]
        expect(inProgress).toEqual(false)
      })
    })

    describe('when exporting a json file', () => {
      test('passes the correct props to the PanelGroupHeader', () => {
        const { enzymeWrapper } = setup({
          isExportRunning: {
            csv: false,
            json: true
          }
        })

        const panelGroupHeaderProps = enzymeWrapper.find(PanelGroup)
          .at(0).find(PanelGroupHeader).props()
        const { inProgress } = panelGroupHeaderProps.exportsArray[1]
        expect(inProgress).toEqual(true)
      })
    })
  })
})
