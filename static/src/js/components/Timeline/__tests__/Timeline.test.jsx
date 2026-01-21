// We directly invoke EDSCTimeline callbacks in this test suite rather than using userEvents
// from testing-library to interact with the EDSCTimeline component. This approach
// allows us to focus on testing our Timeline component's behavior rather than the
// underlying third-party EDSCTimeline component functionality.

import React from 'react'
import { screen, act } from '@testing-library/react'
import MockDate from 'mockdate'
import EDSCTimeline from '@edsc/timeline'

import Timeline from '../Timeline'
import useEdscStore from '../../../zustand/useEdscStore'
import setupTest from '../../../../../../vitestConfigs/setupTest'
import { MODAL_NAMES } from '../../../constants/modalNames'
import { metricsTimeline } from '../../../util/metrics/metricsTimeline'

vi.mock('../../../util/metrics/metricsTimeline', () => ({
  metricsTimeline: vi.fn()
}))

vi.mock('@edsc/timeline', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: Timeline,
  defaultProps: {
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
    showOverrideModal: false,
    pathname: '/search/granules',
    projectCollectionsIds: ['collectionId'],
    onToggleTimeline: vi.fn(),
    isOpen: true
  },
  defaultZustandState: {
    query: {
      changeQuery: vi.fn()
    },
    timeline: {
      setQuery: vi.fn()
    },
    ui: {
      modals: {
        setOpenModal: vi.fn()
      }
    }
  }
})

beforeEach(() => {
  // MockDate is used here to overwrite the js Date object. This allows us to
  // mock changes needed to test the moment functions
  MockDate.set('2021-01-01T10:00:00.000Z')
})

afterEach(() => {
  MockDate.reset()
})

describe('Timeline component', () => {
  test('should render an EDSCTimeline component with the correct props', () => {
    setup()

    expect(EDSCTimeline).toHaveBeenCalledTimes(1)
    expect(EDSCTimeline).toHaveBeenCalledWith(expect.objectContaining({
      center: 1609416000000,
      zoom: 4,
      minZoom: 1,
      maxZoom: 5,
      data: [],
      focusedInterval: {},
      temporalRange: {}
    }), {})
  })

  test('calls setOpenModal on page load if spatial and focus both exist', async () => {
    const { zustandState } = setup({
      overrideProps: {
        pathname: '/projects',
        showOverrideModal: true
      },
      overrideZustandState: {
        query: {
          collection: {
            temporal: {
              endDate: '2019-06-21T19:34:23.865Z',
              startDate: '2018-12-28T15:56:46.870Z'
            }
          }
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
      }
    })

    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(MODAL_NAMES.OVERRIDE_TEMPORAL)
  })

  test('does not call setOpenModal on page load if spatial and focus don\'t both exist', () => {
    const { zustandState } = setup({
      overrideProps: {
        pathname: '/projects',
        showOverrideModal: true,
        temporalSearch: {}
      },
      overrideZustandState: {
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
      }
    })

    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(0)
  })

  test('converts timeline intervals into the correct format for EDSCTimeline', () => {
    setup({
      overrideProps: {
        pathname: '/search/granules',
        collectionMetadata: {
          collectionId: {
            title: 'Test Collection',
            timeStart: '2017-09-09'
          }
        }
      },
      overrideZustandState: {
        timeline: {
          getTimeline: vi.fn(),
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
      }
    })

    expect(EDSCTimeline).toHaveBeenCalledWith(expect.objectContaining({
      data: [{
        color: 'rgb(46, 204, 113, 1)',
        id: 'collectionId',
        intervals: [[1525132800000, 1618185600000]],
        title: 'Test Collection'
      }]
    }), {})
  })

  test('timeline displays on focused collection even when projectCollectionsIds is empty', () => {
    setup({
      overrideProps: {
        pathname: '/search/granules', // Indicating it's not a project page
        collectionMetadata: {
          someCollection: {
            title: 'Some Collection',
            timeStart: '2017-09-09'
          }
        },
        projectCollectionsIds: [] // Empty project collections
      },
      overrideZustandState: {
        timeline: {
          getTimeline: vi.fn(),
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
      }
    })

    expect(EDSCTimeline).toHaveBeenCalledWith(expect.objectContaining({
      data: [
        {
          color: 'rgb(46, 204, 113, 1)',
          id: 'someCollection',
          intervals: [[1525132800000, 1618185600000]],
          title: 'Some Collection'
        }
      ]
    }), {})
  })

  test('setup data creates the correct intervals in the correct order for EDSCTimeline', () => {
    setup({
      overrideProps: {
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
        projectCollectionsIds: ['firstCollection', 'secondCollection', 'thirdCollection']
      },
      overrideZustandState: {
        timeline: {
          getTimeline: vi.fn(),
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
      }
    })

    expect(EDSCTimeline).toHaveBeenCalledWith(expect.objectContaining({
      data: [{
        color: 'rgb(46, 204, 113, 1)',
        id: 'firstCollection',
        intervals: [[1525132800000, 1618185600000]],
        title: '1st Collection'
      },
      {
        color: 'rgb(52, 152, 219, 1)',
        id: 'secondCollection',
        intervals: [[1525132800000, 1618185600000]],
        title: '2nd Collection'
      },
      {
        color: 'rgb(230, 126, 34, 1)',
        id: 'thirdCollection',
        intervals: [[1525132800000, 1618185600000]],
        title: '3rd Collection'
      }]
    }), {})
  })
})

describe('handleTimelineMoveEnd', () => {
  test('calls timeline.setQuery with new values', async () => {
    setup({
      overrideZustandState: {
        timeline: {
          setQuery: vi.fn(),
          intervals: {},
          query: {}
        }
      }
    })

    const timelineEnd = '1970-01-01T00:00:00.000Z'
    const timelineStart = '1970-01-31T00:00:00.000Z'
    const timelineProps = EDSCTimeline.mock.calls[0][0]

    await act(() => {
      timelineProps.onTimelineMoveEnd({
        center: 123456789000,
        timelineStart,
        timelineEnd,
        zoom: 2
      })
    })

    const zustandState = useEdscStore.getState()
    const { timeline } = zustandState
    const { setQuery } = timeline
    expect(setQuery).toHaveBeenCalledTimes(2)
    expect(setQuery).toHaveBeenNthCalledWith(
      1,
      {
        center: 1609416000000,
        interval: 'year'
      }
    )

    expect(setQuery).toHaveBeenNthCalledWith(
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
  test('when temporal is added', async () => {
    const { zustandState } = setup()
    const temporalStart = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const temporalEnd = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'
    const timelineProps = EDSCTimeline.mock.calls[0][0]

    await act(() => {
      timelineProps.onTemporalSet({
        temporalStart,
        temporalEnd
      })
    })

    expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
    expect(zustandState.query.changeQuery).toHaveBeenCalledWith(
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

  test('when temporal is removed', async () => {
    const { zustandState } = setup()

    const timelineProps = EDSCTimeline.mock.calls[0][0]

    await act(() => {
      timelineProps.onTemporalSet({})
    })

    expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
    expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
      collection: {
        temporal: {}
      }
    })
  })

  test('calls setOpenModal when setting temporal and focus already exists', async () => {
    const { zustandState } = setup({
      overrideProps: {
        pathname: '/projects',
        showOverrideModal: true
      },
      overrideZustandState: {
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
      }
    })
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    const temporalStart = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const temporalEnd = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'

    await act(() => {
      timelineProps.onTemporalSet({
        temporalStart,
        temporalEnd
      })
    })

    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(MODAL_NAMES.OVERRIDE_TEMPORAL)
  })

  test('does not call setOpenModal when setting temporal and focus does not exist', async () => {
    const { zustandState } = setup({
      pathname: '/projects',
      showOverrideModal: true
    }, {
      timeline: {}
    })
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    const temporalStart = 'Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)'
    const temporalEnd = 'Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)'

    await act(() => {
      timelineProps.onTemporalSet({
        temporalStart,
        temporalEnd
      })
    })

    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(0)
  })

  test('does not call setOpenModal when setting temporal and focus exists on the granules page', async () => {
    const { zustandState } = setup({
      pathname: '/search/granules',
      showOverrideModal: false
    }, {
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

    await act(() => {
      timelineProps.onTemporalSet({
        temporalStart,
        temporalEnd
      })
    })

    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(0)
  })
})

describe('handleFocusedSet', () => {
  test('when focus is added query is updated', async () => {
    setup({
      overrideZustandState: {
        timeline: {
          setQuery: vi.fn()
        }
      }
    })

    const timelineProps = EDSCTimeline.mock.calls[0][0]
    const focusedStart = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const focusedEnd = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')

    await act(() => {
      timelineProps.onFocusedSet({
        focusedStart,
        focusedEnd
      })
    })

    const zustandState = useEdscStore.getState()
    const { timeline } = zustandState
    const { setQuery } = timeline
    expect(setQuery).toHaveBeenCalledTimes(2)
    expect(setQuery).toHaveBeenNthCalledWith(2, {
      center: 1609416000000,
      end: focusedEnd,
      start: focusedStart
    })
  })

  test('when focus is removed query is updated', async () => {
    setup({
      overrideZustandState: {
        timeline: {
          setQuery: vi.fn()
        }
      }
    })

    const timelineProps = EDSCTimeline.mock.calls[0][0]

    await act(() => {
      timelineProps.onFocusedSet({})
    })

    const zustandState = useEdscStore.getState()
    const { timeline } = zustandState
    const { setQuery } = timeline
    expect(setQuery).toHaveBeenCalledTimes(2)
    expect(setQuery).toHaveBeenNthCalledWith(2, {
      end: undefined,
      start: undefined
    })
  })

  test('calls setOpenModal when setting focus and temporal already exists', async () => {
    const { zustandState } = setup({
      overrideProps: {
        pathname: '/projects',
        showOverrideModal: true
      },
      overrideZustandState: {
        query: {
          collection: {
            temporal: {
              endDate: '2019-06-21T19:34:23.865Z',
              startDate: '2018-12-28T15:56:46.870Z'
            }
          }
        }
      }
    })

    const timelineProps = EDSCTimeline.mock.calls[0][0]
    const focusedStart = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const focusedEnd = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')

    await act(() => {
      timelineProps.onFocusedSet({
        focusedStart,
        focusedEnd
      })
    })

    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(MODAL_NAMES.OVERRIDE_TEMPORAL)
  })

  test('does not call setOpenModal when setting focus and temporal does not exist', async () => {
    const { zustandState } = setup({
      pathname: '/projects',
      showOverrideModal: true
    })
    const timelineProps = EDSCTimeline.mock.calls[0][0]
    const focusedStart = new Date('Mon Dec 31 2018 19:00:00 GMT-0500 (Eastern Standard Time)')
    const focusedEnd = new Date('Thu Jan 31 2019 19:00:00 GMT-0500 (Eastern Standard Time)')

    await act(() => {
      timelineProps.onFocusedSet({
        focusedStart,
        focusedEnd
      })
    })

    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(0)
  })

  test('does not call setOpenModal when setting focus and temporal exists on the granules page', async () => {
    const { zustandState } = setup({
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

    await act(() => {
      timelineProps.onFocusedSet({
        focusedStart,
        focusedEnd
      })
    })

    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(0)
  })
})

describe('handle toggleTimeline', () => {
  describe('when not on the project page', () => {
    test('close timeline by pressing t', async () => {
      const { props, user } = setup()

      const timelineSection = screen.getByRole('region', { name: 'Timeline' })
      expect(timelineSection).not.toHaveClass('timeline--is-hidden')

      await user.keyboard('{t}')

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(1)
      expect(props.onToggleTimeline).toHaveBeenCalledWith(false)
    })

    test('open timeline by pressing t', async () => {
      const { props, user } = setup({
        overrideProps: {
          isOpen: false
        }
      })

      const timelineSection = screen.getByRole('region', { name: 'Timeline' })
      expect(timelineSection).toHaveClass('timeline--is-hidden')

      await user.keyboard('{t}')

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(1)
      expect(props.onToggleTimeline).toHaveBeenCalledWith(true)
    })

    test('closes the timeline with the close button', async () => {
      const { props, user } = setup()

      const button = screen.getByLabelText('Hide Timeline')
      await user.click(button)

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(1)
      expect(props.onToggleTimeline).toHaveBeenCalledWith(false)
    })

    test('opens the timeline with the open button', async () => {
      const { props, user } = setup({
        overrideProps: {
          isOpen: false
        }
      })

      const button = screen.getByLabelText('Show Timeline')
      await user.click(button)

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(1)
      expect(props.onToggleTimeline).toHaveBeenCalledWith(true)
    })
  })

  describe('when on the project page', () => {
    test('does not close timeline by pressing t', async () => {
      const { props, user } = setup({
        overrideProps: {
          pathname: '/projects'
        }
      })

      await user.keyboard('{t}')

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(0)
    })

    test('does not open timeline by pressing t', async () => {
      const { props, user } = setup({
        overrideProps: {
          pathname: '/projects'
        }
      })

      await user.keyboard('{t}')

      expect(props.onToggleTimeline).toHaveBeenCalledTimes(0)
    })

    test('does not show the close button', () => {
      setup({
        overrideProps: {
          pathname: '/projects'
        }
      })

      const closeButton = screen.queryByLabelText('Hide Timeline')
      expect(closeButton).not.toBeInTheDocument()
    })
  })
})

describe('Metrics methods', () => {
  test('oArrowKeyPan calls metricsTimeline(\'Left/Right Arrow Pan\')', async () => {
    setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]

    await act(() => {
      timelineProps.onArrowKeyPan({})
    })

    expect(metricsTimeline).toHaveBeenCalledTimes(1)
    expect(metricsTimeline).toHaveBeenCalledWith('Left/Right Arrow Pan')
  })

  test('onButtonPan calls metricsTimeline(\'Button Pan\')', async () => {
    setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]

    await act(() => {
      timelineProps.onButtonPan({})
    })

    expect(metricsTimeline).toHaveBeenCalledTimes(1)
    expect(metricsTimeline).toHaveBeenCalledWith('Button Pan')
  })

  test('onButtonZoom calls metricsTimeline(\'Button Zoom\')', async () => {
    setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]

    await act(() => {
      timelineProps.onButtonZoom({})
    })

    expect(metricsTimeline).toHaveBeenCalledTimes(1)
    expect(metricsTimeline).toHaveBeenCalledWith('Button Zoom')
  })

  test('onTemporalSet calls metricsTimeline(\'Created Temporal\')', async () => {
    setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]

    await act(() => {
      timelineProps.onTemporalSet({})
    })

    expect(metricsTimeline).toHaveBeenCalledTimes(1)
    expect(metricsTimeline).toHaveBeenCalledWith('Created Temporal')
  })

  test('onDragPan calls metricsTimeline(\'Dragging Pan\')', async () => {
    setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]

    await act(() => {
      timelineProps.onDragPan({})
    })

    expect(metricsTimeline).toHaveBeenCalledTimes(1)
    expect(metricsTimeline).toHaveBeenCalledWith('Dragging Pan')
  })

  test('onFocusedIntervalClick calls metricsTimeline(\'Click Label\')', async () => {
    setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]

    await act(() => {
      timelineProps.onFocusedIntervalClick({})
    })

    expect(metricsTimeline).toHaveBeenCalledTimes(1)
    expect(metricsTimeline).toHaveBeenCalledWith('Click Label')
  })

  test('onScrollPan calls metricsTimeline(\'Scroll Pan\')', async () => {
    setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]

    await act(() => {
      timelineProps.onScrollPan({})
    })

    expect(metricsTimeline).toHaveBeenCalledTimes(1)
    expect(metricsTimeline).toHaveBeenCalledWith('Scroll Pan')
  })

  test('onScrollZoom calls metricsTimeline(\'Scroll Zoom\')', async () => {
    setup()
    const timelineProps = EDSCTimeline.mock.calls[0][0]

    await act(() => {
      timelineProps.onScrollZoom({})
    })

    expect(metricsTimeline).toHaveBeenCalledTimes(1)
    expect(metricsTimeline).toHaveBeenCalledWith('Scroll Zoom')
  })
})
