import { isCancel } from 'axios'

import actions from './index'

import TimelineRequest from '../util/request/timelineRequest'
import {
  UPDATE_TIMELINE_INTERVALS,
  UPDATE_TIMELINE_QUERY
} from '../constants/actionTypes'
import { prepareTimelineParams } from '../util/timeline'
import { updateAuthTokenFromHeaders } from './authToken'
import { handleError } from './errors'

export const updateTimelineIntervals = payload => ({
  type: UPDATE_TIMELINE_INTERVALS,
  payload
})

export const updateTimelineQuery = payload => ({
  type: UPDATE_TIMELINE_QUERY,
  payload
})

// Cancel token to cancel pending requests
let cancelToken

/**
 * Perform a timeline request based on the current redux state.
 * @param {function} dispatch - A dispatch function provided by redux.
 * @param {function} getState - A function that returns the current state provided by redux.
 */
export const getTimeline = () => (dispatch, getState) => {
  // If cancel token is set, cancel the previous request(s)
  if (cancelToken) {
    cancelToken.cancel()
  }

  const timelineParams = prepareTimelineParams(getState())

  if (!timelineParams) {
    dispatch(updateTimelineIntervals({
      results: []
    }))
    return null
  }

  const {
    authToken,
    boundingBox,
    conceptId,
    endDate,
    interval,
    point,
    polygon,
    startDate
  } = timelineParams

  const requestObject = new TimelineRequest(authToken)
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

      dispatch(updateAuthTokenFromHeaders(response.headers))
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

export const changeTimelineQuery = query => (dispatch) => {
  dispatch(updateTimelineQuery(query))
  dispatch(actions.getTimeline())
}
