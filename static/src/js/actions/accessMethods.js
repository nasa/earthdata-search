
import actions from './index'

import { buildPromise } from '../util/buildPromise'
import { findProvider } from '../util/findProvider'
// import { getValueForTag } from '../../../../sharedUtils/tags'
import { parseError } from '../../../../sharedUtils/parseError'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getCollectionMetadata } from '../util/focusedCollection'
import { getCollectionsMetadata } from '../selectors/collectionMetadata'

import AccessMethodsRequest from '../util/request/accessMethodsRequest'

/**
 * Fetch available access methods
 * @param {Object} collectionIds Collections to retrieve access methods for
 */
export const fetchAccessMethods = collectionIds => async (dispatch, getState) => {
  console.log('fetchAccessMethods')
  const state = getState()

  // Get the selected Access Method
  const {
    authToken
  } = state

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)
  const collectionsMetadata = getCollectionsMetadata(state)

  // If the user is not logged in, don't fetch any methods
  console.log('1')
  if (authToken === '') return buildPromise(null)

  // If there are no collections, do not continue
  console.log('2')
  if (collectionIds.length === 0) return buildPromise(null)

  // The process of fetching access methods requires that we have providers retrieved
  // in order to look up provider guids
  try {
    // Fetching access methods requires that providers be fetched and available
    await dispatch(actions.fetchProviders())
    console.log('3')

    const accessMethodPromises = collectionIds.map((collectionId) => {
      console.log('4')
      const collectionMetadata = getCollectionMetadata(collectionId, collectionsMetadata)

      const {
        dataCenter,
        granules,
        services,
        tags,
        variables
      } = collectionMetadata

      const collectionProvider = findProvider(getState(), dataCenter)
      console.log('5')

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
            console.log('Exception 1')
            dispatch(actions.handleError({
              error,
              action: 'fetchAccessMethods',
              resource: 'access methods',
              requestObject
            }))
          })

        return response
      }
      console.log('6')
      // If the collection has tag data, retrieve the access methods from lambda
      // const capabilitiesData = getValueForTag('collection_capabilities', tags)
      // const { granule_online_access_flag: downloadable } = capabilitiesData || {}

      // If the collection is online downloadable, add the download method
      // if (downloadable) {
      console.log('7')
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
      // }
      console.log('8')
      return buildPromise(null)
    })

    return Promise.all(accessMethodPromises)
      .catch((e) => {
        console.log('Exception 2')
        parseError(e)
      })
  } catch (e) {
    console.log('Exception 3')
    return buildPromise(
      parseError(e, { asJSON: false })
    )
  }
}

export default fetchAccessMethods
