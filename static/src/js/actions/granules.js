import API from '../util/api'

import { UPDATE_GRANULES } from '../constants/actionTypes'

export const updateGranules = payload => ({
  type: UPDATE_GRANULES,
  payload
})

export const getGranules = collectionId => (dispatch) => {
  if (!collectionId) {
    dispatch(updateGranules({
      results: []
    }))
    return
  }

  API.endpoints.granules.getAll({ collectionId }).then((response) => {
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
