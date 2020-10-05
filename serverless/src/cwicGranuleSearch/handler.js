import request from 'request-promise'

import { getApplicationConfig } from '../../../sharedUtils/config'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getCwicGranulesUrl } from './getCwicGranulesUrl'
import { parseError } from '../../../sharedUtils/parseError'
import { pick } from '../util/pick'
import { prepareExposeHeaders } from '../util/cmr/prepareExposeHeaders'
import { renderOpenSearchTemplate } from './renderOpenSearchTemplate'
import { requestTimeout } from '../util/requestTimeout'

/**
 * Retrieve granules from CWIC
 * @param {Object} event Details about the HTTP request that it received
 */
const cwicGranuleSearch = async (event) => {
  // The headers we'll send back regardless of our response
  const { defaultResponseHeaders } = getApplicationConfig()
  const responseHeaders = {
    ...defaultResponseHeaders,
    'Content-Type': 'application/xml'
  }

  const { body } = event
  const { params } = JSON.parse(body)

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'boundingBox',
    'echoCollectionId',
    'pageNum',
    'pageSize',
    'point',
    'temporal'
  ]

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedCmrKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  const conceptUrl = await getCwicGranulesUrl(obj.echoCollectionId)

  console.log(`Completed OSDD request with status ${conceptUrl.statusCode}.`)

  if (conceptUrl.statusCode !== 200) {
    return {
      isBase64Encoded: false,
      statusCode: conceptUrl.statusCode,
      headers: responseHeaders,
      body: conceptUrl.errors
    }
  }

  const { template } = conceptUrl.body

  const renderedTemplate = renderOpenSearchTemplate(template, obj)

  console.log(`CWIC Granule Query: ${renderedTemplate}`)

  try {
    const granuleResponse = await request.get({
      time: true,
      uri: renderedTemplate,
      timeout: requestTimeout(),
      resolveWithFullResponse: true,
      headers: {
        'Client-Id': getClientId().lambda
      }
    })

    console.log(`CWIC Granule Request took ${granuleResponse.elapsedTime} ms`)

    return {
      isBase64Encoded: false,
      statusCode: granuleResponse.statusCode,
      headers: {
        ...responseHeaders,
        'access-control-expose-headers': prepareExposeHeaders(responseHeaders)
      },
      body: granuleResponse.body
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default cwicGranuleSearch
