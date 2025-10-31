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

import { TimelineResponseData } from '../../types/sharedTypes'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getCollectionsQuery } from '../selectors/query'
import { getCollectionId } from '../selectors/collection'
import { getEdlToken } from '../selectors/user'

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

      const zustandState = get()
      const edlToken = getEdlToken(zustandState)
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)
      const timelineParams = prepareTimelineParams({
        collectionQuery: getCollectionsQuery(zustandState),
        focusedCollection: getCollectionId(zustandState),
        projectCollections: zustandState.project.collections,
        timelineQuery: zustandState.timeline.query
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

      // Don't allow timeline requests when there are no collections
      if (!conceptId || (Array.isArray(conceptId) && conceptId.length === 0)) {
        set((state) => {
          state.timeline.intervals = {}
        })

        return
      }

      const requestObject = new TimelineRequest(edlToken, earthdataEnvironment)

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

          zustandState.errors.handleError({
            error: error as Error,
            action: 'getTimeline',
            resource: 'timeline',
            requestObject,
            showAlertButton: true,
            title: 'Something went wrong fetching timeline data'
          })
        })
    }
  }
})

export default createTimelineSlice
