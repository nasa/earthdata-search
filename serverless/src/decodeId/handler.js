import { deobfuscateId } from '../util/obfuscation/deobfuscateId'

const decodeId = async (event) => {
  const { queryStringParameters } = event
  const {
    obfuscated_id: obfuscatedId,
    spin = process.env.obfuscationSpin
  } = queryStringParameters

  return {
    isBase64Encoded: false,
    statusCode: 200,
    body: JSON.stringify({
      id: deobfuscateId(obfuscatedId, spin)
    })
  }
}

export default decodeId
