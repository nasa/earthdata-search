import nock from 'nock'

import { waitFor } from '@testing-library/react'
import { TimelineInterval } from '../../types'
import useEdscStore from '../../useEdscStore'

// @ts-expect-error Types are not defined for this module
import configureStore from '../../../store/configureStore'

// @ts-expect-error Types are not defined for this module
import actions from '../../../actions'

import TimelineRequest from '../../../util/request/timelineRequest'
import routerHelper from '../../../router/router'

jest.mock('../../../store/configureStore', () => jest.fn())

describe('createTimelineSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { timeline } = zustandState

    expect(timeline).toEqual({
      intervals: {},
      query: {},
      setQuery: expect.any(Function),
      getTimeline: expect.any(Function)
    })
  })

  describe('setQuery', () => {
    test('updates query and calls getTimeline', () => {
      const initialState = useEdscStore.getInitialState()

      const mockGetTimeline = jest.fn()
      useEdscStore.setState({
        timeline: {
          ...initialState.timeline,
          getTimeline: mockGetTimeline
        }
      })

      const zustandState = useEdscStore.getState()
      const { timeline } = zustandState
      const { setQuery } = timeline
      setQuery({
        center: 1298937600,
        interval: TimelineInterval.Day,
        endDate: '2011-05-01T00:00:00Z',
        startDate: '2011-01-01T00:00:00Z'
      })

      const updatedState = useEdscStore.getState()
      const { timeline: updatedTimeline } = updatedState
      expect(updatedTimeline.query).toEqual({
        center: 1298937600,
        interval: TimelineInterval.Day,
        endDate: '2011-05-01T00:00:00Z',
        startDate: '2011-01-01T00:00:00Z'
      })

      expect(mockGetTimeline).toHaveBeenCalledTimes(1)
      expect(mockGetTimeline).toHaveBeenCalledWith()
    })

    describe('when the query already has values', () => {
      test('does not overwrite existing values', () => {
        const initialState = useEdscStore.getInitialState()

        const mockGetTimeline = jest.fn()
        useEdscStore.setState({
          timeline: {
            ...initialState.timeline,
            getTimeline: mockGetTimeline,
            query: {
              center: 1298937600,
              interval: TimelineInterval.Day,
              endDate: '2011-05-01T00:00:00Z',
              startDate: '2011-01-01T00:00:00Z'
            }
          }
        })

        const zustandState = useEdscStore.getState()
        const { timeline } = zustandState
        const { setQuery } = timeline
        setQuery({
          center: 1298937600,
          end: 1893455999999,
          start: 1577836800000
        })

        const updatedState = useEdscStore.getState()
        const { timeline: updatedTimeline } = updatedState
        expect(updatedTimeline.query).toEqual({
          center: 1298937600,
          interval: TimelineInterval.Day,
          endDate: '2011-05-01T00:00:00Z',
          startDate: '2011-01-01T00:00:00Z',
          end: 1893455999999,
          start: 1577836800000
        })

        expect(mockGetTimeline).toHaveBeenCalledTimes(1)
        expect(mockGetTimeline).toHaveBeenCalledWith()
      })
    })
  })

  describe('getTimeline', () => {
    beforeEach(() => {
      routerHelper.router = {
        navigate: jest.fn(),
        state: {
          location: {
            pathname: '/search/granules',
            search: ''
          }
        },
        subscribe: jest.fn()
      }
    })

    describe('when the user is not logged in', () => {
      test('calls cmr to set the intervals', async () => {
        configureStore.mockReturnValue({
          getState: () => ({
            authToken: ''
          })
        })

        nock(/cmr/)
          .post(/granules\/timeline/)
          .reply(200, [{
            'concept-id': 'collectionId',
            intervals: [
              [
                1298937600,
                1304208000,
                3
              ]
            ]
          }])

        useEdscStore.setState((state) => {
          state.collection.collectionId = 'collectionId'
          state.timeline.query = {
            endDate: '2009-12-01T23:59:59.000Z',
            interval: TimelineInterval.Day,
            startDate: '1979-01-01T00:00:00.000Z'
          }
        })

        const zustandState = useEdscStore.getState()
        const { timeline } = zustandState
        const { getTimeline } = timeline

        await getTimeline()

        await waitFor(() => {
          const updatedState = useEdscStore.getState()
          const { timeline: updatedTimeline } = updatedState
          expect(updatedTimeline.intervals).toEqual({
            collectionId: [
              [
                1298937600,
                1304208000,
                3
              ]
            ]
          })
        })

        expect(window.dataLayer.push).toHaveBeenCalledTimes(1)
        expect(window.dataLayer.push).toHaveBeenCalledWith({
          event: 'timing',
          timingEventCategory: 'ajax',
          timingEventValue: expect.any(Number),
          timingEventVar: 'https://cmr.earthdata.nasa.gov/search/granules/timeline'
        })
      })
    })

    describe('when the user is logged in', () => {
      test('calls lambda to set the intervals', async () => {
        configureStore.mockReturnValue({
          getState: () => ({
            authToken: 'mock-token'
          })
        })

        nock(/localhost/)
          .post(/granules\/timeline/)
          .reply(200, [{
            'concept-id': 'collectionId',
            intervals: [
              [
                1298937600,
                1304208000,
                3
              ]
            ]
          }])

        useEdscStore.setState((state) => {
          state.collection.collectionId = 'collectionId'
          state.timeline.query = {
            endDate: '2009-12-01T23:59:59.000Z',
            interval: TimelineInterval.Day,
            startDate: '1979-01-01T00:00:00.000Z'
          }
        })

        const zustandState = useEdscStore.getState()
        const { timeline } = zustandState
        const { getTimeline } = timeline

        await getTimeline()

        await waitFor(() => {
          const updatedState = useEdscStore.getState()
          const { timeline: updatedTimeline } = updatedState
          expect(updatedTimeline.intervals).toEqual({
            collectionId: [
              [
                1298937600,
                1304208000,
                3
              ]
            ]
          })
        })

        expect(window.dataLayer.push).toHaveBeenCalledTimes(1)
        expect(window.dataLayer.push).toHaveBeenCalledWith({
          event: 'timing',
          timingEventCategory: 'ajax',
          timingEventValue: expect.any(Number),
          timingEventVar: 'http://localhost:3000/granules/timeline'
        })
      })
    })

    describe('when there is no focusedCollection', () => {
      test('sets intervals to empty', async () => {
        configureStore.mockReturnValue({
          getState: () => ({
            authToken: 'mock-token'
          })
        })

        useEdscStore.setState((state) => {
          state.timeline.intervals = {
            collectionId: [
              [
                1298937600,
                1304208000,
                3
              ]
            ]
          }
        })

        const zustandState = useEdscStore.getState()
        const { timeline } = zustandState
        const { getTimeline } = timeline

        await getTimeline()

        await waitFor(() => {
          const updatedState = useEdscStore.getState()
          const { timeline: updatedTimeline } = updatedState
          expect(updatedTimeline.intervals).toEqual({})
        })

        expect(window.dataLayer.push).toHaveBeenCalledTimes(0)
      })

      test('sets intervals to empty when conceptId is empty array', async () => {
        configureStore.mockReturnValue({
          getState: () => ({
            authToken: 'mock-token'
          })
        })

        useEdscStore.setState((state) => {
          state.collection.collectionId = ''
          state.timeline.query = {
            endDate: '2009-12-01T23:59:59.000Z',
            interval: TimelineInterval.Day,
            startDate: '1979-01-01T00:00:00.000Z'
          }

          state.timeline.intervals = {
            collectionId: [
              [
                1298937600,
                1304208000,
                3
              ]
            ]
          }

          state.project.collections.allIds = []
        })

        const zustandState = useEdscStore.getState()
        const { timeline } = zustandState
        const { getTimeline } = timeline

        await getTimeline()

        await waitFor(() => {
          const updatedState = useEdscStore.getState()
          const { timeline: updatedTimeline } = updatedState
          expect(updatedTimeline.intervals).toEqual({})
        })

        expect(window.dataLayer.push).toHaveBeenCalledTimes(0)
      })
    })

    describe('when there is a request error', () => {
      test('dispatches an error action', async () => {
        const handleErrorMock = jest.spyOn(actions, 'handleError')

        const mockDispatch = jest.fn()
        configureStore.mockReturnValue({
          dispatch: mockDispatch,
          getState: () => ({
            authToken: ''
          })
        })

        nock(/cmr/)
          .post(/granules\/timeline/)
          .reply(500)

        useEdscStore.setState((state) => {
          state.collection.collectionId = 'collectionId'
          state.timeline.query = {
            endDate: '2009-12-01T23:59:59.000Z',
            interval: TimelineInterval.Day,
            startDate: '1979-01-01T00:00:00.000Z'
          }
        })

        const zustandState = useEdscStore.getState()
        const { timeline } = zustandState
        const { getTimeline } = timeline

        await getTimeline()

        await waitFor(() => {
          expect(mockDispatch).toHaveBeenCalledTimes(1)
        })

        expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function))

        expect(window.dataLayer.push).toHaveBeenCalledTimes(1)
        expect(window.dataLayer.push).toHaveBeenCalledWith({
          event: 'timing',
          timingEventCategory: 'ajax',
          timingEventValue: expect.any(Number),
          timingEventVar: 'https://cmr.earthdata.nasa.gov/search/granules/timeline'
        })

        expect(handleErrorMock).toHaveBeenCalledTimes(1)
        expect(handleErrorMock).toHaveBeenCalledWith({
          error: expect.any(Error),
          action: 'getTimeline',
          resource: 'timeline',
          requestObject: expect.any(TimelineRequest),
          showAlertButton: true,
          title: 'Something went wrong fetching timeline data'
        })

        const updatedState = useEdscStore.getState()
        const { timeline: updatedTimeline } = updatedState
        expect(updatedTimeline.intervals).toEqual({})
      })
    })
  })
})
