import { pick, objToQueryString } from './util'

const https = require('https')

export function retrieveConcept(event, context, callback) {
  let bodyContent = ''

  const conceptUrl = `${process.env.cmr_host}`
    + `/search/concepts/${event.pathParameters.id}`

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
    'page_num',
    'page_size',
    'point',
    'polygon',
    'sort_key',
    'sort_key[]', // support both single and multiple sort keys
    'temporal'
  ]
  console.log(event.queryStringParameters)
  const obj = pick(event.queryStringParameters, permittedCmrKeys)

  // Transform the query string hash to an encoded url string
  const queryParams = objToQueryString(obj)
  console.log(queryParams)

  const collectionUrl = `${process.env.cmr_host}`
    + `/search/collections.json?${queryParams}`

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
  const obj = pick(event.queryStringParameters, permittedCmrKeys)

  // Transform the query string hash to an encoded url string
  const queryParams = objToQueryString(obj)

  const granuleUrl = `${process.env.cmr_host}`
    + `/search/granules.json?${queryParams}`

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

export function collectionGranules(event, context, callback) {
  let bodyContent = ''

  const granuleUrl = `${process.env.cmr_host}`
    + `/search/granules.json?echo_collection_id=${event.pathParameters.id}`

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
