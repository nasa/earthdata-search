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

export function timelineSearch(event, context, callback) {
  let bodyContent = ''

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'echo_collection_id',
    'end_date',
    'format',
    'interval',
    'page_num',
    'page_size',
    'sort_key',
    'start_date'
  ]
  const { params = {} } = JSON.parse(event.body)

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedCmrKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  // Transform the query string hash to an encoded url string
  const queryParams = qsStringify(obj)

  const granuleUrl = `${process.env.cmr_host}`
    + `/search/granules/timeline.json?${queryParams}`

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
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: bodyContent
      })
    })
  }).on('error', (err) => {
    console.error(`Error: ${err.message}`)
  })
}
