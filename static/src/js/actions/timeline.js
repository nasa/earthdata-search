import actions from './index'

import TimelineRequest from '../util/request/timelineRequest'
import {
  UPDATE_TIMELINE_INTERVALS,
  UPDATE_TIMELINE_QUERY
} from '../constants/actionTypes'
import { prepareTimelineParams } from '../util/timeline'
import { updateAuthTokenFromHeaders } from './authToken'

export const updateTimelineIntervals = payload => ({
  type: UPDATE_TIMELINE_INTERVALS,
  payload
})

export const updateTimelineQuery = payload => ({
  type: UPDATE_TIMELINE_QUERY,
  payload
})

export const getTimeline = () => (dispatch, getState) => {
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
    }, (error) => {
      throw new Error('Request failed', error)
    })
    .catch(() => {
      console.log('Promise Rejected')
    })

  return response
}

export const changeTimelineQuery = query => (dispatch) => {
  dispatch(updateTimelineQuery(query))
  dispatch(actions.getTimeline())
}
