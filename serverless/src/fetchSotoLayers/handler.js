import axios from 'axios'
import { parse as parseXml } from 'fast-xml-parser'

import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Handler for retreiving a users contact information
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const fetchSotoLayers = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  // Fetch the SOTO Capabilities document
  const capabilitiesUrl = 'https://podaac-tools.jpl.nasa.gov/soto/default-data/soto_capabilities.xml'

  try {
    const sotoResponse = await axios({
      method: 'get',
      url: capabilitiesUrl
    })

    const parsedCapabilities = parseXml(sotoResponse.data, {
      ignoreAttributes: false,
      attributeNamePrefix: ''
    })

    const { Capabilities: capabilities = {} } = parsedCapabilities
    const { Contents: contents = {} } = capabilities
    let { Layer: capabilityLayers = [] } = contents

    capabilityLayers = [].concat(capabilityLayers).filter(Boolean).map((layer) => layer['ows:Identifier'])

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify(capabilityLayers)
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default fetchSotoLayers
