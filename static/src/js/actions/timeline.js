import API from '../util/api'
import actions from './index'
import {
  UPDATE_TIMELINE_INTERVALS,
  UPDATE_TIMELINE_QUERY,
  UPDATE_TIMELINE_STATE
} from '../constants/actionTypes'

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
  const { timeline } = getState()
  const { query, state } = timeline
  const { collectionId } = state
  const {
    endDate,
    interval,
    startDate
  } = query

  if (!collectionId) {
    dispatch(updateTimelineIntervals({
      results: []
    }))
    return null
  }

  const response = API.endpoints.timeline.getAll({
    collectionId,
    endDate,
    interval,
    startDate
  })
    .then((response) => {
      const payload = {}

      payload.results = response.data

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
