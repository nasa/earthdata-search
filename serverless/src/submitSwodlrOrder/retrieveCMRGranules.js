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
  const granuleResponse = await axios({
    method: 'post',
    url: `${getEarthdataConfig(earthdataEnvironment).cmrHost}/search/granules.json`,
    data: stringify(granuleParams, {
      indices: false,
      arrayFormat: 'brackets'
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
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
