import actions from './index'
import API from '../util/api'
import { UPDATE_FOCUSED_COLLECTION } from '../constants/actionTypes'

export const updateFocusedCollection = payload => ({
  type: UPDATE_FOCUSED_COLLECTION,
  payload
})

/**
 * Perform a collection request based on a supplied collection ID.
 * @param {string} collectionId - A CMR Collection ID.
 * @param {function} dispatch - A dispatch function provided by redux.
 */
export const changeFocusedCollection = collectionId => (dispatch) => {
  if (!collectionId) {
    dispatch(updateFocusedCollection({}))
    dispatch(actions.updateGranules({ results: [] }))
    return null
  }

  const includeTags = 'edsc.extra.gibs'

  const response = API.endpoints.collections.getOne({
    collectionId,
    includeTags
  })
    .then((response) => {
      const payload = {}
      payload.collectionId = collectionId
      const [metadata] = response.data.feed.entry
      payload.metadata = metadata

      dispatch(updateFocusedCollection(payload))
      dispatch(actions.getGranules())
    }, (error) => {
      dispatch(updateFocusedCollection({}))

      throw new Error('Request failed', error)
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}
