import actions from './index'

import { buildPromise } from '../util/buildPromise'
import { findProvider } from '../util/findProvider'
import { parseError } from '../../../../sharedUtils/parseError'

import { getCollectionMetadata } from '../util/focusedCollection'
import { getCollectionsMetadata } from '../selectors/collectionMetadata'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { isDownloadable } from '../../../../sharedUtils/isDownloadable'

import AccessMethodsRequest from '../util/request/accessMethodsRequest'

/**
 * Fetch available access methods
 * @param {Object} collectionIds Collections to retrieve access methods for
 */
export const fetchAccessMethods = (collectionIds) => async (dispatch, getState) => {
  const state = getState()

  // Get the selected Access Method
  const {
    authToken
  } = state

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)
  const collectionsMetadata = getCollectionsMetadata(state)

  // If the user is not logged in, don't fetch any methods
  if (authToken === '') return buildPromise(null)

  // If there are no collections, do not continue
  if (collectionIds.length === 0) return buildPromise(null)

  // The process of fetching access methods requires that we have providers retrieved
  // in order to look up provider guids
  try {
    // Fetching access methods requires that providers be fetched and available
    await dispatch(actions.fetchProviders())

    const accessMethodPromises = collectionIds.map((collectionId) => {
      const collectionMetadata = getCollectionMetadata(collectionId, collectionsMetadata)

      const {
        dataCenter,
        granules,
        isOpenSearch,
        services,
        tags,
        variables
      } = collectionMetadata

      const collectionProvider = findProvider(getState(), dataCenter)

      const { count: servicesCount } = services

      if (servicesCount > 0) {
        const requestObject = new AccessMethodsRequest(authToken, earthdataEnvironment)

        const response = requestObject.search({
          collectionId,
          collectionProvider,
          granules,
          services,
          tags,
          variables
        })
          .then((response) => {
            const { data } = response
            const { accessMethods, selectedAccessMethod } = data

            const accessMethodPayload = {
              collectionId,
              methods: accessMethods
            }

            if (selectedAccessMethod) {
              accessMethodPayload.selectedAccessMethod = selectedAccessMethod
            }

            dispatch(actions.addAccessMethods(accessMethodPayload))
          })
          .catch((error) => {
            dispatch(actions.handleError({
              error,
              action: 'fetchAccessMethods',
              resource: 'access methods',
              requestObject
            }))
          })

        return response
      }

      let onlineAccessFlag = false

      if (granules) {
        // If the collection has granules, check their online access flags to
        // determine if this collection is downloadable
        const { items: granuleItems } = granules

        if (granuleItems) {
          onlineAccessFlag = isDownloadable(granuleItems)
        }
      }

      // If the collection is online downloadable or if the collection isOpenSearch, add the download method
      if (onlineAccessFlag || isOpenSearch) {
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
      }

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
