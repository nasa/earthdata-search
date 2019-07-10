import moment from 'moment'
import actions from './index'

import NlpRequest from '../util/request/nlp'

export const nlpSpatialToCmrParams = (nlpSpatialParam) => {
  if (!nlpSpatialParam) {
    return null
  }

  return [
    nlpSpatialParam.bbox.swPoint.longitude,
    nlpSpatialParam.bbox.swPoint.latitude,
    nlpSpatialParam.bbox.nePoint.longitude,
    nlpSpatialParam.bbox.nePoint.latitude
  ]
}

export const searchNlp = keyword => (dispatch) => {
  let response = null

  if (keyword) {
    const requestObject = new NlpRequest()

    response = requestObject.search({ text: keyword })
      .then((response) => {
        const payload = {}

        payload.keyword = response.data.keyword

        if (response.data.edscSpatial) {
          const bbox = nlpSpatialToCmrParams(response.data.edscSpatial)

          payload.spatial = {
            boundingBox: bbox.join(',')
          }
        }

        if (response.data.edscTemporal) {
          payload.temporal = response.data.edscTemporal.query

          if (response.data.edscTemporal.isRecurring) {
            const recurringDaysOfTheYear = [
              moment(response.data.edscTemporal.start).dayOfYear(),
              moment(response.data.edscTemporal.end).dayOfYear()
            ]

            payload.temporal = [payload.temporal, recurringDaysOfTheYear.join(',')].join(',')
          }
        }

        dispatch(actions.changeQuery({
          collection: payload
        }))
      }, (error) => {
        throw new Error('Request failed', error)
      })
      .catch(() => {
        console.log('Promise Rejected')
      })
  } else {
    dispatch(actions.changeQuery({
      collection: {
        keyword: ''
      }
    }))
  }

  return response
}
