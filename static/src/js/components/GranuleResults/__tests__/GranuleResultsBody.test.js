import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GranuleResultsBody from '../GranuleResultsBody'
import GranuleResultsList from '../GranuleResultsList'
import GranuleResultsTable from '../GranuleResultsTable'

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  jest.clearAllMocks()
})

function setup(options = {
  mount: false
}, overrideProps) {
  const props = {
    collectionId: 'collectionId',
    directDistributionInformation: {},
    focusedGranuleId: '',
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
    granuleQuery: {},
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
    onAddGranuleToProjectCollection: jest.fn(),
    onExcludeGranule: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onMetricsDataAccess: jest.fn(),
    onRemoveGranuleFromProjectCollection: jest.fn(),
    panelView: 'list',
    portal: {},
    project: {},
    ...overrideProps
  }

  let enzymeWrapper

  if (options.mount) {
    enzymeWrapper = mount(<GranuleResultsBody {...props} />)
  } else {
    enzymeWrapper = shallow(<GranuleResultsBody {...props} />)
  }

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsBody component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper, props } = setup()

    const {
      collectionId,
      loadNextPage,
      onExcludeGranule,
      onFocusedGranuleChange,
      onMetricsDataAccess
    } = props

    const resultsList = enzymeWrapper.find(GranuleResultsList)

    expect(enzymeWrapper.exists()).toEqual(true)
    expect(enzymeWrapper.prop('className')).toBe('granule-results-body')

    expect(resultsList.props()).toEqual(expect.objectContaining({
      collectionId,
      itemCount: 2,
      loadMoreItems: loadNextPage,
      onExcludeGranule,
      onFocusedGranuleChange,
      onMetricsDataAccess,
      visibleMiddleIndex: null
    }))
  })

  test('renders GranuleResultsTable', () => {
    const { enzymeWrapper, props } = setup({
      panelView: 'table'
    })

    const {
      collectionId,
      loadNextPage,
      onExcludeGranule,
      onFocusedGranuleChange,
      onMetricsDataAccess
    } = props

    const resultsTable = enzymeWrapper.find(GranuleResultsTable)

    expect(resultsTable.props()).toEqual(expect.objectContaining({
      collectionId,
      itemCount: 2,
      loadMoreItems: loadNextPage,
      onExcludeGranule,
      onFocusedGranuleChange,
      onMetricsDataAccess,
      visibleMiddleIndex: null
    }))
  })

  test('adds a dummy item when the first granules are loading', () => {
    const { enzymeWrapper, props } = setup(true, {
      granuleSearchResults: {
        allIds: [],
        isLoading: true
      }
    })

    const resultsList = enzymeWrapper.find(GranuleResultsList)

    expect(resultsList.props()).toEqual(expect.objectContaining({
      granules: [],
      itemCount: 1
    }))

    resultsList.props().loadMoreItems()

    expect(props.loadNextPage).toHaveBeenCalledTimes(0)
  })

  test('adds a dummy item when new granules are loading', () => {
    const { enzymeWrapper, props } = setup()

    const resultsList = enzymeWrapper.find(GranuleResultsList)

    expect(resultsList.props()).toEqual(expect.objectContaining({
      itemCount: 2
    }))

    resultsList.props().loadMoreItems()

    expect(props.loadNextPage).toHaveBeenCalledTimes(1)
  })

  test('does not add a dummy item when all collections are loaded', () => {
    const { enzymeWrapper, props } = setup(true, {
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
    })

    const resultsList = enzymeWrapper.find(GranuleResultsList)

    expect(resultsList.props()).toEqual(expect.objectContaining({
      itemCount: 1
    }))

    resultsList.props().loadMoreItems()

    expect(props.loadNextPage).toHaveBeenCalledTimes(1)
  })

  test('passes the granules to a single GranuleResultsList component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleResultsList).length).toEqual(1)
    expect(enzymeWrapper.find(GranuleResultsList).props().granules[0]).toEqual(
      expect.objectContaining({
        title: 'Granule title one'
      })
    )

    expect(enzymeWrapper.find(GranuleResultsList).props().granules[1]).toEqual(
      expect.objectContaining({
        title: 'Granule title two'
      })
    )
  })

  test('passes the onMetricsDataAccess callback to the GranuleResultsList component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(GranuleResultsList).length).toEqual(1)
    expect(enzymeWrapper.find(GranuleResultsList).props().onMetricsDataAccess)
      .toEqual(props.onMetricsDataAccess)
  })

  test('renders the correct search time', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.granule-results-body__search-time-value').text()).toEqual('1.1s')
  })

  describe('isItemLoaded', () => {
    describe('when there is no next page', () => {
      test('returns true', () => {
        const { enzymeWrapper } = setup(true, {
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
        })

        const resultsList = enzymeWrapper.find(GranuleResultsList)

        expect(resultsList.props().isItemLoaded(1)).toEqual(true)
      })
    })

    describe('when there is a next page and the item is loaded', () => {
      test('returns false', () => {
        const { enzymeWrapper } = setup(true, {
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
        })

        const resultsList = enzymeWrapper.find(GranuleResultsList)

        expect(resultsList.props().isItemLoaded(2)).toEqual(false)
      })
    })
  })

  describe('isGranuleInProject', () => {
    test('when the granule is added to the project', () => {
      const { enzymeWrapper } = setup({}, {
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
      })

      const resultsList = enzymeWrapper.find(GranuleResultsList)
      expect(resultsList.prop('isGranuleInProject')('one')).toBe(true)
      expect(resultsList.prop('isGranuleInProject')('two')).toBe(false)
    })

    test('when all granules are added to the project', () => {
      const { enzymeWrapper } = setup({}, {
        project: {
          collections: {
            allIds: ['collectionId'],
            byId: {
              collectionId: {}
            }
          }
        }
      })

      const resultsList = enzymeWrapper.find(GranuleResultsList)
      expect(resultsList.prop('isGranuleInProject')('one')).toBe(true)
      expect(resultsList.prop('isGranuleInProject')('two')).toBe(true)
    })

    test('when granules are removed from the project', () => {
      const { enzymeWrapper } = setup({}, {
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
      })

      const resultsList = enzymeWrapper.find(GranuleResultsList)
      expect(resultsList.prop('isGranuleInProject')('one')).toBe(false)
      expect(resultsList.prop('isGranuleInProject')('two')).toBe(true)
    })
  })
})
