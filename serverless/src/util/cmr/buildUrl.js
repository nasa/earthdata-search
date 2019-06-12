import { pick } from '../../util'
import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { cmrStringify } from './cmrStringify'

/**
 * Builds a URL used to perform a search request
 * @param {object} paramObj Parameters needed to build a search request URL
 */
export const buildURL = (paramObj) => {
  const {
    body,
    nonIndexedKeys,
    path,
    permittedCmrKeys
  } = paramObj

  const { params = {}, ext = 'json' } = JSON.parse(body)

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedCmrKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  // Transform the query string hash to an encoded url string
  const queryParams = cmrStringify(obj, nonIndexedKeys)

  const url = `${getEarthdataConfig('prod').cmrHost}${path}.${ext}?${queryParams}`

  console.log(`CMR Query: ${url}`)

  return url
}
