import { ACCESS_METHOD_TYPES } from '../../../sharedConstants/accessMethodTypes'
import fetchDownloadLinks from '../retrieveGranuleLinks/fetchDownloadLinks'
import fetchHarmonyLinks from '../retrieveGranuleLinks/fetchHarmonyLinks'
import { fetchOpendapLinks } from '../retrieveGranuleLinks/fetchOpendapLinks'
import { flattenGranuleLinks } from '../retrieveGranuleLinks/flattenGranuleLinks'
import { deobfuscateId } from './obfuscation/deobfuscateId'

export const fetchGranuleLinks = async ({
  cursor,
  databaseClient,
  earthdataEnvironment,
  edlToken,
  flattenLinks = false,
  linkTypes,
  obfuscatedRetrievalCollectionId,
  pageNum = 1,
  requestId,
  userId
}) => {
  // Decode the provided retrieval id
  const decodedRetrievalCollectionId = deobfuscateId(obfuscatedRetrievalCollectionId)

  // Fetch retrievalCollection from database
  const retrievalCollectionRows = await databaseClient.getRetrievalCollectionsForGranuleLinks(
    decodedRetrievalCollectionId,
    userId
  )

  const [firstRetrievalCollectionRow] = retrievalCollectionRows

  // Determine access method type
  const {
    access_method: accessMethod,
    collection_id: collectionId,
    collection_metadata: collectionMetadata,
    granule_params: granuleParams,
    order_information: orderInformation
  } = firstRetrievalCollectionRow

  const { type } = accessMethod

  let done
  let links
  let newCursor

  switch (type.toLowerCase()) {
    case ACCESS_METHOD_TYPES.DOWNLOAD.toLowerCase():
      ({ links, newCursor } = await fetchDownloadLinks({
        collectionId,
        collectionMetadata,
        cursor,
        earthdataEnvironment,
        granuleParams,
        linkTypes,
        pageNum,
        requestId,
        token: edlToken
      }))

      break
    case ACCESS_METHOD_TYPES.OPENDAP.toLowerCase():
      links = await fetchOpendapLinks({
        accessMethod,
        collectionId,
        earthdataEnvironment,
        edlToken,
        granuleParams,
        pageNum,
        requestId
      })

      break
    case ACCESS_METHOD_TYPES.HARMONY.toLowerCase():
      // When the order has multiple Harmony jobs, we need to return the links from every job
      if (retrievalCollectionRows.length > 1) {
        // Combine the `order_information` objects from each row into a single object keyed by the `jobID`
        const combinedOrderInformation = retrievalCollectionRows.reduce((acc, curr) => {
          const { order_information: currentOrderInformation } = curr
          const {
            jobID: jobId
          } = currentOrderInformation

          // Initialize the accumulator for this jobID if it doesn't exist
          if (!acc[jobId]) {
            acc[jobId] = {
              orderInformation: currentOrderInformation
            }
          }

          return acc
        }, {})

        // Combine the `links` array from each object in `combinedOrderInformation`
        const combinedOrderInformationLinks = Object.values(combinedOrderInformation).flatMap(
          // Using `|| []` will ensure we always return an array. This is important before the
          // order information exists
          (info) => info.orderInformation.links || []
        )

        // Fetch the Harmony links using the combined links
        links = fetchHarmonyLinks({ links: combinedOrderInformationLinks })
      } else {
        links = fetchHarmonyLinks(orderInformation)
      }

      done = true
      break
    case ACCESS_METHOD_TYPES.ESI.toLowerCase():
      // When the order has multiple Harmony jobs, we need to return the links from every job
      if (retrievalCollectionRows.length) {
        // Combine the `order_information` objects from each row into a single object keyed by the `jobID`
        const combinedOrderInformation = retrievalCollectionRows.reduce((acc, curr) => {
          const { order_information: currentOrderInformation } = curr
          const { downloadUrls, order } = currentOrderInformation
          const { orderId } = order

          // Initialize the accumulator for this jobID if it doesn't exist
          if (!acc[orderId]) {
            acc[orderId] = {
              orderInformation: { downloadUrls }
            }
          }

          return acc
        }, {})

        // Combine the `links` array from each object in `combinedOrderInformation`
        const combinedOrderInformationLinks = Object.values(combinedOrderInformation).flatMap(
          // Using `|| []` will ensure we always return an array. This is important before the
          // order information exists
          (info) => info.orderInformation?.downloadUrls?.downloadUrl || []
        )

        links = { download: combinedOrderInformationLinks }
      }

      done = true
      break
    default:
      break
  }

  return {
    cursor: newCursor,
    done,
    links: flattenGranuleLinks(links, linkTypes, flattenLinks)
  }
}
