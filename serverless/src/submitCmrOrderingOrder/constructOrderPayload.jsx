import axios from 'axios'

import { stringify } from 'qs'

import { getClientId } from '../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { prepareGranuleAccessParams } from '../../../sharedUtils/prepareGranuleAccessParams'
import { readCmrResults } from '../util/cmr/readCmrResults'

export const constructOrderPayload = async ({
  accessMethod,
  accessToken,
  collectionConceptId,
  earthdataEnvironment,
  granuleParams
}) => {
  const preparedGranuleParams = prepareGranuleAccessParams(granuleParams)

  const granuleResponse = await axios({
    method: 'post',
    url: `${getEarthdataConfig(earthdataEnvironment).cmrHost}/search/granules.json`,
    data: stringify(preparedGranuleParams, {
      indices: false,
      arrayFormat: 'brackets'
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-Id': getClientId().background
    }
  })

  const granuleResponseBody = readCmrResults('search/granules.json', granuleResponse)

  const {
    model,
    optionDefinition
  } = accessMethod

  const {
    conceptId,
    name
  } = optionDefinition

  const [, providerId] = collectionConceptId.split('-')

  const payload = {
    collectionConceptId,
    optionSelection: {
      conceptId,
      content: model,
      name
    },
    orderItems: granuleResponseBody.map((granule) => ({
      granuleConceptId: granule.id,
      granuleUr: granule.title,
      producerGranuleId: granule.producer_granule_id
    })),
    providerId
  }

  return payload
}
