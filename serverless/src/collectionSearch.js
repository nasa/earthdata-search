import request from 'request-promise'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { pick, cmrStringify } from './util'

const config = JSON.parse(fs.readFileSync('config.json'))

export default async function collectionSearch(event) {
  const { jwtToken } = event.requestContext.authorizer
  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'bounding_box',
    'collection_data_type',
    'concept_id',
    'data_center_h',
    'format',
    'has_granules_or_cwic',
    'has_granules',
    'include_facets',
    'include_granule_counts',
    'include_has_granules',
    'include_tags',
    'instrument_h',
    'keyword',
    'line',
    'options',
    'page_num',
    'page_size',
    'platform_h',
    'point',
    'polygon',
    'processing_level_id_h',
    'project_h',
    'science_keywords_h',
    'sort_key',
    'tag_key',
    'temporal'
  ]

  const nonIndexedKeys = [
    'collection_data_type',
    'data_center_h',
    'instrument_h',
    'platform_h',
    'processing_level_id_h',
    'project_h',
    'sort_key',
    'tag_key'
  ]

  const { params = {} } = JSON.parse(event.body)

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedCmrKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  // Transform the query string hash to an encoded url string
  const queryParams = cmrStringify(obj, nonIndexedKeys)

  const collectionUrl = `${process.env.cmrHost}`
      + `/search/collections.json?${queryParams}`

  console.log(`CMR Query: ${collectionUrl}`)

  const token = jwt.verify(jwtToken, config.secret)
  const { id: clientId } = config.oauth.client
  try {
    const response = await request.get({
      uri: collectionUrl,
      resolveWithFullResponse: true,
      headers: {
        'Echo-Token': `${token.token.access_token}:${clientId}`
      }
    })

    const { body, headers } = response

    const { 'access-control-expose-headers': exposeHeaders = '' } = headers
    const exposeHeadersList = exposeHeaders.split(',').filter(header => header !== '')
    exposeHeadersList.push('jwt-token')
    const updatedExposeHeaders = exposeHeadersList.join(', ')

    return {
      statusCode: response.statusCode,
      headers: {
        ...headers,
        'access-control-expose-headers': updatedExposeHeaders,
        'jwt-token': jwtToken
      },
      body
    }
  } catch (e) {
    console.log('error', e)
    if (e.response) {
      return {
        statusCode: e.statusCode,
        body: e.response.body
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Oh No!' })
    }
  }
}
