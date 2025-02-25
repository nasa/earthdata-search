import React from 'react'
import {
  render,
  screen,
  fireEvent,
  act
} from '@testing-library/react'
import MockDate from 'mockdate'
import EDSCTimeline from '@edsc/timeline'
import Timeline from '../Timeline'

const windowEventMap = {}

function setup(overrideProps) {
  const props = {
    browser: {
      name: 'browser name'
    },
    collectionMetadata: {
      collectionId: {
        timeStart: '2020-01-01',
        timeEnd: '2022-01-01',
        title: 'Test Collection'
      }
    },
    temporalSearch: {},
    timeline: {
      intervals: {},
      query: {
        center: 1609495200000
      }
    },
    showOverrideModal: false,
    pathname: '/search/granules',
    projectCollectionsIds: ['collectionId'],
    onChangeQuery: jest.fn(),
    onChangeTimelineQuery: jest.fn(),
    onToggleOverrideTemporalModal: jest.fn(),
    onMetricsTimeline: jest.fn(),
    onToggleTimeline: jest.fn(),
    isOpen: true,
    ...overrideProps
  }

  render(<Timeline {...props} />)

  return {
    props
  }
}

jest.mock('@edsc/timeline', () => jest.fn(() => <div data-testid="mock-timeline" />))

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
  window.addEventListener = jest.fn((event, cb) => {
    windowEventMap[event] = cb
  })

  window.removeEventListener = jest.fn()

  MockDate.set('2021-01-01T10:00:00.000Z')
})

afterEach(() => {
  MockDate.reset()
})

describe('Timeline component', () => {
  test('should render an EDSCTimeline component with the correct props', () => {
    setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    expect(timelineProps.center).toEqual(1609416000000)
    expect(timelineProps.zoom).toEqual(4)
    expect(timelineProps.minZoom).toEqual(1)
    expect(timelineProps.maxZoom).toEqual(5)
    expect(timelineProps.zoom).toEqual(4)
    expect(timelineProps.data).toEqual([])
    expect(timelineProps.focusedInterval).toEqual({})
    expect(timelineProps.temporalRange).toEqual({})
  })

  test('calls onToggleOverrideTemporalModal on page load if spatial and focus both exist', async () => {
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

    expect(props.onToggleOverrideTemporalModal).toHaveBeenCalledTimes(1)
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

    expect(props.onToggleOverrideTemporalModal).toHaveBeenCalledTimes(0)
  })

  test('converts timeline intervals into the correct format for EDSCTimeline', () => {
    setup({
      pathname: '/search/granules',
      collectionMetadata: {
        collectionId: {
          title: 'Test Collection',
          timeStart: '2017-09-09'
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

    const timelineProps = EDSCTimeline.mock.calls[0][0]
    expect(timelineProps.data).toEqual([{
      color: '#2ECC71',
      id: 'collectionId',
      intervals: [[1525132800000, 1618185600000]],
      title: 'Test Collection'
    }])
  })

  test('timeline displays on focused collection even when projectCollectionsIds is empty', () => {
    setup({
      pathname: '/search/granules', // Indicating it's not a project page
      collectionMetadata: {
        someCollection: {
          title: 'Some Collection',
          timeStart: '2017-09-09'
        }
      },
      projectCollectionsIds: [], // Empty project collections
      timeline: {
        intervals: {
          someCollection: [
            [1525132800, 1618185600]
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

    const timelineProps = EDSCTimeline.mock.calls[0][0]
    expect(timelineProps.data).toEqual([
      {
        color: '#2ECC71',
        id: 'someCollection',
        intervals: [[1525132800000, 1618185600000]],
        title: 'Some Collection'
      }
    ])
  })

  test('setup data creates the correct intervals in the correct order for EDSCTimeline', () => {
    setup({
      pathname: '/projects',
      collectionMetadata: {
        firstCollection: {
          title: '1st Collection',
          timeStart: '2017-09-09'
        },
        secondCollection: {
          title: '2nd Collection',
          timeStart: '2017-09-09'
        },
        thirdCollection: {
          title: '3rd Collection',
          timeStart: '2017-09-09'
        }
      },
      projectCollectionsIds: ['firstCollection', 'secondCollection', 'thirdCollection'],
      timeline: {
        intervals: {
          firstCollection: [
            [
              1525132800,
              1618185600,
              582637
            ]
          ],
          thirdCollection: [
            [
              1525132800,
              1618185600,
              582637
            ]
          ],
          secondCollection: [
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

    const timelineProps = EDSCTimeline.mock.calls[0][0]
    expect(timelineProps.data).toEqual([{
      color: '#2ECC71',
      id: 'firstCollection',
      intervals: [[1525132800000, 1618185600000]],
      title: '1st Collection'
    },
    {
      color: '#3498DB',
      id: 'secondCollection',
      intervals: [[1525132800000, 1618185600000]],
      title: '2nd Collection'
    },
    {
      color: '#E67E22',
      id: 'thirdCollection',
      intervals: [[1525132800000, 1618185600000]],
      title: '3rd Collection'
    }])
  })
})

describe('handleTimelineMoveEnd', () => {
  test('calls onChangeTimelineQuery with new values', () => {
    const { props } = setup()

    const timelineEnd = '1970-01-01T00:00:00.000Z'
    const timelineStart = '1970-01-31T00:00:00.000Z'
    const timelineProps = EDSCTimeline.mock.calls[0][0]

    act(() => {
      timelineProps.onTimelineMoveEnd({
        center: 123456789000,
        timelineStart,
        timelineEnd,
        zoom: 2
      })
    })

    expect(props.onChangeTimelineQuery).toHaveBeenCalledTimes(2)
    expect(props.onChangeTimelineQuery).toHaveBeenNthCalledWith(
      1,
      {
        center: 1609416000000,
        interval: 'year'
      }
    )

    expect(props.onChangeTimelineQuery).toHaveBeenNthCalledWith(
      2,
      {
        center: 123456789000,
        endDate: timelineEnd,
        interval: 'day',
        startDate: timelineStart
      }
    )
  })
})

describe('handleTemporalSet', () => {
  test('when temporal is added', () => {
    const { props } = setup()
    const temporalStart = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const temporalEnd = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'
    const timelineProps = EDSCTimeline.mock.calls[0][0]

    act(() => {
      timelineProps.onTemporalSet({
        temporalStart,
        temporalEnd
      })
    })

    expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
    expect(props.onChangeQuery).toHaveBeenCalledWith(
      {
        collection: {
          temporal: {
            endDate: new Date(temporalEnd).toISOString(),
            startDate: new Date(temporalStart).toISOString()
          }
        }
      }
    )
  })

  test('when temporal is removed', () => {
    const { props } = setup()

    const timelineProps = EDSCTimeline.mock.calls[0][0]
    act(() => {
      timelineProps.onTemporalSet({})
    })

    expect(props.onChangeQuery).toHaveBeenCalledTimes(1)
    expect(props.onChangeQuery).toHaveBeenCalledWith({
      collection: {
        temporal: {}
      }
    })
  })

  test('calls onToggleOverrideTemporalModal when setting temporal and focus already exists', () => {
    const { props } = setup({
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
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    const temporalStart = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const temporalEnd = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'
    act(() => {
      timelineProps.onTemporalSet({
        temporalStart,
        temporalEnd
      })
    })

    expect(props.onToggleOverrideTemporalModal).toHaveBeenCalledTimes(1)
  })

  test('does not call onToggleOverrideTemporalModal when setting temporal and focus does not exist', () => {
    const { props } = setup({
      pathname: '/projects',
      showOverrideModal: true
    })
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    const temporalStart = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const temporalEnd = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'
    act(() => {
      timelineProps.onTemporalSet({
        temporalStart,
        temporalEnd
      })
    })

    expect(props.onToggleOverrideTemporalModal).toHaveBeenCalledTimes(0)
  })

  test('does not call onToggleOverrideTemporalModal when setting temporal and focus exists on the granules page', () => {
    const { props } = setup({
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
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    const temporalStart = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const temporalEnd = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'
    act(() => {
      timelineProps.onTemporalSet({
        temporalStart,
        temporalEnd
      })
    })

    expect(props.onToggleOverrideTemporalModal).toHaveBeenCalledTimes(0)
  })
})

describe('handleFocusedSet', () => {
  test('when focus is added query is updated', () => {
    const { props } = setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    const focusedStart = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const focusedEnd = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')
    act(() => {
      timelineProps.onFocusedSet({
        focusedStart,
        focusedEnd
      })
    })

    expect(props.onChangeTimelineQuery).toHaveBeenCalledTimes(2)
    expect(props.onChangeTimelineQuery).toHaveBeenNthCalledWith(2, {
      center: 1609416000000,
      end: focusedEnd,
      start: focusedStart
    })
  })

  test('when focus is removed query is updated', () => {
    const { props } = setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    act(() => {
      timelineProps.onFocusedSet({})
    })

    expect(props.onChangeTimelineQuery).toHaveBeenCalledTimes(2)
    expect(props.onChangeTimelineQuery).toHaveBeenNthCalledWith(2, {
      end: undefined,
      start: undefined
    })
  })

  test('calls onToggleOverrideTemporalModal when setting focus and temporal already exists', () => {
    const { props } = setup({
      pathname: '/projects',
      showOverrideModal: true,
      temporalSearch: {
        endDate: '2019-06-21T19:34:23.865Z',
        startDate: '2018-12-28T15:56:46.870Z'
      }
    })
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    const focusedStart = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const focusedEnd = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')
    act(() => {
      timelineProps.onFocusedSet({
        focusedStart,
        focusedEnd
      })
    })

    expect(props.onToggleOverrideTemporalModal).toHaveBeenCalledTimes(1)
  })

  test('does not call onToggleOverrideTemporalModal when setting focus and temporal does not exist', () => {
    const { props } = setup({
      pathname: '/projects',
      showOverrideModal: true
    })
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    const focusedStart = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const focusedEnd = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')
    act(() => {
      timelineProps.onFocusedSet({
        focusedStart,
        focusedEnd
      })
    })

    expect(props.onToggleOverrideTemporalModal).toHaveBeenCalledTimes(0)
  })

  test('does not call onToggleOverrideTemporalModal when setting focus and temporal exists on the granules page', () => {
    const { props } = setup({
      pathname: '/search/granules',
      showOverrideModal: false,
      temporalSearch: {
        endDate: '2019-06-21T19:34:23.865Z',
        startDate: '2018-12-28T15:56:46.870Z'
      }
    })
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    const focusedStart = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const focusedEnd = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')
    act(() => {
      timelineProps.onFocusedSet({
        focusedStart,
        focusedEnd
      })
    })

    expect(props.onToggleOverrideTemporalModal).toHaveBeenCalledTimes(0)
  })
})

describe('handle toggleTimeline', () => {
  describe('when not on the project page', () => {
    test('close timeline by pressing t', () => {
      const { props } = setup()

      windowEventMap.keyup({
        key: 't',
        tagName: 'BODY',
        type: 'keyup',
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      })

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(1)
      expect(props.onToggleTimeline).toHaveBeenCalledWith(false)
    })

    test('open timeline by pressing t', () => {
      const { props } = setup({
        isOpen: false
      })

      windowEventMap.keyup({
        key: 't',
        tagName: 'BODY',
        type: 'keyup',
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      })

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(1)
      expect(props.onToggleTimeline).toHaveBeenCalledWith(true)
    })

    test('closes the timeline with the close button', () => {
      const { props } = setup()

      const button = screen.getByLabelText('Hide Timeline')
      fireEvent.click(button)

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(1)
      expect(props.onToggleTimeline).toHaveBeenCalledWith(false)
    })

    test('opens the timeline with the open button', () => {
      const { props } = setup({
        isOpen: false
      })

      const button = screen.getByLabelText('Show Timeline')
      fireEvent.click(button)

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(1)
      expect(props.onToggleTimeline).toHaveBeenCalledWith(true)
    })
  })

  describe('when on the project page', () => {
    test('does not close timeline by pressing t', () => {
      const { props } = setup({
        pathname: '/projects'
      })

      windowEventMap.keyup({
        key: 't',
        tagName: 'BODY',
        type: 'keyup',
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      })

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(0)
    })

    test('does not open timeline by pressing t', () => {
      const { props } = setup({
        pathname: '/projects'
      })

      windowEventMap.keyup({
        key: 't',
        tagName: 'BODY',
        type: 'keyup',
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      })

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(0)
    })

    test('does not show the close button', () => {
      setup({
        pathname: '/projects'
      })

      const closeButton = screen.queryByLabelText('Hide Timeline')
      expect(closeButton).not.toBeInTheDocument()
    })
  })
})

describe('Metrics methods', () => {
  test('oArrowKeyPan calls onMetricsTimeline(\'Left/Right Arrow Pan\')', () => {
    const { props } = setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    act(() => {
      timelineProps.onArrowKeyPan({})
    })

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Left/Right Arrow Pan')
  })

  test('onButtonPan calls onMetricsTimeline(\'Button Pan\')', () => {
    const { props } = setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    act(() => {
      timelineProps.onButtonPan({})
    })

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Button Pan')
  })

  test('onButtonZoom calls onMetricsTimeline(\'Button Zoom\')', () => {
    const { props } = setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    act(() => {
      timelineProps.onButtonZoom({})
    })

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Button Zoom')
  })

  test('onTemporalSet calls onMetricsTimeline(\'Created Temporal\')', () => {
    const { props } = setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    act(() => {
      timelineProps.onTemporalSet({})
    })

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Created Temporal')
  })

  test('onDragPan calls onMetricsTimeline(\'Dragging Pan\')', () => {
    const { props } = setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    act(() => {
      timelineProps.onDragPan({})
    })

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Dragging Pan')
  })

  test('onFocusedIntervalClick calls onMetricsTimeline(\'Click Label\')', () => {
    const { props } = setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    act(() => {
      timelineProps.onFocusedIntervalClick({})
    })

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Click Label')
  })

  test('onScrollPan calls onMetricsTimeline(\'Scroll Pan\')', () => {
    const { props } = setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    act(() => {
      timelineProps.onScrollPan({})
    })

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Scroll Pan')
  })

  test('onScrollZoom calls onMetricsTimeline(\'Scroll Zoom\')', () => {
    const { props } = setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    act(() => {
      timelineProps.onScrollZoom({})
    })

    expect(props.onMetricsTimeline).toHaveBeenCalledTimes(1)
    expect(props.onMetricsTimeline).toHaveBeenCalledWith('Scroll Zoom')
  })
})
