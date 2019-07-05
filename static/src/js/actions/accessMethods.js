
import actions from './index'
import { getValueForTag, hasTag } from '../../../../sharedUtils/tags'
import AccessMethodsRequest from '../util/request/accessMethodsRequest'

/**
 * Fetch available access methods from the API
 */
export const fetchAccessMethods = () => (dispatch, getState) => {
  // Get the selected Access Method
  const {
    authToken,
    metadata,
    project
  } = getState()

  // If the user is not logged in, don't fetch any methods
  if (authToken === '') return null

  const {
    collectionIds: projectIds
  } = project

  return Promise.all(projectIds.map((collectionId) => {
    // Get the tag data for the collection
    const { collections } = metadata
    const { byId } = collections
    const collection = byId[collectionId]
    const { metadata: collectionMetadata } = collection
    const { tags } = collectionMetadata

    // if the collection has tag data, retrieve the access methods from lambda
    const hasEchoOrders = hasTag(collectionMetadata, 'subset_service.echo_orders')
    const hasEsi = hasTag(collectionMetadata, 'subset_service.esi')
    const hasOpendap = hasTag(collectionMetadata, 'subset_service.opendap')
    const capabilitiesData = getValueForTag('collection_capabilities', tags)
    const { granule_online_access_flag: downloadable } = capabilitiesData || {}

    if (hasEchoOrders || hasEsi || hasOpendap) {
      const requestObject = new AccessMethodsRequest(authToken)
      const response = requestObject.search({ collectionId, tags })
        .then((response) => {
          const { data } = response
          const { accessMethods } = data

          dispatch(actions.addAccessMethods({
            collectionId,
            methods: accessMethods
          }))
        })
      return response
    }

    // if the collection is online downloadable, add the download method
    if (downloadable) {
      dispatch(actions.addAccessMethods({
        collectionId,
        methods: {
          download: {
            isValid: true,
            type: 'download'
          }
        }
      }))
    }
    return null
  }))
}

export default fetchAccessMethods
