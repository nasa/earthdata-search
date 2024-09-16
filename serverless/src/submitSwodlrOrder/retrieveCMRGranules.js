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
  const { concept_id: granuleIds } = granuleParams
  console.log('🚀 ~ file: retrieveCMRGranules.js:16 ~ granuleIds:', granuleIds)

  const granuleResponse = await axios({
    url: `${getEarthdataConfig(earthdataEnvironment).cmrHost}/search/granules.json`,
    params: { concept_id: granuleIds },
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
