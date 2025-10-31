import React from 'react'
import ReactDOM from 'react-dom'
import { screen, within } from '@testing-library/react'
import { useLocation } from 'react-router-dom'

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
import SubscriptionsBodyContainer from '../../../containers/SubscriptionsBodyContainer/SubscriptionsBodyContainer'
import GranuleResultsFocusedMetaContainer from '../../../containers/GranuleResultsFocusedMetaContainer/GranuleResultsFocusedMetaContainer'
import GranuleDetailsBody from '../../GranuleDetails/GranuleDetailsBody'

jest.mock('tiny-cookie', () => ({
  get: jest.fn().mockReturnValue('')
}))

jest.mock('../../../containers/CollectionResultsBodyContainer/CollectionResultsBodyContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/GranuleResultsBodyContainer/GranuleResultsBodyContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/CollectionDetailsBodyContainer/CollectionDetailsBodyContainer', () => jest.fn(() => <div />))
jest.mock('../../GranuleDetails/GranuleDetailsBody', () => jest.fn(() => <div />))
jest.mock('../../../containers/SubscriptionsBodyContainer/SubscriptionsBodyContainer', () => jest.fn(() => <div />))
jest.mock('../../../containers/GranuleResultsFocusedMetaContainer/GranuleResultsFocusedMetaContainer', () => jest.fn(() => <div />))

jest.mock('../../../../../../sharedUtils/config', () => ({
  getEnvironmentConfig: jest.fn().mockReturnValue({
    edscHost: 'https://search.earthdata.nasa.gov'
  }),
  getApplicationConfig: jest.fn().mockReturnValue({
    env: 'prod',
    defaultMaxOrderSize: 1000000
  })
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({
    pathname: '/search',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const PAGE_ROUTE = '/search/:activePanel1?/:activePanel2?/*'

const setup = setupTest({
  ComponentsByRoute: {
    [PAGE_ROUTE]: SearchPanels
  },
  defaultPropsByRoute: {
    [PAGE_ROUTE]: {
      edlToken: '',
      collectionSubscriptions: [],
      isExportRunning: {
        csv: false,
        json: false
      },
      setCollectionId: jest.fn(),
      onMetricsCollectionSortChange: jest.fn(),
      onToggleAboutCSDAModal: jest.fn(),
      onToggleAboutCwicModal: jest.fn(),
      onTogglePanels: jest.fn(),
      onExport: jest.fn(),
      panels: {
        activePanel: '0.0.0',
        isOpen: true
      }
    }
  },
  defaultZustandState: {
    collection: {
      collectionId: 'C1000-EDSC',
      collectionMetadata: {
        'C1000-EDSC': {
          hasAllMetadata: true,
          title: 'Collection Title',
          conceptId: 'C1000-EDSC',
          isCSDA: false,
          isOpenSearch: false
        }
      },
      setCollectionId: jest.fn()
    },
    collections: {
      collections: {
        count: 1,
        isLoading: false,
        isLoaded: true,
        items: [{
          conceptId: 'COLL_ID_1'
        }]
      }
    },
    granule: {},
    granules: {},
    portal: {
      features: {
        authentication: true,
        portalId: 'edsc'
      }
    },
    query: {
      changeGranuleQuery: jest.fn(),
      changeQuery: jest.fn()
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

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBodyContainer).toHaveBeenCalledTimes(0)
    })

    describe('when changing the collection sort', () => {
      describe('when selecting Relevance', () => {
        test('calls onChangeQuery and onMetricsCollectionSortChange', async () => {
          const { props, user, zustandState } = setup({
            overrideZustandState: {
              query: {
                collection: {
                  pageNum: 1,
                  sortKey: collectionSortKeys.usageDescending
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Usage' })
          await user.click(sortSelect)

          const option = await screen.findByText('Relevance')
          await user.click(option)

          expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
          expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
            collection: {
              sortKey: collectionSortKeys.scoreDescending
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
          const { props, user, zustandState } = setup({
            overrideZustandState: {
              query: {
                collection: {
                  pageNum: 1,
                  sortKey: collectionSortKeys.scoreDescending
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Relevance' })
          await user.click(sortSelect)

          const option = await screen.findByText('Usage')
          await user.click(option)

          expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
          expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
            collection: {
              sortKey: collectionSortKeys.usageDescending
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
          const { props, user, zustandState } = setup({
            overrideZustandState: {
              query: {
                collection: {
                  pageNum: 1,
                  sortKey: collectionSortKeys.scoreDescending
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Relevance' })
          await user.click(sortSelect)

          const option = await screen.findByText('Recent Version')
          await user.click(option)

          expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
          expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
            collection: {
              sortKey: collectionSortKeys.recentVersion
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
          const { props, user, zustandState } = setup({
            overrideZustandState: {
              query: {
                collection: {
                  pageNum: 1,
                  sortKey: collectionSortKeys.scoreDescending
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Relevance' })
          await user.click(sortSelect)

          const option = await screen.findByText('Start Date')
          await user.click(option)

          expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
          expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
            collection: {
              sortKey: collectionSortKeys.startDateAscending
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
          const { props, user, zustandState } = setup({
            overrideZustandState: {
              query: {
                collection: {
                  pageNum: 1,
                  sortKey: collectionSortKeys.scoreDescending
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Relevance' })
          await user.click(sortSelect)

          const option = await screen.findByText('End Date')
          await user.click(option)

          expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
          expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
            collection: {
              sortKey: collectionSortKeys.endDateDescending
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
            overrideRouterEntries: ['/search']
          })

          const openPanel = screen.getByTestId('panel-group_collection-results')
          const sortSelect = within(openPanel).getByRole('button', { name: 'View: List' })
          await user.click(sortSelect)

          CollectionResultsBodyContainer.mockClear()

          const option = await screen.findByText('Table')
          await user.click(option)

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
            overrideZustandState: {
              user: {
                sitePreferences: {
                  collectionListView: 'table'
                }
              }
            },
            overrideRouterEntries: ['/search']
          })

          const openPanel = screen.getByTestId('panel-group_collection-results')
          const sortSelect = within(openPanel).getByRole('button', { name: 'View: Table' })
          await user.click(sortSelect)

          CollectionResultsBodyContainer.mockClear()

          const option = await screen.findByText('List')
          await user.click(option)

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
      useLocation.mockReturnValue({
        pathname: '/search/granules',
        search: '?p=C1000-EDSC'
      })

      setup({
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

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBodyContainer).toHaveBeenCalledTimes(0)
    })

    describe('when changing the granule sort', () => {
      describe('when selecting Start Date, Newest First', () => {
        test('calls onApplyGranuleFilters', async () => {
          useLocation.mockReturnValue({
            pathname: '/search/granules',
            search: '?p=C1000-EDSC'
          })

          const { user, zustandState } = setup({
            overrideZustandState: {
              query: {
                collection: {
                  byId: {
                    'C1000-EDSC': {
                      granules: {
                        sortKey: granuleSortKeys.startDateAscending
                      }
                    }
                  }
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Start Date (Oldest)' })
          await user.click(sortSelect)

          const option = await screen.findByText('Start Date, Newest First')
          await user.click(option)

          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledTimes(1)
          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledWith({
            collectionId: 'C1000-EDSC',
            query: {
              sortKey: granuleSortKeys.startDateDescending
            }
          })
        })
      })

      describe('when selecting Start Date, Oldest First', () => {
        test('calls onApplyGranuleFilters', async () => {
          useLocation.mockReturnValue({
            pathname: '/search/granules',
            search: '?p=C1000-EDSC'
          })

          const { user, zustandState } = setup({
            overrideZustandState: {
              query: {
                collection: {
                  byId: {
                    'C1000-EDSC': {
                      granules: {
                        sortKey: granuleSortKeys.startDateDescending
                      }
                    }
                  }
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Start Date (Newest)' })
          await user.click(sortSelect)

          const option = await screen.findByText('Start Date, Oldest First')
          await user.click(option)

          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledTimes(1)
          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledWith({
            collectionId: 'C1000-EDSC',
            query: {
              sortKey: granuleSortKeys.startDateAscending
            }
          })
        })
      })

      describe('when selecting End Date, Newest First', () => {
        test('calls onApplyGranuleFilters', async () => {
          useLocation.mockReturnValue({
            pathname: '/search/granules',
            search: '?p=C1000-EDSC'
          })

          const { user, zustandState } = setup({
            overrideZustandState: {
              query: {
                collection: {
                  byId: {
                    'C1000-EDSC': {
                      granules: {
                        sortKey: granuleSortKeys.startDateDescending
                      }
                    }
                  }
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Start Date (Newest)' })
          await user.click(sortSelect)

          const option = await screen.findByText('End Date, Newest First')
          await user.click(option)

          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledTimes(1)
          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledWith({
            collectionId: 'C1000-EDSC',
            query: {
              sortKey: granuleSortKeys.endDateDescending
            }
          })
        })
      })

      describe('when selecting End Date, Oldest First', () => {
        test('calls onApplyGranuleFilters', async () => {
          useLocation.mockReturnValue({
            pathname: '/search/granules',
            search: '?p=C1000-EDSC'
          })

          const { user, zustandState } = setup({
            overrideZustandState: {
              query: {
                collection: {
                  byId: {
                    'C1000-EDSC': {
                      granules: {
                        sortKey: granuleSortKeys.startDateDescending
                      }
                    }
                  }
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const sortSelect = screen.getByRole('button', { name: 'Sort: Start Date (Newest)' })
          await user.click(sortSelect)

          const option = await screen.findByText('End Date, Oldest First')
          await user.click(option)

          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledTimes(1)
          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledWith({
            collectionId: 'C1000-EDSC',
            query: {
              sortKey: granuleSortKeys.endDateAscending
            }
          })
        })
      })
    })

    describe('when changing the granule view', () => {
      describe('when selecting Table', () => {
        test('updates GranuleResultsBodyContainer', async () => {
          const { user } = setup({
            overrideRouterEntries: ['/search/granules']
          })

          const openPanel = screen.getByTestId('panel-group_granule-results')
          const sortSelect = within(openPanel).getByRole('button', { name: 'View: List' })
          await user.click(sortSelect)

          GranuleResultsBodyContainer.mockClear()

          const option = await screen.findByText('Table')
          await user.click(option)

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
            overrideZustandState: {
              user: {
                sitePreferences: {
                  granuleListView: 'table'
                }
              }
            },
            overrideRouterEntries: ['/search/granules']
          })

          const openPanel = screen.getByTestId('panel-group_granule-results')
          const sortSelect = within(openPanel).getByRole('button', { name: 'View: Table' })
          await user.click(sortSelect)

          GranuleResultsBodyContainer.mockClear()

          const option = await screen.findByText('List')
          await user.click(option)

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
      test('calls setCollectionId', async () => {
        const { user, zustandState } = setup({
          overrideRouterEntries: ['/search/granules']
        })

        const link = screen.getByText('Search Results (1 Collections)')
        await user.click(link)

        expect(zustandState.collection.setCollectionId).toHaveBeenCalledTimes(1)
        expect(zustandState.collection.setCollectionId).toHaveBeenCalledWith(null)
      })
    })

    describe('when the collection is OpenSearch', () => {
      test('renders the OpenSearch header', () => {
        setup({
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                'C1000-EDSC': {
                  hasAllMetadata: true,
                  title: 'Collection Title',
                  conceptId: 'C1000-EDSC',
                  isCSDA: false,
                  isOpenSearch: true,
                  consortiums: ['CEOS']
                }
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
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  'C1000-EDSC': {
                    hasAllMetadata: true,
                    title: 'Collection Title',
                    conceptId: 'C1000-EDSC',
                    isCSDA: false,
                    isOpenSearch: true,
                    consortiums: ['CEOS']
                  }
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
          overrideZustandState: {
            collection: {
              collectionMetadata: {
                'C1000-EDSC': {
                  hasAllMetadata: true,
                  title: 'Collection Title',
                  conceptId: 'C1000-EDSC',
                  isCSDA: true,
                  isOpenSearch: false
                }
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
            overrideZustandState: {
              collection: {
                collectionMetadata: {
                  'C1000-EDSC': {
                    hasAllMetadata: true,
                    title: 'Collection Title',
                    conceptId: 'C1000-EDSC',
                    isCSDA: true,
                    isOpenSearch: false
                  }
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

    describe('when there is a focused granule', () => {
      test('renders the GranuleResultsFocusedMetaContainer component', () => {
        useLocation.mockReturnValue({
          pathname: '/search/granules',
          search: '?p=C1000-EDSC'
        })

        setup({
          overrideRouterEntries: ['/search/granules'],
          overrideZustandState: {
            granule: {
              granuleId: 'G-1234-TEST',
              granuleMetadata: {
                id: 'G-1234-TEST'
              }
            }
          }
        })

        // This is being rendered 2 times due to it being rendered through Panels
        expect(GranuleResultsFocusedMetaContainer).toHaveBeenCalledTimes(2)
        expect(GranuleResultsFocusedMetaContainer).toHaveBeenCalledWith({}, {})
      })
    })

    describe('when there is not a focused granule', () => {
      test('renders the GranuleResultsFocusedMetaContainer component', () => {
        useLocation.mockReturnValue({
          pathname: '/search/granules',
          search: '?p=C1000-EDSC'
        })

        setup({
          overrideRouterEntries: ['/search/granules']
        })

        expect(GranuleResultsFocusedMetaContainer).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('when on the /search/granules/collection-details route', () => {
    test('renders the CollectionDetailsBodyContainer', () => {
      useLocation.mockReturnValue({
        pathname: '/search/granules/collection-details',
        search: '?p=C1000-EDSC'
      })

      setup({
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
        content: 'https://search.earthdata.nasa.gov/search/granules/collection-details?p=C1000-EDSC'
      })

      expect(helmet.linkTags[0]).toEqual({
        rel: 'canonical',
        href: 'https://search.earthdata.nasa.gov/search/granules/collection-details?p=C1000-EDSC'
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

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBodyContainer).toHaveBeenCalledTimes(0)
    })

    describe('when clicking the Search Results breadcrumb', () => {
      test('calls setCollectionId', async () => {
        const { user, zustandState } = setup({
          overrideRouterEntries: ['/search/granules/collection-details']
        })

        const openPanel = screen.getByTestId('panel-group_granules-collections-results')
        const link = within(openPanel).getByRole('button', { name: 'Search Results (1 Collection)' })
        await user.click(link)

        expect(zustandState.collection.setCollectionId).toHaveBeenCalledTimes(1)
        expect(zustandState.collection.setCollectionId).toHaveBeenCalledWith(null)
      })
    })
  })

  describe('when on the /search/granules/granule-details route', () => {
    test('renders the GranuleDetailsBody', () => {
      useLocation.mockReturnValue({
        pathname: '/search/granules/granule-details',
        search: '?p=C1000-EDSC&g=G1000-EDSC'
      })

      setup({
        overrideZustandState: {
          granule: {
            granuleId: 'G1000-EDSC',
            granuleMetadata: {
              'G1000-EDSC': {
                conceptId: 'G1000-EDSC',
                title: 'Granule Title'
              }
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

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: true
      }), {})

      expect(SubscriptionsBodyContainer).toHaveBeenCalledTimes(0)
    })

    describe('when clicking the Search Results breadcrumb', () => {
      test('calls setCollectionId', async () => {
        const { user, zustandState } = setup({
          overrideRouterEntries: ['/search/granules/granule-details']
        })

        const openPanel = screen.getByTestId('panel-group_granule-details')
        const link = within(openPanel).getByRole('button', { name: 'Search Results' })
        await user.click(link)

        expect(zustandState.collection.setCollectionId).toHaveBeenCalledTimes(1)
        expect(zustandState.collection.setCollectionId).toHaveBeenCalledWith(null)
      })
    })
  })

  describe('when on the /search/granules/subscriptions route', () => {
    test('renders the SubscriptionsBodyContainer', () => {
      jest.spyOn(tinyCookie, 'get').mockReturnValue('mock-token')

      setup({
        overridePropsByRoute: {
          '/search/activePanel1?/:activePanel2?/*': {
            edlToken: 'mock-token'
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

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
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
      test('calls setCollectionId', async () => {
        const { user, zustandState } = setup({
          overrideRouterEntries: ['/search/granules/subscriptions']
        })

        const openPanel = screen.getByTestId('panel-group_granule-subscriptions')
        const link = within(openPanel).getByRole('button', { name: 'Search Results' })
        await user.click(link)

        expect(zustandState.collection.setCollectionId).toHaveBeenCalledTimes(1)
        expect(zustandState.collection.setCollectionId).toHaveBeenCalledWith(null)
      })
    })
  })

  describe('when on the /search/subscriptions route', () => {
    test('renders the SubscriptionsBodyContainer', () => {
      jest.spyOn(tinyCookie, 'get').mockReturnValue('mock-token')

      setup({
        overridePropsByRoute: {
          '/search/activePanel1?/:activePanel2?/*': {
            edlToken: 'mock-token'
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

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
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
      test('calls setCollectionId', async () => {
        const { user, zustandState } = setup({
          overrideRouterEntries: ['/search/subscriptions']
        })

        const openPanel = screen.getByTestId('panel-group_collection-subscriptions')
        const link = within(openPanel).getByRole('button', { name: 'Search Results' })
        await user.click(link)

        expect(zustandState.collection.setCollectionId).toHaveBeenCalledTimes(1)
        expect(zustandState.collection.setCollectionId).toHaveBeenCalledWith(null)
      })
    })
  })
})
