import request from 'request-promise'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { stringify as qsStringify } from 'qs'
import { pick } from './util'

const config = JSON.parse(fs.readFileSync('config.json'))

export default async function cmrGranuleSearch(event) {
  const { jwtToken } = event.requestContext.authorizer
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

  const granuleUrl = `${process.env.cmrHost}`
    + `/search/granules.json?${queryParams}`

  console.log(`CMR Query: ${granuleUrl}`)

  const token = jwt.verify(jwtToken, config.secret)
  const { id: clientId } = config.oauth.client

  try {
    const response = await request.get({
      uri: granuleUrl,
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
