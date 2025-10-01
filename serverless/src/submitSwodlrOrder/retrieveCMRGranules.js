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

  // Filter out null/undefined concept_ids. If none remain, remove the key entirely,
  // otherwise CMR will reject the query
  if (normalizedParams.concept_id) {
    const filteredConceptIds = normalizedParams.concept_id.filter((id) => id != null)

    if (filteredConceptIds.length > 0) {
      normalizedParams.concept_id = filteredConceptIds
    } else {
      delete normalizedParams.concept_id
    }
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
