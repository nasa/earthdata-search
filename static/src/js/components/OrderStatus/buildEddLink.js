import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { getClientId } from '../../../../../sharedUtils/getClientId'
import { aggregatedOrderStatus } from '../../../../../sharedUtils/orderStatus'

/**
 * Builds a link to open Earthdata Download
 * @param {Object} params
 * @param {String} params.authToken The users authentication token
 * @param {Object} params.collection The collection object
 * @param {Array} params.downloadUrls The download urls
 * @param {String} params.earthdataEnvironment The Earthdata environment to link to
 * @param {String} params.linkType The type of link to build
 * @returns {String} The link to open Earthdata Download
 */
const buildEddLink = ({
  authToken,
  collection,
  downloadUrls,
  earthdataEnvironment,
  linkType
}) => {
  const {
    collection_metadata: collectionMetadata,
    orders = [],
    retrieval_collection_id: retrievalCollectionId
  } = collection

  const orderStatus = aggregatedOrderStatus(orders)

  const [firstOrder = {}] = orders
  const {
    type = ''
  } = firstOrder

  // If the order is Harmony and is still running or has no files, don't show the EDD link
  const isDone = !['creating', 'in progress'].includes(orderStatus)
  const notDoneOrEmpty = !isDone || downloadUrls.length === 0
  if (type.toLowerCase() === 'harmony' && notDoneOrEmpty) {
    return null
  }

  const {
    conceptId,
    shortName,
    versionId
  } = collectionMetadata

  let downloadId = conceptId
  if (shortName) downloadId = `${shortName}_${versionId}`

  // Build the `getLinks` URL to tell EDD where to find the download links
  const { apiHost, edscHost } = getEnvironmentConfig()
  const getLinksUrl = `${apiHost}/granule_links?id=${retrievalCollectionId}&flattenLinks=true&linkTypes=${linkType}&ee=${earthdataEnvironment}`

  // Build the authUrl to tell EDD how to authenticate the user
  const authReturnUrl = 'earthdata-download://authCallback'
  const authUrl = `${apiHost}/login?ee=${earthdataEnvironment}&eddRedirect=${encodeURIComponent(authReturnUrl)}`

  // Build the eulaRedirectUrl to tell EDD how to get back after the user accepts a EULA
  const eulaCallback = 'earthdata-download://eulaCallback'
  const eulaRedirectUrl = `${edscHost}/auth_callback?eddRedirect=${encodeURIComponent(eulaCallback)}`

  const link = `earthdata-download://startDownload?getLinks=${encodeURIComponent(getLinksUrl)}&downloadId=${downloadId}&clientId=${getClientId().client}&token=Bearer ${authToken}&authUrl=${encodeURIComponent(authUrl)}&eulaRedirectUrl=${encodeURIComponent(eulaRedirectUrl)}`

  return link
}

export default buildEddLink
