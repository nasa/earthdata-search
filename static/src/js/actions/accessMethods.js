
import actions from './index'
import { findProvider } from '../util/findProvider'
import { getValueForTag, hasTag } from '../../../../sharedUtils/tags'
import AccessMethodsRequest from '../util/request/accessMethodsRequest'
import { getApplicationConfig } from '../../../../sharedUtils/config'

/**
 * Fetch available access methods from the API
 */
export const fetchAccessMethods = collectionIds => (dispatch, getState) => {
  // Get the selected Access Method
  const {
    authToken,
    metadata
  } = getState()

  // If the user is not logged in, don't fetch any methods
  if (authToken === '') return null

  return Promise.all(collectionIds.map((collectionId) => {
    // Get the tag data for the collection
    const { collections } = metadata
    const { byId } = collections
    const collection = byId[collectionId]
    const { metadata: collectionMetadata } = collection
    const { associations, data_center: dataCenter, tags } = collectionMetadata

    const collectionProvider = findProvider(getState(), dataCenter)

    // If the collection has tag data, retrieve the access methods from lambda
    const hasEchoOrders = hasTag(collectionMetadata, 'subset_service.echo_orders')
    const hasEsi = hasTag(collectionMetadata, 'subset_service.esi')
    const hasOpendap = hasTag(collectionMetadata, 'subset_service.opendap')
    const capabilitiesData = getValueForTag('collection_capabilities', tags)
    const { granule_online_access_flag: downloadable } = capabilitiesData || {}

    if (hasEchoOrders || hasEsi || hasOpendap) {
      const requestObject = new AccessMethodsRequest(authToken)

      const response = requestObject.search({
        associations,
        collectionId,
        collectionProvider,
        tags
      })
        .then((response) => {
          const { data } = response
          const { accessMethods, selectedAccessMethod } = data

          let orderCount = 0

          Object.keys(accessMethods).forEach((methodName) => {
            if (selectedAccessMethod === methodName) {
              const { granule_count: granuleCount } = collectionMetadata
              const { defaultGranulesPerOrder } = getApplicationConfig()

              orderCount = Math.ceil(granuleCount / parseInt(defaultGranulesPerOrder, 10))
            }
          })

          dispatch(actions.addAccessMethods({
            collectionId,
            methods: accessMethods,
            selectedAccessMethod,
            orderCount
          }))

          if (orderCount > 1) {
            dispatch(actions.addChunkedCollectionToProject(collectionId))
          }
        })
        .catch((error) => {
          dispatch(actions.handleError({
            error,
            action: 'fetchAccessMethods',
            resource: 'access methods'
          }))
        })

      return response
    }

    // If the collection is online downloadable, add the download method
    if (downloadable) {
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

    return null
  }))
}

export default fetchAccessMethods
