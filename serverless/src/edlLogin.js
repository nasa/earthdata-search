import fs from 'fs'

const config = JSON.parse(fs.readFileSync('config.json'))

/**
 * Handler for redirecting the user to the correct EDL login URL
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 */
export default function edlLogin(event, context, callback) {
  const params = event.queryStringParameters

  const { state } = params

  const { redirectUri } = config
  const clientId = config.oauth.client.id

  callback(null, {
    statusCode: 307,
    headers: {
      Location: `${process.env.edlHost}/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`
    }
  })
}
