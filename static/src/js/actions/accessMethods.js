
import actions from './index'

import { buildPromise } from '../util/buildPromise'
import { parseError } from '../../../../sharedUtils/parseError'

/**
 * Fetch available access methods
 * @param {Object} collectionIds Collections to retrieve access methods for
 */
export const fetchAccessMethods = collectionIds => async (dispatch, getState) => {
  const state = getState()

  // Get the selected Access Method
  const {
    authToken
  } = state

  // If there are no collections, do not continue
  if (collectionIds.length === 0) return buildPromise(null)

  // The process of fetching access methods requires that we have providers retrieved
  // in order to look up provider guids
  try {
    // Fetching access methods requires that providers be fetched and available
    const accessMethodPromises = collectionIds.map((collectionId) => {
      dispatch(actions.addAccessMethods({
        collectionId,
        methods: {
          download: {
            isValid: true,
            type: 'download'
          }
        },
        selectedAccessMethod: 'download'
      }))
      return buildPromise(null)
    })

    return Promise.all(accessMethodPromises)
      .catch((e) => {
        parseError(e)
      })
  } catch (e) {
    return buildPromise(
      parseError(e, { asJSON: false })
    )
  }
}

export default fetchAccessMethods
