import { pick } from '../pick'

import { prepKeysForCmr } from '../../../../sharedUtils/prepKeysForCmr'

/**
 * Builds a URL used to perform a search request
 * @param {object} paramObj Parameters needed to build a search request URL
 */
export const buildParams = (paramObj) => {
  const {
    body,
    nonIndexedKeys,
    permittedCmrKeys,
    stringifyResult = true
  } = paramObj

  const { params = {} } = JSON.parse(body)

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedCmrKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  // For JSON requests we want dont want to stringify the params returned
  if (stringifyResult) {
    // Transform the query string hash to an encoded url string
    const queryParams = prepKeysForCmr(obj, nonIndexedKeys)

    console.log('CMR Query', queryParams)

    return queryParams
  }

  console.log('CMR Query', JSON.stringify(obj, null, 4))

  return obj
}
