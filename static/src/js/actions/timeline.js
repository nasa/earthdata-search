import actions from './index'

import TimelineRequest from '../util/request/timelineRequest'
import {
  UPDATE_TIMELINE_INTERVALS,
  UPDATE_TIMELINE_QUERY,
  UPDATE_TIMELINE_STATE
} from '../constants/actionTypes'
import { prepareTimelineParams } from '../util/timeline'
import { updateAuthFromHeaders } from './auth'

export const updateTimelineIntervals = payload => ({
  type: UPDATE_TIMELINE_INTERVALS,
  payload
})

export const updateTimelineState = payload => ({
  type: UPDATE_TIMELINE_STATE,
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
    auth,
    boundingBox,
    focusedCollection,
    endDate,
    interval,
    point,
    polygon,
    startDate
  } = timelineParams

  const requestObject = new TimelineRequest(auth)

  const response = requestObject.search({
    boundingBox,
    echoCollectionId: focusedCollection,
    endDate,
    interval,
    point,
    polygon,
    startDate
  })
    .then((response) => {
      const payload = {}

      payload.results = response.data

      dispatch(updateAuthFromHeaders(response.headers))
      dispatch(updateTimelineIntervals(payload))
    }, (error) => {
      throw new Error('Request failed', error)
    })
    .catch(() => {
      console.log('Promise Rejected')
    })

  return response
}

export const changeTimelineState = state => (dispatch) => {
  dispatch(updateTimelineState(state))
}

export const changeTimelineQuery = query => (dispatch) => {
  dispatch(updateTimelineQuery(query))
  dispatch(actions.getTimeline())
}
