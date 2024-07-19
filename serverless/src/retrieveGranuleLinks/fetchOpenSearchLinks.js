import axios from 'axios'
import { pick } from 'lodash-es'

import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'
import { getOpenSearchOsddLink } from '../../../sharedUtils/getOpenSearchOsddLink'
import { renderOpenSearchTemplate } from '../openSearchGranuleSearch/renderOpenSearchTemplate'
import { getOpenSearchGranulesUrl } from '../openSearchGranuleSearch/getOpenSearchGranulesUrl'
import { getClientId } from '../../../sharedUtils/getClientId'
import { requestTimeout } from '../util/requestTimeout'
import { wrapAxios } from '../util/wrapAxios'
import transformOpenSearchResponse from './transformOpenSearchResponse'

const wrappedAxios = wrapAxios(axios)

// TODO is this code used anywhere else? is the openSearchGranuleSearch lambda still needed?
export const fetchOpenSearchLinks = async ({
  collectionMetadata,
  collectionId,
  granuleParams,
  pageNum
}) => {
  const { defaultResponseHeaders } = getApplicationConfig()
  const responseHeaders = {
    ...defaultResponseHeaders,
    'Content-Type': 'application/xml'
  }

  const { openSearchGranuleLinksPageSize } = getApplicationConfig()
  const pageSize = parseInt(openSearchGranuleLinksPageSize, 10)
  // eslint-disable-next-line no-param-reassign
  granuleParams = {
    ...granuleParams,
    pageSize,
    pageNum
  }

  const openSearchOsdd = getOpenSearchOsddLink(collectionMetadata)

  const permittedOpenSearchParams = [
    'boundingBox',
    'echoCollectionId',
    'openSearchOsdd',
    'pageNum',
    'pageSize',
    'point',
    'temporal'
  ]

  console.log(`Parameters received: ${Object.keys(granuleParams)}`)

  const obj = pick(granuleParams, permittedOpenSearchParams)

  const openSearchUrlResponse = await getOpenSearchGranulesUrl(collectionId, openSearchOsdd)

  console.log(`Completed OSDD request with status ${openSearchUrlResponse.statusCode}.`)

  if (openSearchUrlResponse.statusCode !== 200) {
    const { body } = openSearchUrlResponse

    const parsedResponse = JSON.parse(body)

    return {
      isBase64Encoded: false,
      statusCode: openSearchUrlResponse.statusCode,
      headers: responseHeaders,
      body: JSON.stringify({
        errors: parsedResponse.errors
      })
    }
  }

  const { template } = openSearchUrlResponse.body

  const renderedTemplate = renderOpenSearchTemplate(template, obj)

  console.log(`OpenSearch Granule Query: ${renderedTemplate}`)

  try {
    // The value for timeout here should match the value defined in the serverless config
    const granuleResponse = await wrappedAxios({
      method: 'get',
      url: renderedTemplate,
      timeout: requestTimeout({
        definedTimeout: 60
      }),
      headers: {
        'Client-Id': getClientId().lambda
      }
    })

    const { config, data: responseData } = granuleResponse
    const { elapsedTime } = config

    console.log(`OpenSearch Granule Request took ${elapsedTime} ms`)

    const { feed } = transformOpenSearchResponse(responseData)
    const { entry } = feed

    const downloadLinks = []
    const browseLinks = []

    entry.forEach((granule) => {
      const {
        browse_url: browseUrl,
        link: links = []
      } = granule

      const [downloadLink] = links.filter((link) => link.rel === 'enclosure')

      const { href } = downloadLink
      downloadLinks.push(href)

      if (browseUrl) {
        browseLinks.push(browseUrl)
      }
    })

    return {
      links: {
        browse: browseLinks,
        download: downloadLinks
      }
    }
  } catch (error) {
    const { code, config } = error
    const { timeout } = config

    // Handle timeouts specifically so that we can use a more human
    // readable error, the default uses millisecond
    if (code === 'ECONNABORTED') {
      return {
        isBase64Encoded: false,
        headers: defaultResponseHeaders,
        statusCode: 504,
        body: JSON.stringify({
          errors: [
            `Timeout of ${timeout / 1000}s exceeded`
          ]
        })
      }
    }

    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}
