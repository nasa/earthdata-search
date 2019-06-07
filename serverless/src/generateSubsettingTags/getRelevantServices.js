import { pageAllCmrResults } from './pageAllCmrResults'

/**
 * Retrieve CMR service records that have a type that edsc supports for subsetting
 * @return {Array} An array representing CMR service objects that match our supported types
 */
export const getRelevantServices = async () => {
  // Retrieve all of the services CMR has so that we can sift through and
  // find the relevant objects (we only need certain types and CMR does
  // not offer the ability to serach by type)
  const allCmrServices = await pageAllCmrResults('search/services.umm_json')

  const serviceObjects = {}

  await allCmrServices.forEach((service) => {
    const { meta, umm } = service
    const { 'concept-id': conceptId } = meta
    const { Type: serviceType, RelatedURLs: relatedUrls = [] } = umm

    // We only need to tag ECHO ORDERS and ESI collections
    if (!['OPeNDAP', 'ESI'].includes(serviceType)) {
      return
    }

    const serviceData = {
      id: conceptId,
      type: serviceType
    }

    if (serviceType === 'ESI') {
      relatedUrls.forEach((relatedUrl) => {
        const { Type: urlType, URL: urlValue } = relatedUrl

        if (urlType === 'GET SERVICE') {
          serviceData.url = urlValue
        }
      })
    }

    serviceObjects[meta['concept-id']] = {
      collections: [],
      tagData: serviceData
    }
  })

  return serviceObjects
}
