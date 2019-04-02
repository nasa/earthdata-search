import https from 'https'
import { stringify as qsStringify } from 'qs'

import { pick, cmrStringify } from './util'

export function retrieveConcept(event, context, callback) {
  let bodyContent = ''

  const conceptUrl = `${process.env.cmr_host}`
    + `/search/concepts/${event.pathParameters.id}`

  console.log(conceptUrl)

  https.get(conceptUrl, (resp) => {
    if (resp.statusCode !== 200) {
      bodyContent = resp.statusMessage
    }

    resp.on('data', (chunk) => {
      bodyContent += chunk
    })

    resp.on('end', () => {
      callback(null, {
        isBase64Encoded: false,
        statusCode: resp.statusCode,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: bodyContent
      })
    })
  }).on('error', (err) => {
    console.error(`Error: ${err.message}`)
  })
}

export function collectionSearch(event, context, callback) {
  let bodyContent = ''

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'bounding_box',
    'concept_id',
    'format',
    'has_granules',
    'has_granules_or_cwic',
    'include_facets',
    'include_tags',
    'include_granule_counts',
    'include_has_granules',
    'keyword',
    'line',
    'options',
    'page_num',
    'page_size',
    'point',
    'polygon',
    'science_keywords_h',
    'platform_h',
    'instrument_h',
    'data_center_h',
    'project_h',
    'processing_level_id_h',
    'sort_key',
    'temporal'
  ]

  const nonIndexedKeys = [
    'sort_key',
    'data_center_h',
    'instrument_h',
    'platform_h',
    'project_h',
    'processing_level_id_h'
  ]

  const { params = {} } = JSON.parse(event.body)

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedCmrKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  // Transform the query string hash to an encoded url string
  const queryParams = cmrStringify(obj, nonIndexedKeys)

  const collectionUrl = `${process.env.cmr_host}`
    + `/search/collections.json?${queryParams}`

  console.log(`CMR Query: ${collectionUrl}`)

  https.get(collectionUrl, (resp) => {
    if (resp.statusCode !== 200) {
      bodyContent = resp.statusMessage
    }

    resp.on('data', (chunk) => {
      bodyContent += chunk
    })

    resp.on('end', () => {
      const responseJSON = JSON.parse(bodyContent)

      if (resp.headers['cmr-hits']) {
        responseJSON.feed.hits = resp.headers['cmr-hits']
      }

      callback(null, {
        isBase64Encoded: false,
        statusCode: resp.statusCode,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(responseJSON)
      })
    })
  }).on('error', (err) => {
    console.error(`Error: ${err.message}`)
  })
}

export function granuleSearch(event, context, callback) {
  let bodyContent = ''

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'echo_collection_id',
    'format',
    'page_num',
    'page_size',
    'sort_key'
  ]
  const { params = {} } = JSON.parse(event.body)

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedCmrKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  // Transform the query string hash to an encoded url string
  const queryParams = qsStringify(obj)

  const granuleUrl = `${process.env.cmr_host}`
    + `/search/granules.json?${queryParams}`

  console.log(`CMR Query: ${granuleUrl}`)

  https.get(granuleUrl, (resp) => {
    if (resp.statusCode !== 200) {
      bodyContent = resp.statusMessage
    }

    resp.on('data', (chunk) => {
      bodyContent += chunk
    })

    resp.on('end', () => {
      callback(null, {
        isBase64Encoded: false,
        statusCode: resp.statusCode,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: bodyContent
      })
    })
  }).on('error', (err) => {
    console.error(`Error: ${err.message}`)
  })
}
