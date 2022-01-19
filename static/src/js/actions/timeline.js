import { isCancel } from 'axios'

import actions from './index'

import TimelineRequest from '../util/request/timelineRequest'
import {
  UPDATE_TIMELINE_INTERVALS,
  UPDATE_TIMELINE_QUERY
} from '../constants/actionTypes'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { handleError } from './errors'
import { prepareTimelineParams } from '../util/timeline'

export const updateTimelineIntervals = (payload) => ({
  type: UPDATE_TIMELINE_INTERVALS,
  payload
})

export const updateTimelineQuery = (payload) => ({
  type: UPDATE_TIMELINE_QUERY,
  payload
})

// Cancel token to cancel pending requests
let cancelToken

/**
 * Perform a timeline request based on the current redux state.
 * @param {Function} dispatch - A dispatch function provided by redux.
 * @param {Function} getState - A function that returns the current state provided by redux.
 */
export const getTimeline = () => (dispatch, getState) => {
  // If cancel token is set, cancel the previous request(s)
  if (cancelToken) {
    cancelToken.cancel()
  }

  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  const timelineParams = prepareTimelineParams(state)

  if (!timelineParams) {
    dispatch(updateTimelineIntervals({
      results: []
    }))

    return null
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

  const response = requestObject.search({
    boundingBox,
    conceptId,
    endDate,
    interval,
    point,
    polygon,
    startDate
  })
    .then((response) => {
      const payload = {}

      payload.results = response.data

      dispatch(updateTimelineIntervals(payload))
    })
    .catch((error) => {
      if (isCancel(error)) return

      dispatch(handleError({
        error,
        action: 'getTimeline',
        resource: 'timeline',
        requestObject
      }))
    })

  return response
}

export const changeTimelineQuery = (query) => (dispatch) => {
  dispatch(updateTimelineQuery(query))
  dispatch(actions.getTimeline())
}
