import 'array-foreach-async'
import { pageAllCmrResults } from '../util/cmr/pageAllCmrResults'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getApplicationConfig } from '../../../sharedUtils/config'

/**
 * Retrieve CMR service records that have a type that edsc supports for subsetting
 * @return {Array} An array representing CMR service objects that match our supported types
 */
export const getRelevantServices = async (cmrToken) => {
  // Retrieve all of the services CMR has so that we can sift through and
  // find the relevant objects (we only need certain types and CMR does
  // not offer the ability to serach by type)
  const allCmrServices = await pageAllCmrResults({
    cmrToken,
    cmrEnvironment: cmrEnv(),
    path: 'search/services.umm_json',
    additionalHeaders: {
      Accept: `application/vnd.nasa.cmr.umm_results+json; version=${getApplicationConfig().ummServiceVersion}`
    }
  })

  const serviceObjects = {}

  await allCmrServices.forEachAsync(async (service) => {
    const { meta, umm } = service
    const { 'concept-id': conceptId } = meta
    const { Type: serviceType, RelatedURLs: relatedUrls = [] } = umm

    // We only need to tag ECHO ORDERS and ESI collections
    if (!['OPeNDAP', 'ESI', 'ECHO ORDERS'].includes(serviceType)) {
      return
    }

    const serviceData = {
      id: conceptId,
      type: serviceType
    }

    if (serviceType === 'ESI' || serviceType === 'ECHO ORDERS') {
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
