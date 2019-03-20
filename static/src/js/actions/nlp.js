import API from '../util/api'
import actions from './index'

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
    response = API.endpoints.nlp.search({ text: keyword })
      .then((response) => {
        const payload = {}

        payload.keyword = response.data.keyword

        if (response.data.edscSpatial) {
          const bbox = nlpSpatialToCmrParams(response.data.edscSpatial)

          payload.spatial = {
            boundingBox: bbox.join(',')
          }
        }

        dispatch(actions.changeQuery(payload))
      }, (error) => {
        throw new Error('Request failed', error)
      })
      .catch(() => {
        console.log('Promise Rejected')
      })
  } else {
    dispatch(actions.changeQuery({ keyword: '' }))
  }

  return response
}
