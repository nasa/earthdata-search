import { pick } from '../pick'
import { cmrStringify } from './cmrStringify'

/**
 * Builds a URL used to perform a search request
 * @param {object} paramObj Parameters needed to build a search request URL
 */
export const buildParams = (paramObj) => {
  const {
    body,
    nonIndexedKeys,
    permittedCmrKeys
  } = paramObj

  const { params = {} } = JSON.parse(body)

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedCmrKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  // Transform the query string hash to an encoded url string
  const queryParams = cmrStringify(obj, nonIndexedKeys)

  console.log('CMR Query', queryParams)

  return queryParams
}
