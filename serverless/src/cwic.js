import request from 'request-promise'
import { parse as parseXml } from 'fast-xml-parser'
import { pick } from './util'


/**
 * Get the URL that will be used to retrieve granules from OpenSearch
 * @param {String} collectionId - The collection ID to retrieve the url for.
 * @return {Object} An object representing the OpenSearch URL or an error message
 */
const getCwicGranulesUrl = async (collectionId) => {
  // eslint-disable-next-line max-len
  const collectionTemplate = `https://cwic.wgiss.ceos.org/opensearch/datasets/${collectionId}/osdd.xml?clientId=eed-edsc-dev`

  // TODO: We may need a try/catch here but need to investigate what happens when this endpoint is provided a collection that it doesnt support
  const osddResponse = await request.get({
    uri: collectionTemplate,
    resolveWithFullResponse: true
  })

  if (osddResponse.statusCode === 200) {
    const osddBody = parseXml(osddResponse.body, {
      ignoreAttributes: false,
      attributeNamePrefix: ''
    })

    const granuleUrls = osddBody.OpenSearchDescription.Url

    return granuleUrls.find(url => url.type === 'application/atom+xml')
  }

  // TODO: Clean up error handling/responses
  return {
    error: osddResponse.body
  }
}


/**
 * Replaces all valid keys from the users request within the granule url template provided by OpenSearch
 * @param {String} template - An OpenSearch string template representing the URL to retreive granules with.
 * @param {Object} params - The parameters from the users request to supply to the template.
 * @return {String} A formatted URL with the users request parameters inserted
 */
const renderOpenSearchTemplate = (template, params) => {
  // Ampersands in the URL throw off OpenSearch
  let renderedTemplate = template.replace(/&amp;/g, '&')

  let pageSize = 20
  if (params.page_size) {
    pageSize = params.page_size
  }
  renderedTemplate = renderedTemplate.replace(/{count\??}/, pageSize)

  if (params.page_num) {
    const startIndex = ((params.page_num * pageSize) + 1)
    renderedTemplate = renderedTemplate.replace(/{startIndex\??}/, startIndex)
  }

  if (params.bounding_box) {
    renderedTemplate = renderedTemplate.replace(/{geo:box}/, params.bounding_box)
  }

  if (params.point) {
    // OpenSearch doesn't support point search so to add that functionality to
    // to our app we use the point and make a tiny bounding box around the point
    const [lon, lat] = params.point.split(',')
    const epsilon = 0.001

    const boundingBoxFromPoint = [
      lon - epsilon,
      lat - epsilon,
      lon + epsilon,
      lat + epsilon
    ].join(',')

    renderedTemplate = renderedTemplate.replace(/{geo:box}/, boundingBoxFromPoint)
  }

  if (params.temporal) {
    const [timeStart, timeEnd] = params.temporal.split(',')

    renderedTemplate = renderedTemplate.replace(/{time:start}/, timeStart.replace(/\.\d{3}Z$/, 'Z'))
    renderedTemplate = renderedTemplate.replace(/{time:end}/, timeEnd.replace(/\.\d{3}Z$/, 'Z'))
  }

  // Remove any empty params from the template
  return renderedTemplate.replace(/[?&][^=]*=\{[^}]*\}/g, '')
}

/**
 * Retrieves granules from CWIC
 * @param {Object} event - Event object provided by Lambda
 * @return {String} A formatted URL with the users request parameters inserted
 */
export default async function cwicGranuleSearch(event) {
  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'bounding_box',
    'echo_collection_id',
    'page_num',
    'page_size',
    'point',
    'temporal'
  ]
  const params = JSON.parse(event.body)

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedCmrKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  const conceptUrl = await getCwicGranulesUrl(obj.echo_collection_id)

  if (conceptUrl.error) {
    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/xml' },
      body: conceptUrl.error
    }
  }

  const { template } = conceptUrl

  const renderedTemplate = renderOpenSearchTemplate(template, obj)

  console.log(`CWIC Query: ${renderedTemplate}`)

  const granuleResponse = await request.get({
    uri: renderedTemplate,
    resolveWithFullResponse: true
  })

  return {
    isBase64Encoded: false,
    statusCode: granuleResponse.statusCode,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/xml' },
    body: granuleResponse.body
  }
}
