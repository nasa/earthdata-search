import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import getByTextWithMarkup from '../../../../../../jestConfigs/getByTextWithMarkup'

import GranuleResultsBody from '../GranuleResultsBody'
import GranuleResultsList from '../GranuleResultsList'
import GranuleResultsTable from '../GranuleResultsTable'
import Spinner from '../../Spinner/Spinner'

jest.mock('../GranuleResultsList', () => jest.fn(() => <div />))
jest.mock('../GranuleResultsTable', () => jest.fn(() => <div />))
jest.mock('../../Spinner/Spinner', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleResultsBody,
  defaultProps: {
    collectionId: 'collectionId',
    collectionTags: {},
    directDistributionInformation: {},
    focusedGranuleId: '',
    generateNotebook: {},
    granulesMetadata: {
      one: {
        id: 'two',
        browseFlag: true,
        onlineAccessFlag: true,
        dayNightFlag: 'DAY',
        formattedTemporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        thumbnail: '/fake/path/image.jpg',
        title: 'Granule title one',
        links: [
          {
            rel: 'http://linkrel/data#',
            title: 'linktitle',
            href: 'http://linkhref'
          }
        ]
      },
      two: {
        id: 'two',
        browseFlag: true,
        onlineAccessFlag: true,
        dayNightFlag: 'DAY',
        formattedTemporal: [
          '2019-04-28 00:00:00',
          '2019-04-29 23:59:59'
        ],
        thumbnail: '/fake/path/image.jpg',
        title: 'Granule title two',
        links: [
          {
            rel: 'http://linkrel/data#',
            title: 'linktitle',
            href: 'http://linkhref'
          }
        ]
      }
    },
    granuleSearchResults: {
      allIds: ['one', 'two'],
      hits: 2,
      isLoaded: true,
      isLoading: false,
      loadTime: 1123,
      timerStart: null
    },
    isOpenSearch: false,
    loadNextPage: jest.fn(),
    location: { search: 'value' },
    onGenerateNotebook: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onMetricsDataAccess: jest.fn(),
    onMetricsAddGranuleProject: jest.fn(),
    panelView: 'list',
    project: {}
  }
})

describe('GranuleResultsBody component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(GranuleResultsList).toHaveBeenCalledTimes(1)
    expect(GranuleResultsList).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      collectionTags: {},
      directDistributionInformation: {},
      excludedGranuleIds: [],
      focusedGranuleId: '',
      generateNotebook: {},
      granules: [{
        browseFlag: true,
        browseUrl: undefined,
        dataLinks: [{
          href: 'http://linkhref',
          rel: 'http://linkrel/data#',
          title: 'linktitle'
        }],
        dayNightFlag: 'DAY',
        formattedTemporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
        granuleThumbnail: '/fake/path/image.jpg',
        handleClick: expect.any(Function),
        handleMouseEnter: expect.any(Function),
        handleMouseLeave: expect.any(Function),
        id: 'two',
        isCollectionInProject: false,
        isFocusedGranule: false,
        isHoveredGranule: false,
        isInProject: false,
        isOpenSearch: undefined,
        links: [{
          href: 'http://linkhref',
          rel: 'http://linkrel/data#',
          title: 'linktitle'
        }],
        onlineAccessFlag: true,
        original: {
          browseFlag: true,
          dayNightFlag: 'DAY',
          formattedTemporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
          id: 'two',
          links: [{
            href: 'http://linkhref',
            rel: 'http://linkrel/data#',
            title: 'linktitle'
          }],
          onlineAccessFlag: true,
          thumbnail: '/fake/path/image.jpg',
          title: 'Granule title one'
        },
        s3Links: [],
        temporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
        thumbnail: '/fake/path/image.jpg',
        timeEnd: '2019-04-29 23:59:59',
        timeStart: '2019-04-28 00:00:00',
        title: 'Granule title one'
      }, {
        browseFlag: true,
        browseUrl: undefined,
        dataLinks: [{
          href: 'http://linkhref',
          rel: 'http://linkrel/data#',
          title: 'linktitle'
        }],
        dayNightFlag: 'DAY',
        formattedTemporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
        granuleThumbnail: '/fake/path/image.jpg',
        handleClick: expect.any(Function),
        handleMouseEnter: expect.any(Function),
        handleMouseLeave: expect.any(Function),
        id: 'two',
        isCollectionInProject: false,
        isFocusedGranule: false,
        isHoveredGranule: false,
        isInProject: false,
        isOpenSearch: undefined,
        links: [{
          href: 'http://linkhref',
          rel: 'http://linkrel/data#',
          title: 'linktitle'
        }],
        onlineAccessFlag: true,
        original: {
          browseFlag: true,
          dayNightFlag: 'DAY',
          formattedTemporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
          id: 'two',
          links: [{
            href: 'http://linkhref',
            rel: 'http://linkrel/data#',
            title: 'linktitle'
          }],
          onlineAccessFlag: true,
          thumbnail: '/fake/path/image.jpg',
          title: 'Granule title two'
        },
        s3Links: [],
        temporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
        thumbnail: '/fake/path/image.jpg',
        timeEnd: '2019-04-29 23:59:59',
        timeStart: '2019-04-28 00:00:00',
        title: 'Granule title two'
      }],
      isCollectionInProject: false,
      isGranuleInProject: expect.any(Function),
      isItemLoaded: expect.any(Function),
      isOpenSearch: false,
      itemCount: 2,
      loadMoreItems: expect.any(Function),
      location: { search: 'value' },
      onFocusedGranuleChange: expect.any(Function),
      onGenerateNotebook: expect.any(Function),
      onMetricsAddGranuleProject: expect.any(Function),
      onMetricsDataAccess: expect.any(Function),
      readableGranuleName: [''],
      setVisibleMiddleIndex: expect.any(Function),
      visibleMiddleIndex: null
    }, {})
  })

  test('renders GranuleResultsTable', () => {
    setup({
      overrideProps: {
        panelView: 'table'
      }
    })

    expect(GranuleResultsTable).toHaveBeenCalledTimes(1)
    expect(GranuleResultsTable).toHaveBeenCalledWith({
      collectionId: 'collectionId',
      collectionTags: {},
      directDistributionInformation: {},
      excludedGranuleIds: [],
      focusedGranuleId: '',
      generateNotebook: {},
      granules: [{
        browseFlag: true,
        browseUrl: undefined,
        dataLinks: [{
          href: 'http://linkhref',
          rel: 'http://linkrel/data#',
          title: 'linktitle'
        }],
        dayNightFlag: 'DAY',
        formattedTemporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
        granuleThumbnail: '/fake/path/image.jpg',
        handleClick: expect.any(Function),
        handleMouseEnter: expect.any(Function),
        handleMouseLeave: expect.any(Function),
        id: 'two',
        isCollectionInProject: false,
        isFocusedGranule: false,
        isHoveredGranule: false,
        isInProject: false,
        isOpenSearch: undefined,
        links: [{
          href: 'http://linkhref',
          rel: 'http://linkrel/data#',
          title: 'linktitle'
        }],
        onlineAccessFlag: true,
        original: {
          browseFlag: true,
          dayNightFlag: 'DAY',
          formattedTemporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
          id: 'two',
          links: [{
            href: 'http://linkhref',
            rel: 'http://linkrel/data#',
            title: 'linktitle'
          }],
          onlineAccessFlag: true,
          thumbnail: '/fake/path/image.jpg',
          title: 'Granule title one'
        },
        s3Links: [],
        temporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
        thumbnail: '/fake/path/image.jpg',
        timeEnd: '2019-04-29 23:59:59',
        timeStart: '2019-04-28 00:00:00',
        title: 'Granule title one'
      }, {
        browseFlag: true,
        browseUrl: undefined,
        dataLinks: [{
          href: 'http://linkhref',
          rel: 'http://linkrel/data#',
          title: 'linktitle'
        }],
        dayNightFlag: 'DAY',
        formattedTemporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
        granuleThumbnail: '/fake/path/image.jpg',
        handleClick: expect.any(Function),
        handleMouseEnter: expect.any(Function),
        handleMouseLeave: expect.any(Function),
        id: 'two',
        isCollectionInProject: false,
        isFocusedGranule: false,
        isHoveredGranule: false,
        isInProject: false,
        isOpenSearch: undefined,
        links: [{
          href: 'http://linkhref',
          rel: 'http://linkrel/data#',
          title: 'linktitle'
        }],
        onlineAccessFlag: true,
        original: {
          browseFlag: true,
          dayNightFlag: 'DAY',
          formattedTemporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
          id: 'two',
          links: [{
            href: 'http://linkhref',
            rel: 'http://linkrel/data#',
            title: 'linktitle'
          }],
          onlineAccessFlag: true,
          thumbnail: '/fake/path/image.jpg',
          title: 'Granule title two'
        },
        s3Links: [],
        temporal: ['2019-04-28 00:00:00', '2019-04-29 23:59:59'],
        thumbnail: '/fake/path/image.jpg',
        timeEnd: '2019-04-29 23:59:59',
        timeStart: '2019-04-28 00:00:00',
        title: 'Granule title two'
      }],
      isCollectionInProject: false,
      isGranuleInProject: expect.any(Function),
      isItemLoaded: expect.any(Function),
      isOpenSearch: false,
      itemCount: 2,
      loadMoreItems: expect.any(Function),
      location: { search: 'value' },
      onFocusedGranuleChange: expect.any(Function),
      onGenerateNotebook: expect.any(Function),
      onMetricsAddGranuleProject: expect.any(Function),
      onMetricsDataAccess: expect.any(Function),
      setVisibleMiddleIndex: expect.any(Function),
      visibleMiddleIndex: null
    }, {})
  })

  describe('when the first granules are loading', () => {
    test('adds a dummy item to the list', () => {
      setup({
        overrideProps: {
          granuleSearchResults: {
            allIds: [],
            isLoading: true
          }
        }
      })

      expect(GranuleResultsList).toHaveBeenCalledTimes(1)
      expect(GranuleResultsList).toHaveBeenCalledWith(expect.objectContaining({
        granules: [],
        itemCount: 1
      }), {})
    })
  })

  describe('when there are more pages to be loaded', () => {
    test('adds a dummy item to the list', () => {
      setup({
        overrideProps: {
          granuleSearchResults: {
            allIds: ['one', 'two'],
            granuleHits: 10
          }
        }
      })

      expect(GranuleResultsList).toHaveBeenCalledTimes(1)
      expect(GranuleResultsList).toHaveBeenCalledWith(expect.objectContaining({
        itemCount: 3
      }), {})
    })
  })

  describe('when all collections are loaded', () => {
    test('does not add a dummy item ', () => {
      setup({
        overrideProps: {
          granulesMetadata: {
            one: {
              id: 'two',
              browseFlag: true,
              onlineAccessFlag: true,
              dayNightFlag: 'DAY',
              formattedTemporal: [
                '2019-04-28 00:00:00',
                '2019-04-29 23:59:59'
              ],
              thumbnail: '/fake/path/image.jpg',
              title: 'Granule title one',
              links: [
                {
                  rel: 'http://linkrel/data#',
                  title: 'linktitle',
                  href: 'http://linkhref'
                }
              ]
            }
          },
          granuleQuery: {},
          granuleSearchResults: {
            allIds: ['one'],
            hits: 1,
            isLoaded: true,
            isLoading: false,
            loadTime: 1123,
            timerStart: null
          }
        }
      })

      expect(GranuleResultsList).toHaveBeenCalledTimes(1)
      expect(GranuleResultsList).toHaveBeenCalledWith(expect.objectContaining({
        itemCount: 1
      }), {})
    })
  })

  describe('search time', () => {
    test('renders the correct search time', () => {
      setup()

      expect(getByTextWithMarkup('Search Time: 1.1s')).toBeInTheDocument()
    })

    test('renders a spinner when the page is loading', () => {
      setup({
        overrideProps: {
          granuleSearchResults: {
            loadTime: undefined,
            isLoading: true,
            isLoaded: false
          }
        }
      })

      expect(Spinner).toHaveBeenCalledTimes(1)
      expect(Spinner).toHaveBeenCalledWith({
        type: 'dots',
        size: 'x-tiny'
      }, {})

      expect(screen.getByText('Search Time:')).toBeInTheDocument()
    })

    test('renders a spinner before the page has started loading', () => {
      setup({
        overrideProps: {
          granuleSearchResults: {}
        }
      })

      expect(Spinner).toHaveBeenCalledTimes(1)
      expect(Spinner).toHaveBeenCalledWith({
        type: 'dots',
        size: 'x-tiny'
      }, {})

      expect(screen.getByText('Search Time:')).toBeInTheDocument()
    })
  })

  describe('isItemLoaded', () => {
    describe('when there is no next page', () => {
      test('returns true', () => {
        setup({
          overrideProps: {
            granulesMetadata: {
              one: {
                id: 'one',
                browseFlag: true,
                onlineAccessFlag: true,
                dayNightFlag: 'DAY',
                formattedTemporal: [
                  '2019-04-28 00:00:00',
                  '2019-04-29 23:59:59'
                ],
                thumbnail: '/fake/path/image.jpg',
                title: 'Granule title one',
                links: [
                  {
                    rel: 'http://linkrel/data#',
                    title: 'linktitle',
                    href: 'http://linkhref'
                  }
                ]
              }
            },
            granuleSearchResults: {
              allIds: ['one'],
              hits: 1,
              isLoading: false,
              isLoaded: true,
              loadTime: 1150,
              timerStart: null
            }
          }
        })

        const result = GranuleResultsList.mock.calls[0][0].isItemLoaded(1)
        expect(result).toEqual(true)
      })
    })

    describe('when there is a next page and the item is not loaded', () => {
      test('returns false', () => {
        setup({
          overrideProps: {
            granulesMetadata: {
              one: {
                id: 'one',
                browseFlag: true,
                onlineAccessFlag: true,
                dayNightFlag: 'DAY',
                formattedTemporal: [
                  '2019-04-28 00:00:00',
                  '2019-04-29 23:59:59'
                ],
                thumbnail: '/fake/path/image.jpg',
                title: 'Granule title one',
                links: [
                  {
                    rel: 'http://linkrel/data#',
                    title: 'linktitle',
                    href: 'http://linkhref'
                  }
                ]
              }
            },
            granuleSearchResults: {
              allIds: ['one'],
              hits: 2,
              isLoading: false,
              isLoaded: true,
              loadTime: 1150,
              timerStart: null
            }
          }
        })

        const result = GranuleResultsList.mock.calls[0][0].isItemLoaded(2)
        expect(result).toEqual(false)
      })
    })
  })

  describe('isGranuleInProject', () => {
    test('when the granule is added to the project', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['collectionId'],
              byId: {
                collectionId: {
                  granules: {
                    addedGranuleIds: ['one']
                  }
                }
              }
            }
          }
        }
      })

      const one = GranuleResultsList.mock.calls[0][0].isGranuleInProject('one')
      expect(one).toEqual(true)

      const two = GranuleResultsList.mock.calls[0][0].isGranuleInProject('two')
      expect(two).toEqual(false)
    })

    test('when all granules are added to the project', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['collectionId'],
              byId: {
                collectionId: {}
              }
            }
          }
        }
      })

      const one = GranuleResultsList.mock.calls[0][0].isGranuleInProject('one')
      expect(one).toEqual(true)

      const two = GranuleResultsList.mock.calls[0][0].isGranuleInProject('two')
      expect(two).toEqual(true)
    })

    test('when granules are removed from the project', () => {
      setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['collectionId'],
              byId: {
                collectionId: {
                  granules: {
                    removedGranuleIds: ['one']
                  }
                }
              }
            }
          }
        }
      })

      const one = GranuleResultsList.mock.calls[0][0].isGranuleInProject('one')
      expect(one).toEqual(false)

      const two = GranuleResultsList.mock.calls[0][0].isGranuleInProject('two')
      expect(two).toEqual(true)
    })
  })
})
