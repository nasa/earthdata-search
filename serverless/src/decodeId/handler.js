import { deobfuscateId } from '../util/obfuscation/deobfuscateId'
import { getApplicationConfig } from '../../../sharedUtils/config'


/**
 * Decodes an obfuscated id
 * @param {Object} event Details about the HTTP request that it received
 */
const decodeId = (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { queryStringParameters } = event
  const {
    obfuscated_id: obfuscatedId,
    spin = process.env.obfuscationSpin
  } = queryStringParameters

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: defaultResponseHeaders,
    body: JSON.stringify({
      id: deobfuscateId(obfuscatedId, spin)
    })
  }
}

export default decodeId
