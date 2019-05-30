import { pick } from './util'
import { getEarthdataConfig } from '../../sharedUtils/config'

const https = require('https')
const qs = require('qs')

/*
 * Handler to perform a search against NLP
 */
export default function search(event, context, callback) {
  let bodyContent = ''

  // Whitelist parameters supplied by the request
  const permittedNlpKeys = [
    'text'
  ]

  const { params = {} } = JSON.parse(event.body)

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedNlpKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  // Transform the query string hash to an encoded url string
  const queryParams = qs.stringify(obj)

  const nlpUrl = `${getEarthdataConfig('prod').nlpHost}/nlp?${queryParams}`

  console.log(`NLP Query: ${nlpUrl}`)

  https.get(nlpUrl, (resp) => {
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
