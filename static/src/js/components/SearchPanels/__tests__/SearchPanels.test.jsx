import React from 'react'
import ReactDOM from 'react-dom'
import {
  act,
  screen,
  within
} from '@testing-library/react'

import Helmet from 'react-helmet'
import * as tinyCookie from 'tiny-cookie'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as PortalUtils from '../../../util/portals'
import { collectionSortKeys } from '../../../constants/collectionSortKeys'
import { granuleSortKeys } from '../../../constants/granuleSortKeys'

import SearchPanels from '../SearchPanels'
import CollectionResultsBodyContainer from '../../../containers/CollectionResultsBodyContainer/CollectionResultsBodyContainer'
import GranuleResultsBodyContainer from '../../../containers/GranuleResultsBodyContainer/GranuleResultsBodyContainer'
import CollectionDetailsBodyContainer from '../../../containers/CollectionDetailsBodyContainer/CollectionDetailsBodyContainer'
import GranuleDetailsBodyContainer from '../../../containers/GranuleDetailsBodyContainer/GranuleDetailsBodyContainer'
import SubscriptionsBodyContainer from '../../../containers/SubscriptionsBodyContainer/SubscriptionsBodyContainer'

jest.mock('tiny-cookie', () => ({
  get: jest.fn().mockReturnValue('')
}))

jest.mock('../../../containers/CollectionResultsBodyContainer/CollectionResultsBodyContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/GranuleResultsBodyContainer/GranuleResultsBodyContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/CollectionDetailsBodyContainer/CollectionDetailsBodyContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/GranuleDetailsBodyContainer/GranuleDetailsBodyContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/SubscriptionsBodyContainer/SubscriptionsBodyContainer', () => jest.fn(() => <div />))

jest.mock('../../../../../../sharedUtils/config', () => ({
  getEnvironmentConfig: jest.fn().mockReturnValue({
    edscHost: 'https://search.earthdata.nasa.gov'
  }),
  getApplicationConfig: jest.fn().mockReturnValue({
    env: 'prod',
    defaultMaxOrderSize: 1000000
  })
}))

const PAGE_ROUTE = '/search/:activePanel1?/:activePanel2?/*'

const setup = setupTest({
  ComponentsByRoute: {
    [PAGE_ROUTE]: SearchPanels
  },
  defaultPropsByRoute: {
    [PAGE_ROUTE]: {
      authToken: '',
      collectionMetadata: {
        hasAllMetadata: true,
        title: 'Collection Title',
        conceptId: 'C1000-EDSC',
        isCSDA: false,
        isOpenSearch: false
      },
      collectionQuery: {
        pageNum: 1,
        paramCollectionSortKey: collectionSortKeys.scoreDescending
      },
      collectionsSearch: {
        allIds: ['COLL_ID_1'],
        hits: 1,
        isLoading: false,
        isLoaded: true
      },
      collectionSubscriptions: [],
      granuleMetadata: {
        conceptId: 'G1000-EDSC',
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
      isExportRunning: {
        csv: false,
        json: false
      },
      onApplyGranuleFilters: jest.fn(),
      onChangeQuery: jest.fn(),
      onFocusedCollectionChange: jest.fn(),
      onMetricsCollectionSortChange: jest.fn(),
      onToggleAboutCSDAModal: jest.fn(),
      onToggleAboutCwicModal: jest.fn(),
      onTogglePanels: jest.fn(),
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
      }
    }
  },
  defaultZustandState: {
    location: {
      location: {
        pathname: '/search',
        search: ''
      }
    }
  },
  defaultReduxState: {
    portal: {
      features: {
        authentication: true
      },
      portalId: 'edsc'
    }
  },
  defaultRouterEntries: ['/search'],
  withRedux: true,
  withRouter: true
})

beforeEach(() => {
  jest.spyOn(PortalUtils, 'isDefaultPortal').mockImplementation(() => true)

  ReactDOM.createPortal = jest.fn((dropdown) => dropdown)
})

delete window.location
window.location = { assign: jest.fn() }

describe('SearchPanels component', () => {
  describe('when on the /search route', () => {
    test('renders the CollectionResultsBodyContainer', async () => {
      setup()

      expect(CollectionResultsBodyContainer).toHaveBeenCalledTimes(2)
      expect(CollectionResultsBodyContainer).toHaveBeenLastCalledWith({
        isActive: true,
        panelScrollableNodeRef: { current: null },
        panelView: 'list'
      }, {})

      expect(GranuleResultsBodyContainer).toHaveBeenCalledTimes(2)
      expect(GranuleResultsBodyContainer).toHaveBeenLastCalledWith({
        isActive: false,
        panelScrollableNodeRef: { current: null },
        panelView: 'list'
      }, {})

      expect(CollectionDetailsBodyContainer).toHaveBeenCalledTimes(2)
      expect(CollectionDetailsBodyContainer).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(GranuleDetailsBodyContainer).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBodyContainer).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBodyContainer).toHaveBeenCalledTimes(0)
    })

    describe('when changing the collection sort', () => {
      describe('when selecting Relevance', () => {
        test('calls onChangeQuery and onMetricsCollectionSortChange', async () => {
          const { props, user } = setup({
            overridePropsByRoute: {
              [PAGE_ROUTE]: {
                collectionQuery: {
                  pageNum: 1,
                  paramCollectionSortKey: collectionSortKeys.usageDescending
                }
              }
            },
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search',
                  search: ''
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Usage' })
          await act(async () => {
            await user.click(sortSelect)
          })

          const option = await screen.findByText('Relevance')
          await user.click(option)

          expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
          expect(props.onChangeQuery).toHaveBeenCalledWith({
            collection: {
              sortKey: [collectionSortKeys.scoreDescending],
              paramCollectionSortKey: collectionSortKeys.scoreDescending
            }
          })

          expect(props.onMetricsCollectionSortChange).toHaveBeenCalledTimes(1)
          expect(props.onMetricsCollectionSortChange).toHaveBeenCalledWith({
            value: collectionSortKeys.scoreDescending
          })
        })
      })

      describe('when selecting Usage', () => {
        test('calls onChangeQuery and onMetricsCollectionSortChange', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search',
                  search: ''
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Relevance' })
          await act(async () => {
            await user.click(sortSelect)
          })

          const option = await screen.findByText('Usage')
          await user.click(option)

          expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
          expect(props.onChangeQuery).toHaveBeenCalledWith({
            collection: {
              sortKey: [collectionSortKeys.usageDescending],
              paramCollectionSortKey: collectionSortKeys.usageDescending
            }
          })

          expect(props.onMetricsCollectionSortChange).toHaveBeenCalledTimes(1)
          expect(props.onMetricsCollectionSortChange).toHaveBeenCalledWith({
            value: collectionSortKeys.usageDescending
          })
        })
      })

      describe('when selecting Recent Version', () => {
        test('calls onChangeQuery and onMetricsCollectionSortChange', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search',
                  search: ''
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Relevance' })
          await act(async () => {
            await user.click(sortSelect)
          })

          const option = await screen.findByText('Recent Version')
          await user.click(option)

          expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
          expect(props.onChangeQuery).toHaveBeenCalledWith({
            collection: {
              sortKey: [collectionSortKeys.recentVersion],
              paramCollectionSortKey: collectionSortKeys.recentVersion
            }
          })

          expect(props.onMetricsCollectionSortChange).toHaveBeenCalledTimes(1)
          expect(props.onMetricsCollectionSortChange).toHaveBeenCalledWith({
            value: collectionSortKeys.recentVersion
          })
        })
      })

      describe('when selecting Start Date', () => {
        test('calls onChangeQuery and onMetricsCollectionSortChange', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search',
                  search: ''
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Relevance' })
          await act(async () => {
            await user.click(sortSelect)
          })

          const option = await screen.findByText('Start Date')
          await user.click(option)

          expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
          expect(props.onChangeQuery).toHaveBeenCalledWith({
            collection: {
              sortKey: [collectionSortKeys.startDateAscending],
              paramCollectionSortKey: collectionSortKeys.startDateAscending
            }
          })

          expect(props.onMetricsCollectionSortChange).toHaveBeenCalledTimes(1)
          expect(props.onMetricsCollectionSortChange).toHaveBeenCalledWith({
            value: collectionSortKeys.startDateAscending
          })
        })
      })

      describe('when selecting End Date', () => {
        test('calls onChangeQuery and onMetricsCollectionSortChange', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search',
                  search: ''
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Relevance' })
          await act(async () => {
            await user.click(sortSelect)
          })

          const option = await screen.findByText('End Date')
          await user.click(option)

          expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
          expect(props.onChangeQuery).toHaveBeenCalledWith({
            collection: {
              sortKey: [collectionSortKeys.endDateDescending],
              paramCollectionSortKey: collectionSortKeys.endDateDescending
            }
          })

          expect(props.onMetricsCollectionSortChange).toHaveBeenCalledTimes(1)
          expect(props.onMetricsCollectionSortChange).toHaveBeenCalledWith({
            value: collectionSortKeys.endDateDescending
          })
        })
      })
    })

    describe('when changing the collection view', () => {
      describe('when selecting Table', () => {
        test('updates CollectionResultsBodyContainer', async () => {
          const { user } = setup({
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search',
                  search: ''
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const openPanel = screen.getByTestId('panel-group_collection-results')
          const sortSelect = within(openPanel).getByRole('button', { name: 'View: List' })

          await act(async () => {
            await user.click(sortSelect)
          })

          CollectionResultsBodyContainer.mockClear()

          const option = await screen.findByText('Table')
          await act(async () => {
            await user.click(option)
          })

          expect(CollectionResultsBodyContainer).toHaveBeenCalledTimes(1)
          expect(CollectionResultsBodyContainer).toHaveBeenLastCalledWith({
            isActive: true,
            panelScrollableNodeRef: { current: null },
            panelView: 'table'
          }, {})
        })
      })

      describe('when selecting List', () => {
        test('updates CollectionResultsBodyContainer', async () => {
          const { user } = setup({
            overridePropsByRoute: {
              [PAGE_ROUTE]: {
                preferences: {
                  collectionListView: 'table'
                }
              }
            },
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search',
                  search: ''
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const openPanel = screen.getByTestId('panel-group_collection-results')
          const sortSelect = within(openPanel).getByRole('button', { name: 'View: Table' })

          await act(async () => {
            await user.click(sortSelect)
          })

          CollectionResultsBodyContainer.mockClear()

          const option = await screen.findByText('List')
          await act(async () => {
            await user.click(option)
          })

          expect(CollectionResultsBodyContainer).toHaveBeenCalledTimes(1)
          expect(CollectionResultsBodyContainer).toHaveBeenLastCalledWith({
            isActive: true,
            panelScrollableNodeRef: { current: null },
            panelView: 'list'
          }, {})
        })
      })
    })
  })

  describe('when on the /search/granules route', () => {
    test('renders the GranuleResultsBodyContainer', () => {
      setup({
        overrideZustandState: {
          location: {
            location: {
              pathname: '/search/granules',
              search: '?p=C1000-EDSC'
            }
          }
        },
        overrideRouterEntries: ['/search/granules']
      })

      const helmet = Helmet.peek()

      expect(helmet.title).toEqual('Collection Title')
      expect(helmet.metaTags[0]).toEqual({
        name: 'title',
        content: 'Collection Title'
      })

      expect(helmet.metaTags[1]).toEqual({
        property: 'og:title',
        content: 'Collection Title'
      })

      expect(helmet.metaTags[2]).toEqual({
        name: 'description',
        content: 'Explore and access Collection Title data on Earthdata Search'
      })

      expect(helmet.metaTags[3]).toEqual({
        property: 'og:description',
        content: 'Explore and access Collection Title data on Earthdata Search'
      })

      expect(helmet.metaTags[4]).toEqual({
        property: 'og:url',
        content: 'https://search.earthdata.nasa.gov/search/granules?p=C1000-EDSC'
      })

      expect(helmet.linkTags[0]).toEqual({
        rel: 'canonical',
        href: 'https://search.earthdata.nasa.gov/search/granules?p=C1000-EDSC'
      })

      expect(screen.getByText('Search Results (1 Collections)')).toBeInTheDocument()

      expect(CollectionResultsBodyContainer).toHaveBeenCalledTimes(2)
      expect(CollectionResultsBodyContainer).toHaveBeenLastCalledWith({
        isActive: false,
        panelScrollableNodeRef: { current: null },
        panelView: 'list'
      }, {})

      expect(GranuleResultsBodyContainer).toHaveBeenCalledTimes(2)
      expect(GranuleResultsBodyContainer).toHaveBeenLastCalledWith({
        isActive: true,
        panelScrollableNodeRef: { current: null },
        panelView: 'list'
      }, {})

      expect(CollectionDetailsBodyContainer).toHaveBeenCalledTimes(2)
      expect(CollectionDetailsBodyContainer).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(GranuleDetailsBodyContainer).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBodyContainer).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBodyContainer).toHaveBeenCalledTimes(0)
    })

    describe('when changing the granule sort', () => {
      describe('when selecting Start Date, Newest First', () => {
        test('calls onApplyGranuleFilters', async () => {
          const { props, user } = setup({
            overridePropsByRoute: {
              [PAGE_ROUTE]: {
                granuleQuery: {
                  pageNum: 1,
                  sortKey: granuleSortKeys.startDateAscending
                }
              }
            },
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search/granules',
                  search: '?p=C1000-EDSC'
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Start Date (Oldest)' })
          await act(async () => {
            await user.click(sortSelect)
          })

          const option = await screen.findByText('Start Date, Newest First')
          await user.click(option)

          expect(props.onApplyGranuleFilters).toHaveBeenCalledTimes(1)
          expect(props.onApplyGranuleFilters).toHaveBeenCalledWith({
            sortKey: granuleSortKeys.startDateDescending
          })
        })
      })

      describe('when selecting Start Date, Oldest First', () => {
        test('calls onApplyGranuleFilters', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search/granules',
                  search: '?p=C1000-EDSC'
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Start Date (Newest)' })
          await act(async () => {
            await user.click(sortSelect)
          })

          const option = await screen.findByText('Start Date, Oldest First')
          await user.click(option)

          expect(props.onApplyGranuleFilters).toHaveBeenCalledTimes(1)
          expect(props.onApplyGranuleFilters).toHaveBeenCalledWith({
            sortKey: granuleSortKeys.startDateAscending
          })
        })
      })

      describe('when selecting End Date, Newest First', () => {
        test('calls onApplyGranuleFilters', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search/granules',
                  search: '?p=C1000-EDSC'
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Start Date (Newest)' })
          await act(async () => {
            await user.click(sortSelect)
          })

          const option = await screen.findByText('End Date, Newest First')
          await user.click(option)

          expect(props.onApplyGranuleFilters).toHaveBeenCalledTimes(1)
          expect(props.onApplyGranuleFilters).toHaveBeenCalledWith({
            sortKey: granuleSortKeys.endDateDescending
          })
        })
      })

      describe('when selecting End Date, Oldest First', () => {
        test('calls onApplyGranuleFilters', async () => {
          const { props, user } = setup({
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search/granules',
                  search: '?p=C1000-EDSC'
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Start Date (Newest)' })
          await act(async () => {
            await user.click(sortSelect)
          })

          const option = await screen.findByText('End Date, Oldest First')
          await user.click(option)

          expect(props.onApplyGranuleFilters).toHaveBeenCalledTimes(1)
          expect(props.onApplyGranuleFilters).toHaveBeenCalledWith({
            sortKey: granuleSortKeys.endDateAscending
          })
        })
      })
    })

    describe('when changing the granule view', () => {
      describe('when selecting Table', () => {
        test('updates GranuleResultsBodyContainer', async () => {
          const { user } = setup({
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search/granules',
                  search: '?p=C1000-EDSC'
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const openPanel = screen.getByTestId('panel-group_granule-results')
          const sortSelect = within(openPanel).getByRole('button', { name: 'View: List' })

          await act(async () => {
            await user.click(sortSelect)
          })

          GranuleResultsBodyContainer.mockClear()

          const option = await screen.findByText('Table')
          await act(async () => {
            await user.click(option)
          })

          expect(GranuleResultsBodyContainer).toHaveBeenCalledTimes(1)
          expect(GranuleResultsBodyContainer).toHaveBeenLastCalledWith({
            isActive: true,
            panelScrollableNodeRef: { current: null },
            panelView: 'table'
          }, {})
        })
      })

      describe('when selecting List', () => {
        test('updates GranuleResultsBodyContainer', async () => {
          const { user } = setup({
            overridePropsByRoute: {
              [PAGE_ROUTE]: {
                preferences: {
                  granuleListView: 'table'
                }
              }
            },
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search/granules',
                  search: '?p=C1000-EDSC'
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const openPanel = screen.getByTestId('panel-group_granule-results')
          const sortSelect = within(openPanel).getByRole('button', { name: 'View: Table' })

          await act(async () => {
            await user.click(sortSelect)
          })

          GranuleResultsBodyContainer.mockClear()

          const option = await screen.findByText('List')
          await act(async () => {
            await user.click(option)
          })

          expect(GranuleResultsBodyContainer).toHaveBeenCalledTimes(1)
          expect(GranuleResultsBodyContainer).toHaveBeenLastCalledWith({
            isActive: true,
            panelScrollableNodeRef: { current: null },
            panelView: 'list'
          }, {})
        })
      })
    })

    describe('when clicking the Search Results breadcrumb', () => {
      test('calls onFocusedCollectionChange', async () => {
        const { props, user } = setup({
          overrideZustandState: {
            location: {
              location: {
                pathname: '/search/granules',
                search: '?p=C1000-EDSC'
              }
            }
          },
          overrideRouterEntries: ['/search/granules']
        })

        const link = screen.getByText('Search Results (1 Collections)')
        await user.click(link)

        expect(props.onFocusedCollectionChange).toHaveBeenCalledTimes(1)
        expect(props.onFocusedCollectionChange).toHaveBeenCalledWith('')
      })
    })

    describe('when the collection is OpenSearch', () => {
      test('renders the OpenSearch header', () => {
        setup({
          overridePropsByRoute: {
            [PAGE_ROUTE]: {
              collectionMetadata: {
                hasAllMetadata: true,
                title: 'Collection Title',
                conceptId: 'C1000-EDSC',
                isCSDA: false,
                isOpenSearch: true,
                consortiums: ['CEOS']
              }
            }
          },
          overrideZustandState: {
            location: {
              location: {
                pathname: '/search/granules',
                search: '?p=C1000-EDSC'
              }
            }
          },
          overrideRouterEntries: ['/search/granules']
        })

        expect(screen.getByText('Int\'l / Interagency Data')).toBeInTheDocument()
      })

      describe('when clicking More Details', () => {
        test('calls onToggleAboutCwicModal', async () => {
          const { props, user } = setup({
            overridePropsByRoute: {
              [PAGE_ROUTE]: {
                collectionMetadata: {
                  hasAllMetadata: true,
                  title: 'Collection Title',
                  conceptId: 'C1000-EDSC',
                  isCSDA: false,
                  isOpenSearch: true,
                  consortiums: ['CEOS']
                }
              }
            },
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search/granules',
                  search: '?p=C1000-EDSC'
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const moreDetails = screen.getByRole('button', { name: 'More details' })
          await user.click(moreDetails)

          expect(props.onToggleAboutCwicModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleAboutCwicModal).toHaveBeenCalledWith(true)
        })
      })
    })

    describe('when the collection is CSDA', () => {
      test('renders the CSDA header', () => {
        setup({
          overridePropsByRoute: {
            [PAGE_ROUTE]: {
              collectionMetadata: {
                hasAllMetadata: true,
                title: 'Collection Title',
                conceptId: 'C1000-EDSC',
                isCSDA: true,
                isOpenSearch: false
              }
            }
          },
          overrideZustandState: {
            location: {
              location: {
                pathname: '/search/granules',
                search: '?p=C1000-EDSC'
              }
            }
          },
          overrideRouterEntries: ['/search/granules']
        })

        expect(screen.getByText('NASA Commercial Smallsat Data Acquisition (CSDA) Program')).toBeInTheDocument()
      })

      describe('when clicking More Details', () => {
        test('calls onToggleAboutCSDAModal', async () => {
          const { props, user } = setup({
            overridePropsByRoute: {
              [PAGE_ROUTE]: {
                collectionMetadata: {
                  hasAllMetadata: true,
                  title: 'Collection Title',
                  conceptId: 'C1000-EDSC',
                  isCSDA: true,
                  isOpenSearch: false
                }
              }
            },
            overrideZustandState: {
              location: {
                location: {
                  pathname: '/search/granules',
                  search: '?p=C1000-EDSC'
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const moreDetails = screen.getByRole('button', { name: 'More details' })
          await user.click(moreDetails)

          expect(props.onToggleAboutCSDAModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleAboutCSDAModal).toHaveBeenCalledWith(true)
        })
      })
    })
  })

  describe('when on the /search/granules/collection-details route', () => {
    test('renders the CollectionDetailsBodyContainer', () => {
      setup({
        overrideZustandState: {
          location: {
            location: {
              pathname: '/search/granules/collection-details',
              search: '?p=C1000-EDSC'
            }
          }
        },
        overrideRouterEntries: ['/search/granules/collection-details']
      })

      const helmet = Helmet.peek()

      expect(helmet.title).toEqual('Collection Title Details')
      expect(helmet.metaTags[0]).toEqual({
        name: 'title',
        content: 'Collection Title Details'
      })

      expect(helmet.metaTags[1]).toEqual({
        property: 'og:title',
        content: 'Collection Title Details'
      })

      expect(helmet.metaTags[2]).toEqual({
        name: 'description',
        content: 'View Collection Title on Earthdata Search'
      })

      expect(helmet.metaTags[3]).toEqual({
        property: 'og:description',
        content: 'View Collection Title on Earthdata Search'
      })

      expect(helmet.metaTags[4]).toEqual({
        property: 'og:url',
        content: 'https://search.earthdata.nasa.gov/search/collection-details?p=C1000-EDSC'
      })

      expect(helmet.linkTags[0]).toEqual({
        rel: 'canonical',
        href: 'https://search.earthdata.nasa.gov/search/collection-details?p=C1000-EDSC'
      })

      expect(CollectionResultsBodyContainer).toHaveBeenCalledTimes(2)
      expect(CollectionResultsBodyContainer).toHaveBeenLastCalledWith({
        isActive: false,
        panelScrollableNodeRef: { current: null },
        panelView: 'list'
      }, {})

      expect(GranuleResultsBodyContainer).toHaveBeenCalledTimes(2)
      expect(GranuleResultsBodyContainer).toHaveBeenLastCalledWith({
        isActive: false,
        panelScrollableNodeRef: { current: null },
        panelView: 'list'
      }, {})

      expect(CollectionDetailsBodyContainer).toHaveBeenCalledTimes(2)
      expect(CollectionDetailsBodyContainer).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: true
      }), {})

      expect(GranuleDetailsBodyContainer).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBodyContainer).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBodyContainer).toHaveBeenCalledTimes(0)
    })

    describe('when clicking the Search Results breadcrumb', () => {
      test('calls onFocusedCollectionChange', async () => {
        const { props, user } = setup({
          overrideZustandState: {
            location: {
              location: {
                pathname: '/search/granules/collection-details',
                search: '?p=C1000-EDSC'
              }
            }
          },
          overrideRouterEntries: ['/search/granules/collection-details']
        })

        const openPanel = screen.getByTestId('panel-group_granules-collections-results')
        const link = within(openPanel).getByRole('button', { name: 'Search Results (1 Collection)' })
        await user.click(link)

        expect(props.onFocusedCollectionChange).toHaveBeenCalledTimes(1)
        expect(props.onFocusedCollectionChange).toHaveBeenCalledWith('')
      })
    })
  })

  describe('when on the /search/granules/granule-details route', () => {
    test('renders the GranuleDetailsBodyContainer', () => {
      setup({
        overrideZustandState: {
          location: {
            location: {
              pathname: '/search/granules/granule-details',
              search: '?p=C1000-EDSC&g=G1000-EDSC'
            }
          }
        },
        overrideRouterEntries: ['/search/granules/granule-details']
      })

      const helmet = Helmet.peek()

      expect(helmet.title).toEqual('Granule Title Details')
      expect(helmet.metaTags[0]).toEqual({
        name: 'title',
        content: 'Granule Title Details'
      })

      expect(helmet.metaTags[1]).toEqual({
        property: 'og:title',
        content: 'Granule Title Details'
      })

      expect(helmet.metaTags[2]).toEqual({
        name: 'description',
        content: 'View Granule Title on Earthdata Search'
      })

      expect(helmet.metaTags[3]).toEqual({
        property: 'og:description',
        content: 'View Granule Title on Earthdata Search'
      })

      expect(helmet.metaTags[4]).toEqual({
        property: 'og:url',
        content: 'https://search.earthdata.nasa.gov/search/granules/granule-details?p=C1000-EDSC&g=G1000-EDSC'
      })

      expect(helmet.linkTags[0]).toEqual({
        rel: 'canonical',
        href: 'https://search.earthdata.nasa.gov/search/granules/granule-details?p=C1000-EDSC&g=G1000-EDSC'
      })

      expect(CollectionResultsBodyContainer).toHaveBeenCalledTimes(2)
      expect(CollectionResultsBodyContainer).toHaveBeenLastCalledWith({
        isActive: false,
        panelScrollableNodeRef: { current: null },
        panelView: 'list'
      }, {})

      expect(GranuleResultsBodyContainer).toHaveBeenCalledTimes(2)
      expect(GranuleResultsBodyContainer).toHaveBeenLastCalledWith({
        isActive: false,
        panelScrollableNodeRef: { current: null },
        panelView: 'list'
      }, {})

      expect(CollectionDetailsBodyContainer).toHaveBeenCalledTimes(2)
      expect(CollectionDetailsBodyContainer).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(GranuleDetailsBodyContainer).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBodyContainer).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: true
      }), {})

      expect(SubscriptionsBodyContainer).toHaveBeenCalledTimes(0)
    })

    describe('when clicking the Search Results breadcrumb', () => {
      test('calls onFocusedCollectionChange', async () => {
        const { props, user } = setup({
          overrideZustandState: {
            location: {
              location: {
                pathname: '/search/granules/granule-details',
                search: '?p=C1000-EDSC&g=G1000-EDSC'
              }
            }
          },
          overrideRouterEntries: ['/search/granules/granule-details']
        })

        const openPanel = screen.getByTestId('panel-group_granule-details')
        const link = within(openPanel).getByRole('button', { name: 'Search Results' })
        await user.click(link)

        expect(props.onFocusedCollectionChange).toHaveBeenCalledTimes(1)
        expect(props.onFocusedCollectionChange).toHaveBeenCalledWith('')
      })
    })
  })

  describe('when on the /search/granules/subscriptions route', () => {
    test('renders the SubscriptionsBodyContainer', () => {
      jest.spyOn(tinyCookie, 'get').mockReturnValue('mock-token')

      setup({
        overridePropsByRoute: {
          '/search/activePanel1?/:activePanel2?/*': {
            authToken: 'mock-token'
          }
        },
        overrideZustandState: {
          location: {
            location: {
              pathname: '/search/granules/subscriptions',
              search: '?p=C1000-EDSC'
            }
          }
        },
        overrideRouterEntries: ['/search/granules/subscriptions']
      })

      const helmet = Helmet.peek()

      expect(helmet.title).toEqual('Collection Title Subscriptions')
      expect(helmet.metaTags[0]).toEqual({
        name: 'title',
        content: 'Collection Title Subscriptions'
      })

      expect(helmet.metaTags[1]).toEqual({
        property: 'og:title',
        content: 'Collection Title Subscriptions'
      })

      expect(helmet.metaTags[2]).toEqual({
        name: 'description',
        content: 'Subscribe to be notifed when new Collection Title data is available'
      })

      expect(helmet.metaTags[3]).toEqual({
        property: 'og:description',
        content: 'Subscribe to be notifed when new Collection Title data is available'
      })

      expect(helmet.metaTags[4]).toEqual({
        property: 'og:url',
        content: 'https://search.earthdata.nasa.gov/search/granules/subscriptions?p=C1000-EDSC'
      })

      expect(helmet.linkTags[0]).toEqual({
        rel: 'canonical',
        href: 'https://search.earthdata.nasa.gov/search/granules/subscriptions?p=C1000-EDSC'
      })

      expect(CollectionResultsBodyContainer).toHaveBeenCalledTimes(2)
      expect(CollectionResultsBodyContainer).toHaveBeenLastCalledWith({
        isActive: false,
        panelScrollableNodeRef: { current: null },
        panelView: 'list'
      }, {})

      expect(GranuleResultsBodyContainer).toHaveBeenCalledTimes(2)
      expect(GranuleResultsBodyContainer).toHaveBeenLastCalledWith({
        isActive: false,
        panelScrollableNodeRef: { current: null },
        panelView: 'list'
      }, {})

      expect(CollectionDetailsBodyContainer).toHaveBeenCalledTimes(2)
      expect(CollectionDetailsBodyContainer).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(GranuleDetailsBodyContainer).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBodyContainer).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBodyContainer).toHaveBeenCalledTimes(2)
      expect(SubscriptionsBodyContainer).toHaveBeenNthCalledWith(1, {
        subscriptionType: 'granule'
      }, {})

      expect(SubscriptionsBodyContainer).toHaveBeenNthCalledWith(2, {
        subscriptionType: 'collection'
      }, {})
    })

    describe('when clicking the Search Results breadcrumb', () => {
      test('calls onFocusedCollectionChange', async () => {
        const { props, user } = setup({
          overrideZustandState: {
            location: {
              location: {
                pathname: '/search/granules/subscriptions',
                search: '?p=C1000-EDSC'
              }
            }
          },
          overrideRouterEntries: ['/search/granules/subscriptions']
        })

        const openPanel = screen.getByTestId('panel-group_granule-subscriptions')
        const link = within(openPanel).getByRole('button', { name: 'Search Results' })
        await user.click(link)

        expect(props.onFocusedCollectionChange).toHaveBeenCalledTimes(1)
        expect(props.onFocusedCollectionChange).toHaveBeenCalledWith('')
      })
    })
  })

  describe('when on the /search/subscriptions route', () => {
    test('renders the SubscriptionsBodyContainer', () => {
      jest.spyOn(tinyCookie, 'get').mockReturnValue('mock-token')

      setup({
        overridePropsByRoute: {
          '/search/activePanel1?/:activePanel2?/*': {
            authToken: 'mock-token'
          }
        },
        overrideZustandState: {
          location: {
            location: {
              pathname: '/search/subscriptions',
              search: ''
            }
          }
        },
        overrideRouterEntries: ['/search/subscriptions']
      })

      const helmet = Helmet.peek()

      expect(helmet.title).toEqual('Dataset Search Subscriptions')
      expect(helmet.metaTags[0]).toEqual({
        name: 'title',
        content: 'Dataset Search Subscriptions'
      })

      expect(helmet.metaTags[1]).toEqual({
        property: 'og:title',
        content: 'Dataset Search Subscriptions'
      })

      expect(helmet.metaTags[2]).toEqual({
        name: 'description',
        content: 'Subscribe to be notifed when new datasets become available'
      })

      expect(helmet.metaTags[3]).toEqual({
        property: 'og:description',
        content: 'Subscribe to be notifed when new datasets become available'
      })

      expect(helmet.metaTags[4]).toEqual({
        property: 'og:url',
        content: 'https://search.earthdata.nasa.gov/search/subscriptions'
      })

      expect(helmet.linkTags[0]).toEqual({
        rel: 'canonical',
        href: 'https://search.earthdata.nasa.gov/search/subscriptions'
      })

      expect(CollectionResultsBodyContainer).toHaveBeenCalledTimes(2)
      expect(CollectionResultsBodyContainer).toHaveBeenLastCalledWith({
        isActive: false,
        panelScrollableNodeRef: { current: null },
        panelView: 'list'
      }, {})

      expect(GranuleResultsBodyContainer).toHaveBeenCalledTimes(2)
      expect(GranuleResultsBodyContainer).toHaveBeenLastCalledWith({
        isActive: false,
        panelScrollableNodeRef: { current: null },
        panelView: 'list'
      }, {})

      expect(CollectionDetailsBodyContainer).toHaveBeenCalledTimes(2)
      expect(CollectionDetailsBodyContainer).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(GranuleDetailsBodyContainer).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBodyContainer).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBodyContainer).toHaveBeenCalledTimes(2)
      expect(SubscriptionsBodyContainer).toHaveBeenNthCalledWith(1, {
        subscriptionType: 'granule'
      }, {})

      expect(SubscriptionsBodyContainer).toHaveBeenNthCalledWith(2, {
        subscriptionType: 'collection'
      }, {})
    })

    describe('when clicking the Search Results breadcrumb', () => {
      test('calls onFocusedCollectionChange', async () => {
        const { props, user } = setup({
          overrideZustandState: {
            location: {
              location: {
                pathname: '/search/subscriptions',
                search: ''
              }
            }
          },
          overrideRouterEntries: ['/search/subscriptions']
        })

        const openPanel = screen.getByTestId('panel-group_collection-subscriptions')
        const link = within(openPanel).getByRole('button', { name: 'Search Results' })
        await user.click(link)

        expect(props.onFocusedCollectionChange).toHaveBeenCalledTimes(1)
        expect(props.onFocusedCollectionChange).toHaveBeenCalledWith('')
      })
    })
  })
})
