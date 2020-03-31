import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Timeline from '../Timeline'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    browser: {
      name: 'browser name'
    },
    collectionMetadata: {},
    temporalSearch: {},
    timeline: { intervals: {}, query: {} },
    showOverrideModal: false,
    pathname: '/search/granules',
    onChangeQuery: jest.fn(),
    onChangeTimelineQuery: jest.fn(),
    onToggleOverrideTemporalModal: jest.fn(),
    onMetricsTimeline: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<Timeline {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('Timeline component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()
    const timelineSection = enzymeWrapper.find('section')

    expect(timelineSection.prop('className')).toEqual('timeline')
  })

  describe('componentDidMount', () => {
    test('should update the timeline on componentDidMount', () => {
      const setTimelineCenterSpy = jest.spyOn(Timeline.prototype, 'setTimelineCenter')
      const setTimelineZoomSpy = jest.spyOn(Timeline.prototype, 'setTimelineZoom')
      const setTimelineTemporalSpy = jest.spyOn(Timeline.prototype, 'setTimelineTemporal')
      const setTimelineFocusSpy = jest.spyOn(Timeline.prototype, 'setTimelineFocus')

      setup()

      expect(setTimelineCenterSpy).toHaveBeenCalledTimes(1)
      expect(setTimelineZoomSpy).toHaveBeenCalledTimes(1)
      expect(setTimelineTemporalSpy).toHaveBeenCalledTimes(1)
      expect(setTimelineFocusSpy).toHaveBeenCalledTimes(1)
    })

    test('calls onToggleOverrideTemporalModal on page load if spatial and focus both exist', () => {
      jest.spyOn(Timeline.prototype, 'setTimelineCenter').mockImplementation(() => jest.fn())
      jest.spyOn(Timeline.prototype, 'setTimelineZoom').mockImplementation(() => jest.fn())
      jest.spyOn(Timeline.prototype, 'setTimelineTemporal').mockImplementation(() => jest.fn())
      jest.spyOn(Timeline.prototype, 'setTimelineFocus').mockImplementation(() => jest.fn())

      const { props } = setup({
        pathname: '/projects',
        showOverrideModal: true,
        temporalSearch: {
          endDate: '2019-06-21T19:34:23.865Z',
          startDate: '2018-12-28T15:56:46.870Z'
        },
        timeline: {
          intervals: {},
          query: {
            center: 1552425382,
            end: 1556668799.999,
            interval: 'day',
            start: 1554076800,
            endDate: '2020-09-11T21:16:22.000Z',
            startDate: '2017-09-09T21:16:22.000Z'
          }
        }
      })

      expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(1)
    })

    test('does not call onToggleOverrideTemporalModal on page load if spatial and focus don\'t both exist', () => {
      jest.spyOn(Timeline.prototype, 'setTimelineCenter').mockImplementation(() => jest.fn())
      jest.spyOn(Timeline.prototype, 'setTimelineZoom').mockImplementation(() => jest.fn())
      jest.spyOn(Timeline.prototype, 'setTimelineTemporal').mockImplementation(() => jest.fn())
      jest.spyOn(Timeline.prototype, 'setTimelineFocus').mockImplementation(() => jest.fn())

      const { props } = setup({
        pathname: '/projects',
        showOverrideModal: true,
        temporalSearch: {},
        timeline: {
          intervals: {},
          query: {
            center: 1552425382,
            end: 1556668799.999,
            interval: 'day',
            start: 1554076800,
            endDate: '2020-09-11T21:16:22.000Z',
            startDate: '2017-09-09T21:16:22.000Z'
          }
        }
      })

      expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(0)
    })
  })

  describe('componentWillReceiveProps', () => {
    test('when the timeline center is new', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.instance().$el.timeline = jest.fn(() => [])
      enzymeWrapper.setProps({
        collectionMetadata: {
          collectionId: {
            metadata: {
              id: 'collectionId',
              time_start: '2019-01-01T00:00:00.000Z',
              time_end: '2019-02-01T00:00:00.000Z',
              title: 'mock title'
            }
          }
        },
        timeline: {
          intervals: {},
          query: { center: 123456789 }
        }
      })

      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('center', 123456789000)
    })

    test('when the timeline zoom is new', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.instance().$el.timeline = jest.fn((method, value) => {
        if (!value) {
          return 'month'
        }
        return true
      })

      enzymeWrapper.setProps({
        collectionMetadata: {
          collectionId: {
            metadata: {
              id: 'collectionId',
              time_start: '2019-01-01T00:00:00.000Z',
              time_end: '2019-02-01T00:00:00.000Z',
              title: 'mock title'
            }
          }
        },
        timeline: {
          intervals: {},
          query: {
            center: 123456789,
            interval: 'day'
          }
        }
      })

      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('zoom')
      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('zoom', 4)
    })

    test('when the timeline focus is new', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.instance().$el.timeline = jest.fn((method, value) => {
        if (!value) {
          return [123, 456]
        }
        return true
      })

      enzymeWrapper.setProps({
        collectionMetadata: {
          collectionId: {
            metadata: {
              id: 'collectionId',
              time_start: '2019-01-01T00:00:00.000Z',
              time_end: '2019-02-01T00:00:00.000Z',
              title: 'mock title'
            }
          }
        },
        timeline: {
          intervals: {},
          query: {
            center: 123456789,
            end: 123457890,
            interval: 'day',
            start: 123456789
          }
        }
      })

      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('getFocus')
      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('focus', new Date(123456789 * 1000), new Date(123457890 * 1000))
    })

    test('when the timeline focus is removed', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.instance().$el.timeline = jest.fn((method, value) => {
        if (!value) {
          return [123, 456]
        }
        return true
      })

      enzymeWrapper.setProps({
        collectionMetadata: {
          collectionId: {
            metadata: {
              id: 'collectionId',
              time_start: '2019-01-01T00:00:00.000Z',
              time_end: '2019-02-01T00:00:00.000Z',
              title: 'mock title'
            }
          }
        },
        timeline: {
          intervals: {},
          query: {
            center: 123456789,
            end: 123457890,
            interval: 'day',
            start: 123456789
          }
        }
      })

      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('getFocus')
      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('focus', new Date(123456789 * 1000), new Date(123457890 * 1000))

      // Remove the focus
      enzymeWrapper.setProps({
        collectionMetadata: {
          collectionId: {
            metadata: {
              id: 'collectionId',
              time_start: '2019-01-01T00:00:00.000Z',
              time_end: '2019-02-01T00:00:00.000Z'
            }
          }
        },
        timeline: {
          intervals: {},
          query: {
            center: 123456789,
            interval: 'day'
          }
        }
      })

      expect(enzymeWrapper.instance().$el.timeline).not.toBeCalledWith('focus')
    })

    test('when the temporal search is added', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.instance().$el.timeline = jest.fn()

      const startDate = new Date('2019-01-01T00:00:00.000Z')
      const endDate = new Date('2019-02-01T00:00:00.000Z')

      enzymeWrapper.setProps({
        temporalSearch: {
          endDate: endDate.toISOString(),
          startDate: startDate.toISOString()
        }
      })

      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('setTemporal', [[startDate, endDate]])
    })

    test('when the temporal search is removed', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.instance().$el.timeline = jest.fn()

      const startDate = new Date('2019-01-01T00:00:00.000Z')
      const endDate = new Date('2019-02-01T00:00:00.000Z')

      // Add temporalSearch
      enzymeWrapper.setProps({
        temporalSearch: {
          endDate: endDate.toISOString(),
          startDate: startDate.toISOString()
        }
      })
      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('setTemporal', [[startDate, endDate]])

      // Remove temporalSearch
      enzymeWrapper.setProps({
        temporalSearch: {}
      })
      expect(enzymeWrapper.instance().$el.timeline).not.toBeCalledWith('setTemporal')
    })

    test('when the timeline granules are new', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.instance().$el.timeline = jest.fn((method, value) => {
        if (method === 'zoom' && !value) {
          return 'month'
        }
        return true
      })

      const start = new Date('2019-01-01T00:00:00.000Z')
      const end = new Date('2019-02-01T00:00:00.000Z')
      const metadata = {
        id: 'collectionId',
        time_start: start.toISOString(),
        time_end: end.toISOString(),
        title: 'Collection Title'
      }
      const intervals = [[
        1298937600,
        1304208000,
        3
      ]]
      enzymeWrapper.setProps({
        collectionMetadata: {
          [metadata.id]: {
            metadata
          }
        },
        timeline: {
          intervals: {
            collectionId: intervals
          },
          query: {
            endDate: new Date(1548979200000),
            interval: 'day',
            startDate: new Date(1546300800000)
          }
        }
      })

      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('rows', [{
        id: metadata.id,
        title: metadata.title
      }])
      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('data', metadata.id, {
        color: '#2ECC71',
        end: 1548979200,
        intervals,
        resolution: 'day',
        start: 1546300800
      })
    })

    test('when the collectionMetadata is removed', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.instance().$el.timeline = jest.fn((method, value) => {
        if (method === 'zoom' && !value) {
          return 'month'
        }
        return true
      })

      const start = new Date('2019-01-01T00:00:00.000Z')
      const end = new Date('2019-02-01T00:00:00.000Z')
      const metadata = {
        id: 'collectionId',
        time_start: start.toISOString(),
        time_end: end.toISOString(),
        title: 'Collection Title'
      }
      const intervals = [[
        1298937600,
        1304208000,
        3
      ]]

      // Add some intervals
      enzymeWrapper.setProps({
        collectionMetadata: {
          [metadata.id]: {
            metadata
          }
        },
        timeline: {
          intervals: {
            collectionId: intervals
          },
          query: {
            interval: 'day'
          }
        }
      })
      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('rows', [{
        id: metadata.id,
        title: metadata.title
      }])

      // remove the focused collection and intervals
      enzymeWrapper.setProps({
        collectionMetadata: {},
        timeline: {
          intervals: {},
          query: {
            interval: 'day'
          }
        }
      })
      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('rows', [])
    })

    test('when pathname changes and the override modal should be shown', () => {
      jest.spyOn(Timeline.prototype, 'setTimelineCenter').mockImplementation(() => jest.fn())
      jest.spyOn(Timeline.prototype, 'setTimelineZoom').mockImplementation(() => jest.fn())
      jest.spyOn(Timeline.prototype, 'setTimelineTemporal').mockImplementation(() => jest.fn())
      jest.spyOn(Timeline.prototype, 'setTimelineFocus').mockImplementation(() => jest.fn())

      const { enzymeWrapper, props } = setup({
        pathname: '/search/granules',
        showOverrideModal: false,
        temporalSearch: {
          endDate: '2019-06-21T19:34:23.865Z',
          startDate: '2018-12-28T15:56:46.870Z'
        },
        timeline: {
          intervals: {},
          query: {
            center: 1552425382,
            end: 1556668799.999,
            interval: 'day',
            start: 1554076800,
            endDate: '2020-09-11T21:16:22.000Z',
            startDate: '2017-09-09T21:16:22.000Z'
          }
        }
      })

      expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(0)

      enzymeWrapper.setProps({
        ...props,
        pathname: '/projects',
        showOverrideModal: true
      })

      expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(1)
    })
  })
})

describe('handleRangeChange', () => {
  test('when the center and zoom level changes', () => {
    const { enzymeWrapper, props } = setup()

    const endDate = '1970-01-01T00:00:00.000Z'
    const startDate = '1970-01-31T00:00:00.000Z'

    enzymeWrapper.instance().$el.timeline = jest.fn((method, value) => {
      if (method === 'center' && !value) {
        return 123456789000
      }
      return true
    })
    enzymeWrapper.instance().handleRangeChange(jest.fn(), new Date(startDate), new Date(endDate), 'month')

    expect(props.onChangeTimelineQuery.mock.calls.length).toBe(1)
    expect(props.onChangeTimelineQuery.mock.calls[0]).toEqual([{
      center: 123456789,
      endDate,
      interval: 'month',
      startDate
    }])
  })

  test('when the center changes but zoom does not', () => {
    const { enzymeWrapper, props } = setup()

    const endDate = '1970-01-01T00:00:00.000Z'
    const startDate = '1970-01-31T00:00:00.000Z'

    enzymeWrapper.instance().$el.timeline = jest.fn((method, value) => {
      if (method === 'center' && !value) {
        return 123456789000
      }
      if (method === 'zoom' && !value) {
        return 'day'
      }
      return true
    })

    enzymeWrapper.setProps({
      timeline: {
        intervals: {},
        query: {
          interval: 'day'
        }
      }
    })

    enzymeWrapper.instance().handleRangeChange(jest.fn(), new Date(startDate), new Date(endDate), 'day')

    expect(props.onChangeTimelineQuery.mock.calls.length).toBe(1)
    expect(props.onChangeTimelineQuery.mock.calls[0]).toEqual([{
      center: 123456789,
      endDate,
      interval: 'day',
      startDate
    }])
  })
})

describe('handleTemporalSet', () => {
  test('when temporal is added', () => {
    const { enzymeWrapper, props } = setup()
    const start = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const end = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'

    enzymeWrapper.instance().handleTemporalSet(jest.fn(), start, end)

    expect(props.onChangeQuery.mock.calls.length).toBe(1)
    expect(props.onChangeQuery.mock.calls[0]).toEqual([{
      collection: {
        temporal: {
          endDate: new Date(end).toISOString(),
          startDate: new Date(start).toISOString()
        }
      }
    }])
  })

  test('when temporal is removed', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.instance().handleTemporalSet(jest.fn(), undefined, undefined)

    expect(props.onChangeQuery.mock.calls.length).toBe(1)
    expect(props.onChangeQuery.mock.calls[0]).toEqual([{
      collection: {
        temporal: {}
      }
    }])
  })

  test('calls onToggleOverrideTemporalModal when setting temporal and focus already exists', () => {
    jest.spyOn(Timeline.prototype, 'setTimelineCenter').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineZoom').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineTemporal').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineFocus').mockImplementation(() => jest.fn())

    const { enzymeWrapper, props } = setup({
      pathname: '/projects',
      showOverrideModal: true,
      timeline: {
        intervals: {},
        query: {
          center: 1552425382,
          end: 1556668799.999,
          interval: 'day',
          start: 1554076800,
          endDate: '2020-09-11T21:16:22.000Z',
          startDate: '2017-09-09T21:16:22.000Z'
        }
      }
    })
    const start = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const end = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'

    enzymeWrapper.instance().handleTemporalSet(jest.fn(), start, end)

    expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(1)
  })

  test('does not call onToggleOverrideTemporalModal when setting temporal and focus does not exist', () => {
    jest.spyOn(Timeline.prototype, 'setTimelineCenter').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineZoom').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineTemporal').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineFocus').mockImplementation(() => jest.fn())

    const { enzymeWrapper, props } = setup({
      pathname: '/projects',
      showOverrideModal: true
    })
    const start = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const end = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'

    enzymeWrapper.instance().handleTemporalSet(jest.fn(), start, end)

    expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(0)
  })

  test('does not call onToggleOverrideTemporalModal when setting temporal and focus exists on the granules page', () => {
    jest.spyOn(Timeline.prototype, 'setTimelineCenter').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineZoom').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineTemporal').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineFocus').mockImplementation(() => jest.fn())

    const { enzymeWrapper, props } = setup({
      pathname: '/search/granules',
      showOverrideModal: false,
      timeline: {
        intervals: {},
        query: {
          center: 1552425382,
          end: 1556668799.999,
          interval: 'day',
          start: 1554076800,
          endDate: '2020-09-11T21:16:22.000Z',
          startDate: '2017-09-09T21:16:22.000Z'
        }
      }
    })
    const start = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const end = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'

    enzymeWrapper.instance().handleTemporalSet(jest.fn(), start, end)

    expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(0)
  })
})

describe('handleFocusChange', () => {
  test('when focus is added query is updated', () => {
    const { enzymeWrapper, props } = setup()
    const center = 1546300800

    enzymeWrapper.instance().$el.timeline = jest.fn((method, value) => {
      if (method === 'center' && !value) {
        return center
      }
      return true
    })

    const start = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const end = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')

    enzymeWrapper.instance().handleFocusChange(jest.fn(), start, end)

    expect(props.onChangeTimelineQuery.mock.calls.length).toBe(1)
    expect(props.onChangeTimelineQuery.mock.calls[0]).toEqual([{
      center: 1546301,
      end: end / 1000,
      start: start / 1000
    }])
  })

  test('when focus is removed query is updated', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.instance().handleFocusChange(jest.fn(), undefined, undefined)

    expect(props.onChangeTimelineQuery.mock.calls.length).toBe(1)
    expect(props.onChangeTimelineQuery.mock.calls[0]).toEqual([{
      end: undefined,
      start: undefined
    }])
  })

  test('calls onToggleOverrideTemporalModal when setting focuse and temporal already exists', () => {
    jest.spyOn(Timeline.prototype, 'setTimelineCenter').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineZoom').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineTemporal').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineFocus').mockImplementation(() => jest.fn())

    const { enzymeWrapper, props } = setup({
      pathname: '/projects',
      showOverrideModal: true,
      temporalSearch: {
        endDate: '2019-06-21T19:34:23.865Z',
        startDate: '2018-12-28T15:56:46.870Z'
      }
    })

    const start = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const end = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')

    enzymeWrapper.instance().handleFocusChange(jest.fn(), start, end)

    expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(1)
  })

  test('does not call onToggleOverrideTemporalModal when setting focus and temporal does not exist', () => {
    jest.spyOn(Timeline.prototype, 'setTimelineCenter').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineZoom').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineTemporal').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineFocus').mockImplementation(() => jest.fn())

    const { enzymeWrapper, props } = setup({
      pathname: '/projects',
      showOverrideModal: true
    })

    const start = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const end = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')

    enzymeWrapper.instance().handleFocusChange(jest.fn(), start, end)

    expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(0)
  })

  test('does not call onToggleOverrideTemporalModal when setting focus and temporal exists on the granules page', () => {
    jest.spyOn(Timeline.prototype, 'setTimelineCenter').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineZoom').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineTemporal').mockImplementation(() => jest.fn())
    jest.spyOn(Timeline.prototype, 'setTimelineFocus').mockImplementation(() => jest.fn())

    const { enzymeWrapper, props } = setup({
      pathname: '/search/granules',
      showOverrideModal: false,
      temporalSearch: {
        endDate: '2019-06-21T19:34:23.865Z',
        startDate: '2018-12-28T15:56:46.870Z'
      }
    })

    const start = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const end = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')

    enzymeWrapper.instance().handleFocusChange(jest.fn(), start, end)

    expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(0)
  })
})
