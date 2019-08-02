import request from 'request-promise'
import { stringify } from 'qs'
import { pick } from '../util/pick'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { isWarmUp } from '../util/isWarmup'

/*
 * Handler to perform a search against NLP
 */
const nlpSearch = async (event) => {
  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event)) return false

  // The headers we'll send back regardless of our response
  const responseHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/xml'
  }

  // Whitelist parameters supplied by the request
  const permittedNlpKeys = [
    'text'
  ]

  const { params = {} } = JSON.parse(event.body)

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedNlpKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  // Transform the query string hash to an encoded url string
  const queryParams = stringify(obj)

  const nlpUrl = `${getEarthdataConfig(cmrEnv()).nlpHost}/nlp?${queryParams}`

  console.log(`NLP Query: ${nlpUrl}`)

  try {
    const nlpResponse = await request.get({
      uri: nlpUrl,
      resolveWithFullResponse: true
    })

    return {
      isBase64Encoded: false,
      statusCode: nlpResponse.statusCode,
      headers: responseHeaders,
      body: JSON.stringify(nlpResponse.body)
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      statusCode: e.statusCode,
      headers: responseHeaders,
      body: JSON.stringify({ errors: [e.error] })
    }
  }
}

export default nlpSearch
