import fs from 'fs'
import { earthdataLoginAuth, AWSLambdaEDLAdapter } from 'earthdata-login-client'

const config = JSON.parse(fs.readFileSync('config.json'))

const ursCallback = earthdataLoginAuth(AWSLambdaEDLAdapter, config, (event, context, callback) => {
  callback(null, {
    isBase64Encoded: false,
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(true)
  })
})

export default ursCallback
