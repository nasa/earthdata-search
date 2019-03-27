import API from '../util/api'

import { UPDATE_GRANULES } from '../constants/actionTypes'

export const updateGranules = payload => ({
  type: UPDATE_GRANULES,
  payload
})

export const getGranules = () => (dispatch, getState) => {
  const { focusedCollection: collectionId } = getState()

  if (!collectionId) {
    dispatch(updateGranules({
      results: []
    }))
    return
  }

  API.endpoints.granules.getAll({
    collectionId,
    pageNum: 1,
    pageSize: 20,
    sortKey: '-start_date'
  }).then((response) => {
    const payload = {}

    payload.results = response.data.feed.entry

    if (collectionId) {
      payload.collectionId = collectionId
    }

    dispatch(updateGranules(payload))
  }, (error) => {
    throw new Error('Request failed', error)
  })
}
