import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Timeline from '../Timeline'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    focusedCollection: '',
    focusedCollectionMetadata: {},
    temporalSearch: {},
    timeline: { query: {}, state: {} },
    onChangeQuery: jest.fn(),
    onChangeTimelineQuery: jest.fn(),
    onChangeTimelineState: jest.fn()
  }

  const enzymeWrapper = shallow(<Timeline {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('Timeline component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()
    const timelineSection = enzymeWrapper.find('section')

    expect(timelineSection.prop('className')).toEqual('timeline')
  })

  test('should not display timeline if there is no focusedCollection', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('section').prop('style')).toEqual({ display: 'none' })
    enzymeWrapper.setProps({
      focusedCollection: 'collectionId',
      focusedCollectionMetadata: {
        collectionId: {
          mock: 'metadata'
        }
      }
    })
    expect(enzymeWrapper.find('section').prop('style')).toEqual({ display: 'block' })

    enzymeWrapper.setProps({ focusedCollection: '', focusedCollectionMetadata: {} })
    expect(enzymeWrapper.find('section').prop('style')).toEqual({ display: 'none' })
  })

  describe('componentWillReceiveProps', () => {
    test('when the focusedCollection is new', () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.setProps({
        focusedCollection: 'collectionId',
        focusedCollectionMetadata: {
          collectionId: {
            id: 'collectionId',
            time_start: '2019-01-01T00:00:00.000Z',
            time_end: '2019-02-01T00:00:00.000Z'
          }
        }
      })

      expect(props.onChangeTimelineQuery.mock.calls.length).toBe(1)
      expect(props.onChangeTimelineQuery.mock.calls[0]).toEqual([{
        endDate: '2019-02-01T00:00:00.000Z',
        interval: 'day',
        startDate: '2019-01-01T00:00:00.000Z'
      }])
    })

    test('when the timeline center is new', () => {
      const { enzymeWrapper } = setup()
      enzymeWrapper.instance().$el.timeline = jest.fn()
      enzymeWrapper.setProps({
        focusedCollection: {
          collectionId: 'collectionId',
          metadata: {
            id: 'collectionId',
            time_start: '2019-01-01T00:00:00.000Z',
            time_end: '2019-02-01T00:00:00.000Z'
          }
        },
        timeline: {
          query: {},
          state: { center: '123456789' }
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
        focusedCollection: {
          collectionId: 'collectionId',
          metadata: {
            id: 'collectionId',
            time_start: '2019-01-01T00:00:00.000Z',
            time_end: '2019-02-01T00:00:00.000Z'
          }
        },
        timeline: {
          query: { interval: 'day' },
          state: { center: '123456789' }
        }
      })

      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('zoom')
      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('zoom', 4)
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
        focusedCollection: metadata.id,
        focusedCollectionMetadata: {
          [metadata.id]: metadata
        },
        timeline: {
          intervals,
          query: { interval: 'day' }
        }
      })

      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('rows', [{
        id: metadata.id,
        title: metadata.title
      }])
      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('data', metadata.id, {
        end: 1548979200,
        intervals,
        resolution: 'day',
        start: 1546300800
      })
    })

    test('when the focused collection is removed', () => {
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
        focusedCollection: metadata.id,
        focusedCollectionMetadata: {
          [metadata.id]: metadata
        },
        timeline: {
          intervals,
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
        focusedCollection: '',
        focusedCollectionMetadata: {},
        timeline: {
          intervals: [],
          query: {
            interval: 'day'
          }
        }
      })
      expect(enzymeWrapper.instance().$el.timeline).toBeCalledWith('rows', [])
    })
  })
})

describe('handleRangeChange', () => {
  test('when the center and zoom level changes', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.instance().$el.timeline = jest.fn((method, value) => {
      if (method === 'center' && !value) {
        return 123456789000
      }
      return true
    })
    enzymeWrapper.instance().handleRangeChange(jest.fn(), null, null, 'month')

    expect(props.onChangeTimelineState.mock.calls.length).toBe(1)
    expect(props.onChangeTimelineState.mock.calls[0]).toEqual([{
      center: 123456789
    }])
    expect(props.onChangeTimelineQuery.mock.calls.length).toBe(1)
    expect(props.onChangeTimelineQuery.mock.calls[0]).toEqual([{
      interval: 'month'
    }])
  })

  test('when the center changes but zoom does not', () => {
    const { enzymeWrapper, props } = setup()

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
        query: {
          interval: 'day'
        }
      }
    })

    enzymeWrapper.instance().handleRangeChange(jest.fn(), null, null, 'day')

    expect(props.onChangeTimelineState.mock.calls.length).toBe(1)
    expect(props.onChangeTimelineState.mock.calls[0]).toEqual([{
      center: 123456789
    }])
    expect(props.onChangeTimelineQuery.mock.calls.length).toBe(0)
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
      temporal: {
        endDate: new Date(end).toISOString(),
        startDate: new Date(start).toISOString()
      }
    }])
  })

  test('when temporal is removed', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.instance().handleTemporalSet(jest.fn(), undefined, undefined)

    expect(props.onChangeQuery.mock.calls.length).toBe(1)
    expect(props.onChangeQuery.mock.calls[0]).toEqual([{
      temporal: {}
    }])
  })
})
