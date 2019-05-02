import actions from './index'
import { updateGranuleQuery } from './search'
import { CollectionRequest } from '../util/request/cmr'
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
  // Reset granule pageNum to 1 when focusedCollection is changing
  dispatch(updateGranuleQuery({ pageNum: 1 }))

  if (!collectionId) {
    dispatch(updateFocusedCollection(false))
    dispatch(actions.updateGranules({ results: [] }))
    return null
  }

  const requestObject = new CollectionRequest()

  const response = requestObject.search({
    concept_id: collectionId,
    includeTags: 'edsc.*,org.ceos.wgiss.cwic.granules.prod',
    includeHasGranules: true
  })
    .then((response) => {
      const payload = {}
      payload.collectionId = collectionId
      const [metadata] = response.data.feed.entry
      payload.metadata = metadata

      dispatch(updateFocusedCollection(payload))
      dispatch(actions.getGranules())
    }, (error) => {
      dispatch(updateFocusedCollection(false))

      throw new Error('Request failed', error)
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}
