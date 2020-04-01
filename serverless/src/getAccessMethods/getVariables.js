import request from 'request-promise'
import 'array-foreach-async'

import {
  getEarthdataConfig,
  getClientId
} from '../../../sharedUtils/config'
import { computeKeywordMappings } from './computeKeywordMappings'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { cmrStringify } from '../util/cmr/cmrStringify'
import { getEchoToken } from '../util/urs/getEchoToken'
import { getUmmVariableVersionHeader } from '../../../sharedUtils/ummVersionHeader'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Given the items result from a CMR variable search, returns the variables in an object with the key being the concept id
 * and the value being the variable metadata
 * @param {Array} items Items key from a CMR variable search result
 */
const computeVariables = (items) => {
  const variables = {}

  items.forEach((variable) => {
    const { meta } = variable
    const { 'concept-id': variableId } = meta

    variables[variableId] = variable
  })

  return variables
}

/**
 * Fetches the variable metadata for the provided variableIds
 * @param {Array} variableIds An array of variable Concept Ids
 * @param {String} jwtToken JWT returned from edlAuthorizer
 */
export const getVariables = async (variableIds, jwtToken) => {
  const variableParams = cmrStringify({
    concept_id: variableIds,
    page_size: 100,
    page_num: 1
  }, ['concept_id'])

  const url = `${getEarthdataConfig(cmrEnv()).cmrHost}/search/variables.umm_json?${variableParams}`

  try {
    const response = await request.post({
      uri: url,
      headers: {
        'Client-Id': getClientId().lambda,
        'Echo-Token': await getEchoToken(jwtToken),
        Accept: getUmmVariableVersionHeader()
      },
      json: true,
      resolveWithFullResponse: true
    })

    const { body } = response
    const { items } = body

    const keywordMappings = computeKeywordMappings(items)
    const variables = computeVariables(items)

    return { keywordMappings, variables }
  } catch (e) {
    parseError(e)
  }

  return null
}
