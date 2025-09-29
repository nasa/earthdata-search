import {
  AxiosResponse,
  CancelTokenSource,
  isCancel
} from 'axios'

import {
  ImmerStateCreator,
  TimelineIntervalData,
  TimelineSlice
} from '../types'

import TimelineRequest from '../../util/request/timelineRequest'

// @ts-expect-error Types are not defined for this module
import { prepareTimelineParams } from '../../util/timeline'

// @ts-expect-error Types are not defined for this module
import configureStore from '../../store/configureStore'

// @ts-expect-error Types are not defined for this module
import actions from '../../actions'

import { TimelineResponseData } from '../../types/sharedTypes'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getCollectionsQuery } from '../selectors/query'
import { getCollectionId } from '../selectors/collection'

let cancelToken: CancelTokenSource

const createTimelineSlice: ImmerStateCreator<TimelineSlice> = (set, get) => ({
  timeline: {
    intervals: {},
    query: {},

    setQuery: (query) => {
      set((state) => {
        Object.assign(state.timeline.query, query)
      })

      // Fetch new timeline intervals
      get().timeline.getTimeline()
    },

    getTimeline: async () => {
      if (cancelToken) {
        cancelToken.cancel()
      }

      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const currentState = get()
      const {
        authToken
      } = reduxState

      const earthdataEnvironment = getEarthdataEnvironment(currentState)
      const timelineParams = prepareTimelineParams({
        ...reduxState,
        collectionQuery: getCollectionsQuery(currentState),
        focusedCollection: getCollectionId(currentState),
        projectCollections: currentState.project.collections,
        timelineQuery: currentState.timeline.query
      })

      if (!timelineParams) {
        // If there are no timeline parameters, clear the intervals
        set((state) => {
          state.timeline.intervals = {}
        })

        return
      }

      const {
        boundingBox,
        conceptId,
        endDate,
        interval,
        point,
        polygon,
        startDate
      } = timelineParams

      const requestObject = new TimelineRequest(authToken, earthdataEnvironment)

      cancelToken = requestObject.getCancelToken()

      requestObject.search({
        boundingBox,
        conceptId,
        endDate,
        interval,
        point,
        polygon,
        startDate
      })
        .then((responseObject: AxiosResponse) => {
          const { data } = responseObject

          const newIntervals = {} as TimelineIntervalData

          data.forEach((responseData: TimelineResponseData) => {
            const { 'concept-id': responseConceptId, intervals } = responseData

            newIntervals[responseConceptId] = intervals
          })

          // Set the intervals
          set((state) => {
            state.timeline.intervals = newIntervals
          })
        })
        .catch(async (error) => {
          if (isCancel(error)) return

          reduxDispatch(actions.handleError({
            error,
            action: 'getTimeline',
            resource: 'timeline',
            requestObject,
            showAlertButton: true,
            title: 'Something went wrong fetching timeline data'
          }))
        })
    }
  }
})

export default createTimelineSlice
