import React from 'react'
import ReactDOM from 'react-dom'
import { screen, within } from '@testing-library/react'
import { useLocation } from 'react-router-dom'

import Helmet from 'react-helmet'
import * as tinyCookie from 'tiny-cookie'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import * as PortalUtils from '../../../util/portals'
import { collectionSortKeys } from '../../../constants/collectionSortKeys'
import { granuleSortKeys } from '../../../constants/granuleSortKeys'

import SearchPanels from '../SearchPanels'
import CollectionResultsBody from '../../CollectionResults/CollectionResultsBody'
import GranuleResultsBodyContainer from '../../../containers/GranuleResultsBodyContainer/GranuleResultsBodyContainer'
import SubscriptionsBody from '../../Subscriptions/SubscriptionsBody'
import GranuleDetailsBody from '../../GranuleDetails/GranuleDetailsBody'
import CollectionDetailsBody from '../../CollectionDetails/CollectionDetailsBody'
import GranuleResultsFocusedMeta from '../../GranuleResults/GranuleResultsFocusedMeta'

import { MODAL_NAMES } from '../../../constants/modalNames'
import { metricsCollectionSortChange } from '../../../util/metrics/metricsCollectionSortChange'

vi.mock('tiny-cookie', () => ({
  get: vi.fn().mockReturnValue('')
}))

vi.mock('../../../util/metrics/metricsCollectionSortChange', () => ({
  metricsCollectionSortChange: vi.fn()
}))

vi.mock('../../CollectionResults/CollectionResultsBody', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../../../containers/GranuleResultsBodyContainer/GranuleResultsBodyContainer', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../../CollectionDetails/CollectionDetailsBody', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../../GranuleDetails/GranuleDetailsBody', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../../Subscriptions/SubscriptionsBody', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../../GranuleResults/GranuleResultsFocusedMeta', () => ({ default: vi.fn(() => <div />) }))

vi.mock('../../../../../../sharedUtils/config', () => ({
  getEnvironmentConfig: vi.fn().mockReturnValue({
    edscHost: 'https://search.earthdata.nasa.gov'
  }),
  getApplicationConfig: vi.fn().mockReturnValue({
    env: 'prod',
    defaultMaxOrderSize: 1000000
  })
}))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useLocation: vi.fn().mockReturnValue({
    pathname: '/search',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const mockExportCollections = vi.fn()
vi.mock('../../../hooks/useExportCollections', () => ({
  useExportCollections: () => ({
    exportCollections: mockExportCollections
  })
}))

const PAGE_ROUTE = '/search/:activePanel1?/:activePanel2?/*'

const setup = setupTest({
  ComponentsByRoute: {
    [PAGE_ROUTE]: SearchPanels
  },
  defaultPropsByRoute: {
    [PAGE_ROUTE]: {
      collectionSubscriptions: [],
      setCollectionId: vi.fn(),
      onTogglePanels: vi.fn(),
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
      setCollectionId: vi.fn()
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
      changeGranuleQuery: vi.fn(),
      changeQuery: vi.fn()
    },
    ui: {
      modals: {
        setOpenModal: vi.fn()
      }
    }
  },
  defaultRouterEntries: ['/search'],
  withRouter: true
})

beforeEach(() => {
  vi.spyOn(PortalUtils, 'isDefaultPortal').mockImplementation(() => true)

  ReactDOM.createPortal = vi.fn((dropdown) => dropdown)
})

delete window.location
window.location = { assign: vi.fn() }

describe('SearchPanels component', () => {
  describe('when on the /search route', () => {
    test('renders the CollectionResultsBody', async () => {
      setup()

      expect(CollectionResultsBody).toHaveBeenCalledTimes(2)
      expect(CollectionResultsBody).toHaveBeenLastCalledWith({
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

      expect(CollectionDetailsBody).toHaveBeenCalledTimes(2)
      expect(CollectionDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBody).toHaveBeenCalledTimes(0)
    })

    describe('when changing the collection sort', () => {
      describe('when selecting Relevance', () => {
        test('calls onChangeQuery and metricsCollectionSortChange', async () => {
          const { user, zustandState } = setup({
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

          expect(metricsCollectionSortChange).toHaveBeenCalledTimes(1)
          expect(metricsCollectionSortChange).toHaveBeenCalledWith({
            value: collectionSortKeys.scoreDescending
          })
        })
      })

      describe('when selecting Usage', () => {
        test('calls onChangeQuery and metricsCollectionSortChange', async () => {
          const { user, zustandState } = setup({
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

          expect(metricsCollectionSortChange).toHaveBeenCalledTimes(1)
          expect(metricsCollectionSortChange).toHaveBeenCalledWith({
            value: collectionSortKeys.usageDescending
          })
        })
      })

      describe('when selecting Recent Version', () => {
        test('calls onChangeQuery and metricsCollectionSortChange', async () => {
          const { user, zustandState } = setup({
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

          expect(metricsCollectionSortChange).toHaveBeenCalledTimes(1)
          expect(metricsCollectionSortChange).toHaveBeenCalledWith({
            value: collectionSortKeys.recentVersion
          })
        })
      })

      describe('when selecting Start Date', () => {
        test('calls onChangeQuery and metricsCollectionSortChange', async () => {
          const { user, zustandState } = setup({
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

          expect(metricsCollectionSortChange).toHaveBeenCalledTimes(1)
          expect(metricsCollectionSortChange).toHaveBeenCalledWith({
            value: collectionSortKeys.startDateAscending
          })
        })
      })

      describe('when selecting End Date', () => {
        test('calls onChangeQuery and metricsCollectionSortChange', async () => {
          const { user, zustandState } = setup({
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

          expect(metricsCollectionSortChange).toHaveBeenCalledTimes(1)
          expect(metricsCollectionSortChange).toHaveBeenCalledWith({
            value: collectionSortKeys.endDateDescending
          })
        })
      })
    })

    describe('when changing the collection view', () => {
      describe('when selecting Table', () => {
        test('updates CollectionResultsBody', async () => {
          const { user } = setup({
            overrideRouterEntries: ['/search']
          })

          const openPanel = screen.getByTestId('panel-group_collection-results')
          const sortSelect = within(openPanel).getByRole('button', { name: 'View: List' })
          await user.click(sortSelect)

          CollectionResultsBody.mockClear()

          const option = await screen.findByText('Table')
          await user.click(option)

          expect(CollectionResultsBody).toHaveBeenCalledTimes(1)
          expect(CollectionResultsBody).toHaveBeenLastCalledWith({
            isActive: true,
            panelScrollableNodeRef: { current: null },
            panelView: 'table'
          }, {})
        })
      })

      describe('when selecting List', () => {
        test('updates CollectionResultsBody', async () => {
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

          CollectionResultsBody.mockClear()

          const option = await screen.findByText('List')
          await user.click(option)

          expect(CollectionResultsBody).toHaveBeenCalledTimes(1)
          expect(CollectionResultsBody).toHaveBeenLastCalledWith({
            isActive: true,
            panelScrollableNodeRef: { current: null },
            panelView: 'list'
          }, {})
        })
      })
    })

    describe('when exporting collections', () => {
      describe('when exporting CSV', () => {
        test('calls exportCollections', async () => {
          const { user } = setup()

          const button = screen.getAllByRole('button', { name: 'More actions' })[0]
          await user.click(button)

          const exportButton = screen.getByRole('button', { name: 'Export CSV' })
          await user.click(exportButton)

          expect(mockExportCollections).toHaveBeenCalledTimes(1)
          expect(mockExportCollections).toHaveBeenCalledWith('csv')
        })
      })

      describe('when exporting JSON', () => {
        test('calls exportCollections', async () => {
          const { user } = setup()

          const button = screen.getAllByRole('button', { name: 'More actions' })[0]
          await user.click(button)

          const exportButton = screen.getByRole('button', { name: 'Export JSON' })
          await user.click(exportButton)

          expect(mockExportCollections).toHaveBeenCalledTimes(1)
          expect(mockExportCollections).toHaveBeenCalledWith('json')
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

      expect(CollectionResultsBody).toHaveBeenCalledTimes(2)
      expect(CollectionResultsBody).toHaveBeenLastCalledWith({
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

      expect(CollectionDetailsBody).toHaveBeenCalledTimes(2)
      expect(CollectionDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBody).toHaveBeenCalledTimes(0)
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
        test('calls setOpenModal', async () => {
          const { user, zustandState } = setup({
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

          expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
          expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(MODAL_NAMES.ABOUT_CWIC)
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
        test('calls setOpenModal', async () => {
          const { user, zustandState } = setup({
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

          expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
          expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(MODAL_NAMES.ABOUT_CSDA)
        })
      })
    })

    describe('when there is a focused granule', () => {
      test('renders the GranuleResultsFocusedMeta component', () => {
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
        expect(GranuleResultsFocusedMeta).toHaveBeenCalledTimes(2)
        expect(GranuleResultsFocusedMeta).toHaveBeenCalledWith({}, {})
      })
    })

    describe('when there is not a focused granule', () => {
      test('renders the GranuleResultsFocusedMeta component', () => {
        useLocation.mockReturnValue({
          pathname: '/search/granules',
          search: '?p=C1000-EDSC'
        })

        setup({
          overrideRouterEntries: ['/search/granules']
        })

        expect(GranuleResultsFocusedMeta).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('when on the /search/granules/collection-details route', () => {
    test('renders the CollectionDetailsBody', () => {
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

      expect(CollectionResultsBody).toHaveBeenCalledTimes(2)
      expect(CollectionResultsBody).toHaveBeenLastCalledWith({
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

      expect(CollectionDetailsBody).toHaveBeenCalledTimes(2)
      expect(CollectionDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: true
      }), {})

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBody).toHaveBeenCalledTimes(0)
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

      expect(CollectionResultsBody).toHaveBeenCalledTimes(2)
      expect(CollectionResultsBody).toHaveBeenLastCalledWith({
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

      expect(CollectionDetailsBody).toHaveBeenCalledTimes(2)
      expect(CollectionDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: true
      }), {})

      expect(SubscriptionsBody).toHaveBeenCalledTimes(0)
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
    test('renders the SubscriptionsBody', () => {
      vi.spyOn(tinyCookie, 'get').mockReturnValue('mock-token')

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

      expect(CollectionResultsBody).toHaveBeenCalledTimes(2)
      expect(CollectionResultsBody).toHaveBeenLastCalledWith({
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

      expect(CollectionDetailsBody).toHaveBeenCalledTimes(2)
      expect(CollectionDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBody).toHaveBeenCalledTimes(2)
      expect(SubscriptionsBody).toHaveBeenNthCalledWith(1, {
        subscriptionType: 'granule'
      }, {})

      expect(SubscriptionsBody).toHaveBeenNthCalledWith(2, {
        setSubscriptionCount: expect.any(Function),
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
    test('renders the SubscriptionsBody', () => {
      vi.spyOn(tinyCookie, 'get').mockReturnValue('mock-token')

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

      expect(CollectionResultsBody).toHaveBeenCalledTimes(2)
      expect(CollectionResultsBody).toHaveBeenLastCalledWith({
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

      expect(CollectionDetailsBody).toHaveBeenCalledTimes(2)
      expect(CollectionDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(GranuleDetailsBody).toHaveBeenCalledTimes(2)
      expect(GranuleDetailsBody).toHaveBeenLastCalledWith(expect.objectContaining({
        isActive: false
      }), {})

      expect(SubscriptionsBody).toHaveBeenCalledTimes(2)
      expect(SubscriptionsBody).toHaveBeenNthCalledWith(1, {
        subscriptionType: 'granule'
      }, {})

      expect(SubscriptionsBody).toHaveBeenNthCalledWith(2, {
        setSubscriptionCount: expect.any(Function),
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
