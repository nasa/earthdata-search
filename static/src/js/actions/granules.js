import API from '../util/api'

import { UPDATE_GRANULES } from '../constants/actionTypes'

export const updateGranules = payload => ({
  type: UPDATE_GRANULES,
  payload
})

export const getGranules = () => (dispatch, getState) => {
  const { focusedCollection = {} } = getState()
  const { collectionId } = focusedCollection

  if (!collectionId) {
    dispatch(updateGranules({
      results: []
    }))
    return null
  }

  const response = API.endpoints.granules.getAll({
    collectionId,
    pageNum: 1,
    pageSize: 20,
    sortKey: '-start_date'
  })
    .then((response) => {
      const payload = {}

      payload.collectionId = collectionId
      payload.results = response.data.feed.entry

      dispatch(updateGranules(payload))
    }, (error) => {
      throw new Error('Request failed', error)
    })
    .catch(() => {
      console.log('Promise Rejected')
    })

  return response
}
