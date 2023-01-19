import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { act } from 'react-dom/test-utils'
import MockDate from 'mockdate'
import EDSCTimeline from '@edsc/timeline'

import Timeline from '../Timeline'

Enzyme.configure({ adapter: new Adapter() })

const windowEventMap = {}

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
    onToggleTimeline: jest.fn(),
    isOpen: true,
    ...overrideProps
  }

  const enzymeWrapper = mount(<Timeline {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
  window.addEventListener = jest.fn((event, cb) => {
    windowEventMap[event] = cb
  })
  window.removeEventListener = jest.fn()

  // MockDate is used here to overwrite the js Date object. This allows us to
  // mock changes needed to test the moment functions
  MockDate.set('2021-01-01T10:00:00.000Z')
})

afterEach(() => {
  MockDate.reset()
})

describe('Timeline component', () => {
  test('should render an EDSCTimeline component with the correct props', () => {
    const { enzymeWrapper } = setup()
    const timeline = enzymeWrapper.find(EDSCTimeline)

    expect(timeline.props().center).toEqual(1609495200000)
    expect(timeline.props().minZoom).toEqual(1)
    expect(timeline.props().maxZoom).toEqual(5)
    expect(timeline.props().zoom).toEqual(3)
    expect(timeline.props().data).toEqual([])
    expect(timeline.props().focusedInterval).toEqual({})
    expect(timeline.props().temporalRange).toEqual({})
  })

  test('calls onToggleOverrideTemporalModal on page load if spatial and focus both exist', () => {
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

  test('converts timeline intervals into the correct format for EDSCTimeline', () => {
    const { enzymeWrapper } = setup({
      pathname: '/search/granules',
      collectionMetadata: {
        collectionId: {
          title: 'Test Collection'
        }
      },
      timeline: {
        intervals: {
          collectionId: [
            [
              1525132800,
              1618185600,
              582637
            ]
          ]
        },
        query: {
          center: 1552425382,
          interval: 'day',
          endDate: '2020-09-11T21:16:22.000Z',
          startDate: '2017-09-09T21:16:22.000Z'
        }
      }
    })

    const timeline = enzymeWrapper.find(EDSCTimeline)
    expect(timeline.props().data).toEqual([{
      color: '#2ECC71',
      id: 'collectionId',
      intervals: [[1525132800000, 1618185600000]],
      title: 'Test Collection'
    }])
  })
})

describe('handleTimelineMoveEnd', () => {
  test('calls onChangeTimelineQuery with new values', () => {
    const { enzymeWrapper, props } = setup()

    const timelineEnd = '1970-01-01T00:00:00.000Z'
    const timelineStart = '1970-01-31T00:00:00.000Z'

    act(() => {
      enzymeWrapper.find(EDSCTimeline).invoke('onTimelineMoveEnd')({
        center: 123456789000,
        timelineStart,
        timelineEnd,
        zoom: 2
      })
    })

    expect(props.onChangeTimelineQuery.mock.calls.length).toBe(1)
    expect(props.onChangeTimelineQuery.mock.calls[0]).toEqual([{
      center: 123456789000,
      endDate: timelineEnd,
      interval: 'day',
      startDate: timelineStart
    }])
  })
})

describe('handleTemporalSet', () => {
  test('when temporal is added', () => {
    const { enzymeWrapper, props } = setup()
    const temporalStart = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const temporalEnd = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'

    enzymeWrapper.find(EDSCTimeline).invoke('onTemporalSet')({ temporalStart, temporalEnd })

    expect(props.onChangeQuery.mock.calls.length).toBe(1)
    expect(props.onChangeQuery.mock.calls[0]).toEqual([{
      collection: {
        temporal: {
          endDate: new Date(temporalEnd).toISOString(),
          startDate: new Date(temporalStart).toISOString()
        }
      }
    }])
  })

  test('when temporal is removed', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(EDSCTimeline).invoke('onTemporalSet')({})

    expect(props.onChangeQuery.mock.calls.length).toBe(1)
    expect(props.onChangeQuery.mock.calls[0]).toEqual([{
      collection: {
        temporal: {}
      }
    }])
  })

  test('calls onToggleOverrideTemporalModal when setting temporal and focus already exists', () => {
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
    const temporalStart = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const temporalEnd = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'

    enzymeWrapper.find(EDSCTimeline).invoke('onTemporalSet')({ temporalStart, temporalEnd })

    expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(1)
  })

  test('does not call onToggleOverrideTemporalModal when setting temporal and focus does not exist', () => {
    const { enzymeWrapper, props } = setup({
      pathname: '/projects',
      showOverrideModal: true
    })
    const temporalStart = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const temporalEnd = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'

    enzymeWrapper.find(EDSCTimeline).invoke('onTemporalSet')({ temporalStart, temporalEnd })

    expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(0)
  })

  test('does not call onToggleOverrideTemporalModal when setting temporal and focus exists on the granules page', () => {
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
    const temporalStart = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const temporalEnd = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'

    enzymeWrapper.find(EDSCTimeline).invoke('onTemporalSet')({ temporalStart, temporalEnd })

    expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(0)
  })
})

describe('handleFocusedSet', () => {
  test('when focus is added query is updated', () => {
    const { enzymeWrapper, props } = setup()

    const focusedStart = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const focusedEnd = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')

    enzymeWrapper.find(EDSCTimeline).invoke('onFocusedSet')({ focusedStart, focusedEnd })

    expect(props.onChangeTimelineQuery.mock.calls.length).toBe(1)
    expect(props.onChangeTimelineQuery.mock.calls[0]).toEqual([{
      center: 1609495200000,
      end: focusedEnd,
      start: focusedStart
    }])
  })

  test('when focus is removed query is updated', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(EDSCTimeline).invoke('onFocusedSet')({})

    expect(props.onChangeTimelineQuery.mock.calls.length).toBe(1)
    expect(props.onChangeTimelineQuery.mock.calls[0]).toEqual([{
      end: undefined,
      start: undefined
    }])
  })

  test('calls onToggleOverrideTemporalModal when setting focuse and temporal already exists', () => {
    const { enzymeWrapper, props } = setup({
      pathname: '/projects',
      showOverrideModal: true,
      temporalSearch: {
        endDate: '2019-06-21T19:34:23.865Z',
        startDate: '2018-12-28T15:56:46.870Z'
      }
    })

    const focusedStart = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const focusedEnd = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')

    enzymeWrapper.find(EDSCTimeline).invoke('onFocusedSet')({ focusedStart, focusedEnd })

    expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(1)
  })

  test('does not call onToggleOverrideTemporalModal when setting focus and temporal does not exist', () => {
    const { enzymeWrapper, props } = setup({
      pathname: '/projects',
      showOverrideModal: true
    })

    const focusedStart = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const focusedEnd = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')

    enzymeWrapper.find(EDSCTimeline).invoke('onFocusedSet')({ focusedStart, focusedEnd })

    expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(0)
  })

  test('does not call onToggleOverrideTemporalModal when setting focus and temporal exists on the granules page', () => {
    const { enzymeWrapper, props } = setup({
      pathname: '/search/granules',
      showOverrideModal: false,
      temporalSearch: {
        endDate: '2019-06-21T19:34:23.865Z',
        startDate: '2018-12-28T15:56:46.870Z'
      }
    })

    const focusedStart = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const focusedEnd = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')

    enzymeWrapper.find(EDSCTimeline).invoke('onFocusedSet')({ focusedStart, focusedEnd })

    expect(props.onToggleOverrideTemporalModal).toBeCalledTimes(0)
  })
})

describe('handle toggleTimeline', () => {
  describe('when not on the project page', () => {
    test('close timeline by pressing t', () => {
      const { props, enzymeWrapper } = setup()
      const timelineSection = enzymeWrapper.find('section.timeline')

      expect(timelineSection.prop('className')).toEqual('timeline')

      const preventDefaultMock = jest.fn()
      const stopPropagationMock = jest.fn()

      windowEventMap.keyup({
        key: 't',
        tagName: 'body',
        type: 'keyup',
        preventDefault: preventDefaultMock,
        stopPropagation: stopPropagationMock
      })

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(1)
      expect(props.onToggleTimeline).toHaveBeenCalledWith(false)
    })

    test('open timeline by pressing t', () => {
      const { props, enzymeWrapper } = setup({
        isOpen: false
      })
      const timelineSection = enzymeWrapper.find('section.timeline')

      expect(timelineSection.prop('className')).toEqual('timeline timeline--is-hidden')

      const preventDefaultMock = jest.fn()
      const stopPropagationMock = jest.fn()
      windowEventMap.keyup({
        key: 't',
        tagName: 'body',
        type: 'keyup',
        preventDefault: preventDefaultMock,
        stopPropagation: stopPropagationMock
      })

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(1)
      expect(props.onToggleTimeline).toHaveBeenCalledWith(true)
    })

    test('closes the timeline with the close button', () => {
      const { props, enzymeWrapper } = setup()

      const button = enzymeWrapper.find('button.timeline__toggle-button--close')

      button.simulate('click')

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(1)
      expect(props.onToggleTimeline).toHaveBeenCalledWith(false)
    })

    test('opens the timeline with the open button', () => {
      const { props, enzymeWrapper } = setup({
        isOpen: false
      })

      const button = enzymeWrapper.find('button.timeline__toggle-button--open')

      button.simulate('click')

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(1)
      expect(props.onToggleTimeline).toHaveBeenCalledWith(true)
    })
  })

  describe('when on the project page', () => {
    test('does not close timeline by pressing t', () => {
      const { props, enzymeWrapper } = setup({
        pathname: '/projects'
      })
      const timelineSection = enzymeWrapper.find('section.timeline')

      expect(timelineSection.prop('className')).toEqual('timeline')

      const preventDefaultMock = jest.fn()
      const stopPropagationMock = jest.fn()

      windowEventMap.keyup({
        key: 't',
        tagName: 'body',
        type: 'keyup',
        preventDefault: preventDefaultMock,
        stopPropagation: stopPropagationMock
      })

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(0)
    })

    test('does not open timeline by pressing t', () => {
      const { props, enzymeWrapper } = setup({
        pathname: '/projects'
      })
      const timelineSection = enzymeWrapper.find('section.timeline')

      expect(timelineSection.prop('className')).toEqual('timeline')

      const preventDefaultMock = jest.fn()
      const stopPropagationMock = jest.fn()
      windowEventMap.keyup({
        key: 't',
        tagName: 'body',
        type: 'keyup',
        preventDefault: preventDefaultMock,
        stopPropagation: stopPropagationMock
      })

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(0)
    })

    test('does not show the close button', () => {
      const { enzymeWrapper } = setup({
        pathname: '/projects'
      })

      const button = enzymeWrapper.find('button.timeline__toggle-button--close')

      expect(button.length).toEqual(0)
    })
  })
})

describe('Metrics methods', () => {
  test('onArrowKeyPan calls onMetricsTimeline(\'Left/Right Arrow Pan\')', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(EDSCTimeline).invoke('onArrowKeyPan')({})

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Left/Right Arrow Pan')
  })

  test('onButtonPan calls onMetricsTimeline(\'Button Pan\')', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(EDSCTimeline).invoke('onButtonPan')({})

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Button Pan')
  })

  test('onButtonZoom calls onMetricsTimeline(\'Button Zoom\')', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(EDSCTimeline).invoke('onButtonZoom')({})

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Button Zoom')
  })

  test('onTemporalSet calls onMetricsTimeline(\'Created Temporal\')', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(EDSCTimeline).invoke('onTemporalSet')({})

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Created Temporal')
  })

  test('onDragPan calls onMetricsTimeline(\'Dragging Pan\')', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(EDSCTimeline).invoke('onDragPan')({})

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Dragging Pan')
  })

  test('onFocusedIntervalClick calls onMetricsTimeline(\'Click Label\')', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(EDSCTimeline).invoke('onFocusedIntervalClick')({})

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Click Label')
  })

  test('onScrollPan calls onMetricsTimeline(\'Scroll Pan\')', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(EDSCTimeline).invoke('onScrollPan')({})

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Scroll Pan')
  })

  test('onScrollZoom calls onMetricsTimeline(\'Scroll Zoom\')', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(EDSCTimeline).invoke('onScrollZoom')({})

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Scroll Zoom')
  })
})
