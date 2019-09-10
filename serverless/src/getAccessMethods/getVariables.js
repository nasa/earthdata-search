import request from 'request-promise'
import 'array-foreach-async'

import {
  getEarthdataConfig,
  getClientId
} from '../../../sharedUtils/config'
import { getEdlConfig } from '../util/configUtil'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { cmrStringify } from '../util/cmr/cmrStringify'
import { getAccessTokenFromJwtToken } from '../util/urs/getAccessTokenFromJwtToken'

/**
 * Returns variable ids grouped by their scienceKeywords
 * @param {*} items items field from a CMR variable search result
 */
const computeKeywordMappings = (items) => {
  const calculatedMappings = {}

  items.forEach((variable) => {
    const { meta, umm } = variable
    const { 'concept-id': variableId } = meta
    const { ScienceKeywords: scienceKeywords = [] } = umm

    scienceKeywords.forEach((scienceKeyword) => {
      const values = Object.values(scienceKeyword)
      const leafNode = values[values.length - 1]

      if (!calculatedMappings[leafNode]) calculatedMappings[leafNode] = []

      if (calculatedMappings[leafNode].indexOf(variableId) === -1) {
        calculatedMappings[leafNode].push(variableId)
      }
    })
  })

  const orderedKeywords = {}
  Object.keys(calculatedMappings).sort().forEach((key) => {
    orderedKeywords[key] = calculatedMappings[key]
  })

  return orderedKeywords
}

/**
 * Given the items result from a CMR variable search, returns the variables in an object with the key being the concept id
 * and the value being the variable metadata
 * @param {*} items items field from a CMR variable search result
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
 * @param {*} variableIds Variable Concept Ids
 * @param {*} jwtToken
 */
export const getVariables = async (variableIds, jwtToken) => {
  const variableParams = cmrStringify({
    concept_id: variableIds,
    page_size: 100,
    page_num: 1
  }, ['concept_id'])

  const url = `${getEarthdataConfig(cmrEnv()).cmrHost}/search/variables.umm_json?${variableParams}`

  const userToken = await getAccessTokenFromJwtToken(jwtToken)
  const { access_token: accessToken } = userToken

  // The client id is part of our Earthdata Login credentials
  const edlConfig = await getEdlConfig()
  const { client } = edlConfig
  const { id: clientId } = client

  try {
    const response = await request.post({
      uri: url,
      headers: {
        'Client-Id': getClientId().lambda,
        'Echo-Token': `${accessToken}:${clientId}`
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
    console.log('error', e)
  }
  return null
}
