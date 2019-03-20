import pick from './util'

const https = require('https')
const qs = require('qs')

export default function search(event, context, callback) {
  let bodyContent = ''

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'text'
  ]
  const obj = pick(event.queryStringParameters, permittedCmrKeys)

  // Transform the query string hash to an encoded url string
  const queryParams = qs.stringify(obj)

  const nlpUrl = `${process.env.nlp_host}`
    + `/nlp?${queryParams}`

  console.log(nlpUrl)

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
