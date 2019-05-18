import https from 'https'

function retrieveConcept(event, context, callback) {
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

export default retrieveConcept
