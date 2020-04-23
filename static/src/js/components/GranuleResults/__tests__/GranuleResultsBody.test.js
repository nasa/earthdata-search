import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GranuleResultsBody from '../GranuleResultsBody'
import GranuleResultsList from '../GranuleResultsList'

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  jest.clearAllMocks()
})

function setup(options = {
  mount: false
}) {
  const props = {
    collectionId: 'collectionId',
    excludedGranuleIds: [],
    focusedGranule: '',
    granules: {
      allIds: ['one', 'two'],
      byId: {
        one: {
          id: 'two',
          browse_flag: true,
          online_access_flag: true,
          day_night_flag: 'DAY',
          formatted_temporal: [
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
          browse_flag: true,
          online_access_flag: true,
          day_night_flag: 'DAY',
          formatted_temporal: [
            '2019-04-28 00:00:00',
            '2019-04-29 23:59:59'
          ],
          thumbnail: '/fake/path/image.jpg',
          title: 'Granule title twwo',
          links: [
            {
              rel: 'http://linkrel/data#',
              title: 'linktitle',
              href: 'http://linkhref'
            }
          ]
        }
      },
      hits: '2',
      isLoaded: true,
      isLoading: false,
      loadTime: 1123,
      timerStart: null
    },
    isCwic: false,
    loadNextPage: jest.fn(),
    location: { search: 'value' },
    onExcludeGranule: jest.fn(),
    onFocusedGranuleChange: jest.fn(),
    onMetricsDataAccess: jest.fn(),
    panelView: 'list'
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
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toEqual(true)
    expect(enzymeWrapper.prop('className')).toBe('granule-results-body')
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
        title: 'Granule title twwo'
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
    const { enzymeWrapper } = setup({
      focusedCollectionObject: {
        granules: {
          hits: 23,
          loadTime: 1524,
          isLoading: false,
          isLoaded: true,
          allIds: [
            123,
            456
          ],
          byId: {
            123: {
              title: '123'
            },
            456: {
              title: '456'
            }
          }
        }
      }
    })

    expect(enzymeWrapper.find('.granule-results-body__search-time-value').text()).toEqual('1.1s')
  })
})
