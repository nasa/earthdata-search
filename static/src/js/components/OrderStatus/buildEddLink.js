import { ORDER_STATES } from '../../../../../sharedConstants/orderStates'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { getClientId } from '../../../../../sharedUtils/getClientId'
import { aggregatedOrderStatus } from '../../../../../sharedUtils/orderStatus'
import { routes } from '../../constants/routes'

/**
 * Builds a link to open Earthdata Download
 * @param {Object} params
 * @param {Object} params.collectionMetadata The collection metadata
 * @param {Array} params.downloadUrls The download urls
 * @param {String} params.earthdataEnvironment The Earthdata environment to link to
 * @param {String} params.edlToken The users authentication token
 * @param {String} params.linkType The type of link to build
 * @param {String} params.retrievalCollectionId The retrieval collection ID
 * @param {Array} params.retrievalOrders The retrieval orders
 * @returns {String} The link to open Earthdata Download
 */
const buildEddLink = ({
  collectionMetadata,
  downloadUrls,
  earthdataEnvironment,
  edlToken,
  linkType,
  retrievalCollectionId,
  retrievalOrders
}) => {
  const orderStatus = aggregatedOrderStatus(retrievalOrders)

  const [firstOrder = {}] = retrievalOrders
  const {
    type = ''
  } = firstOrder

  // If the order is Harmony and is still running or has no files, don't show the EDD link
  const isDone = ![
    ORDER_STATES.CREATING,
    ORDER_STATES.IN_PROGRESS
  ].includes(orderStatus)
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
  const eulaRedirectUrl = `${edscHost}${routes.AUTH_CALLBACK}?eddRedirect=${encodeURIComponent(eulaCallback)}`

  const link = `earthdata-download://startDownload?getLinks=${encodeURIComponent(getLinksUrl)}&downloadId=${downloadId}&clientId=${getClientId().client}&token=Bearer ${edlToken}&authUrl=${encodeURIComponent(authUrl)}&eulaRedirectUrl=${encodeURIComponent(eulaRedirectUrl)}`

  return link
}

export default buildEddLink
