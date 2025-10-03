import axios from 'axios'

import { stringify } from 'qs'

import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getClientId } from '../../../sharedUtils/getClientId'
import { readCmrResults } from '../util/cmr/readCmrResults'

export const retrieveCMRGranules = async ({
  collectionConceptId,
  earthdataEnvironment,
  accessToken,
  granuleParams
}) => {
  const normalizedParams = { ...granuleParams }

  // Remove concept_id if empty. An empty concept_id array will cause CMR to reject
  // the query. Removing the empty array allows CMR to search by collection_id
  // and readable_granule_name instead.
  if (normalizedParams.concept_id && normalizedParams.concept_id.length === 0) {
    delete normalizedParams.concept_id
  }

  const granuleResponse = await axios({
    url: `${getEarthdataConfig(earthdataEnvironment).cmrHost}/search/granules.json`,
    params: normalizedParams,
    paramsSerializer: (params) => stringify(
      params,
      {
        indices: false,
        arrayFormat: 'brackets'
      }
    ),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-Id': getClientId().background
    }
  })

  const granuleResponseBody = readCmrResults('search/granules.json', granuleResponse)

  const payload = {
    collectionConceptId,
    orderItems: granuleResponseBody.map((granule) => ({
      granuleConceptId: granule.id,
      granuleUr: granule.title
    }))
  }

  return payload
}
