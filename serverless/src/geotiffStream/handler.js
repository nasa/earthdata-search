import { streamifyResponse } from 'lambda-stream'

import { getApplicationConfig } from '../../../sharedUtils/config'

const UPSTREAM_BASE = 'https://data.lpdaac.earthdatacloud.nasa.gov/lp-prod-protected/AST_08.004/AST_08_00401162026050524_20260225163110/AST_08_00401162026050524_20260225163110_SKT.tif'
const PATH_PREFIX = '/tif-proxy/'

/**
 * Fetches a (possibly range-limited) file from LP DAAC's protected bucket using our
 * server-side Earthdata Login token, so the browser never sees the credential.
 */
export const fetchUpstream = async (upstreamPath, rangeHeader, appHeaders) => {
  const upstreamUrl = `${UPSTREAM_BASE}`
  const token = appHeaders.authorization
  const upstreamHeaders = {
    Authorization: token
  }

  if (rangeHeader) upstreamHeaders.Range = rangeHeader

  return fetch(upstreamUrl, { headers: upstreamHeaders })
}

/**
 * Wraps the raw response stream with Lambda's HttpResponseStream in production, matching
 * how the rest of the app's streaming handlers behave. In development, `originalResponseStream`
 * is already a usable PassThrough stream provided by lambda-stream.
 */
const wrapResponseStream = (originalResponseStream) => originalResponseStream

const writeSimpleResponse = (originalResponseStream, defaultResponseHeaders, statusCode, message) => {
  const httpResponseMetadata = {
    statusCode,
    headers: {
      ...defaultResponseHeaders,
      'Content-Type': 'text/plain'
    }
  }

  const responseStream = wrapResponseStream(originalResponseStream, httpResponseMetadata)

  responseStream.write(`${message}\n`)
  responseStream.end()
}

export const handler = async (event, originalResponseStream) => {
  const { defaultResponseHeaders } = getApplicationConfig()
  console.log('🚀 ~ file: handler.js:54 ~ defaultResponseHeaders:', defaultResponseHeaders)

  const {
    requestContext = {},
    rawPath = '',
    headers = {}
  } = event
  console.log('🚀 ~ file: handler.js:54 ~ headers:', headers)
  const method = requestContext?.http?.method ?? 'GET'
  console.log('originalResponseStream:', originalResponseStream)
  console.log('has write?', typeof originalResponseStream?.write)
  console.log('constructor:', originalResponseStream?.constructor?.name)
  // If (method !== 'GET' && method !== 'HEAD') {
  //   writeSimpleResponse(originalResponseStream, defaultResponseHeaders, 405, 'Method not allowed')

  //   return
  // }

  // if (!rawPath.startsWith(PATH_PREFIX)) {
  //   writeSimpleResponse(originalResponseStream, defaultResponseHeaders, 404, 'Not found')

  //   return
  // }

  const upstreamPath = rawPath.slice(PATH_PREFIX.length)
  console.log('🚀 ~ file: handler.js:76 ~ upstreamPath:', upstreamPath)
  const rangeHeader = headers.range ?? headers.Range

  console.log(`Proxying "${upstreamPath}"${rangeHeader ? ` with Range: ${rangeHeader}` : ''}`)

  let upstreamRes
  try {
    upstreamRes = await fetchUpstream(upstreamPath, rangeHeader, headers)
    console.log('🚀 ~ file: handler.js:82 ~ upstreamRes:', upstreamRes)
  } catch (error) {
    console.log('Upstream fetch failed:', error)

    writeSimpleResponse(originalResponseStream, defaultResponseHeaders, 502, `Upstream fetch failed: ${error.message}`)

    return
  }

  const upstreamHeadersToForward = {};
  ['content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified'].forEach((header) => {
    const value = upstreamRes.headers.get(header)
    if (value) upstreamHeadersToForward[header] = value
  })

  const httpResponseMetadata = {
    statusCode: upstreamRes.status,
    headers: {
      ...defaultResponseHeaders,
      'Content-Type': upstreamRes.headers.get('content-type') || 'application/octet-stream',
      ...upstreamHeadersToForward
    }
  }

  const responseStream = wrapResponseStream(originalResponseStream, httpResponseMetadata)

  if (!upstreamRes.body) {
    responseStream.end()

    return
  }

  const reader = upstreamRes.body.getReader()

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read()

    if (done) break

    responseStream.write(Buffer.from(value))
  }

  responseStream.end()
}

export default streamifyResponse(handler)
