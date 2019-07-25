import { getValueForTag, hasTag } from '../../../sharedUtils/tags'
import { getOptionDefinitions } from './getOptionDefinitions'
import { getServiceOptionDefinitions } from './getServiceOptionDefinitions'
import { getJwtToken } from '../util'
import { getDbConnection } from '../util/database/getDbConnection'
import { generateFormDigest } from '../util/generateFormDigest'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getUsernameFromToken } from '../util/getUsernameFromToken'

// Knex database connection object
let dbConnection = null

const getAccessMethods = async (event) => {
  const { body } = event
  const { params = {} } = JSON.parse(body)

  const { collection_id: collectionId, tags } = params

  const jwtToken = getJwtToken(event)

  const { token } = getVerifiedJwtToken(jwtToken)
  const username = getUsernameFromToken(token)

  const hasEchoOrders = hasTag({ tags }, 'subset_service.echo_orders')
  const hasEsi = hasTag({ tags }, 'subset_service.esi')
  const hasOpendap = hasTag({ tags }, 'subset_service.opendap')
  const capabilitiesData = getValueForTag('collection_capabilities', tags)
  const { granule_online_access_flag: downloadable } = capabilitiesData || {}

  const accessMethods = {}
  if (downloadable) {
    accessMethods.download = {
      isValid: true,
      type: 'download'
    }
  }

  if (hasEchoOrders) {
    const echoOrderData = getValueForTag('subset_service.echo_orders', tags)
    const { option_definitions: optionDefinitions } = echoOrderData

    if (optionDefinitions) {
      const forms = await getOptionDefinitions(optionDefinitions, jwtToken)

      forms.forEach((form) => {
        const [key] = Object.keys(form)
        accessMethods[key] = {
          ...echoOrderData,
          ...form[key]
        }
      })
    }
  }

  if (hasEsi) {
    const esiData = getValueForTag('subset_service.esi', tags)
    const { service_option_definitions: serviceOptionDefinitions } = esiData

    if (serviceOptionDefinitions) {
      const forms = await getServiceOptionDefinitions(serviceOptionDefinitions, jwtToken)

      forms.forEach((form) => {
        const [key] = Object.keys(form)
        accessMethods[key] = {
          ...esiData,
          ...form[key]
        }
      })
    }
  }

  if (hasOpendap) {
    // TODO implement this stuff
    accessMethods.opendap = {
      type: 'OPeNDAP'
    }
  }

  // Retrive a connection to the database
  dbConnection = await getDbConnection(dbConnection)

  // Retrieve the user from the database
  const userRecord = await dbConnection('users').first('id').where({ urs_id: username })

  // Retrieve the savedAccessConfig for this user and collection
  const accessConfigRecord = await dbConnection('access_configurations')
    .first('access_method')
    .where({ user_id: userRecord.id, collection_id: collectionId })

  let selectedAccessMethod

  // Update the accessMethod that matches the savedAccessConfig
  if (accessConfigRecord) {
    const { access_method: savedAccessConfig } = accessConfigRecord

    Object.keys(accessMethods).forEach((methodName) => {
      const method = accessMethods[methodName]
      if (method.type === 'download' && savedAccessConfig.type === 'download') {
        selectedAccessMethod = methodName
        return
      }

      if (method.type === savedAccessConfig.type) {
        const { form_digest: formDigest } = savedAccessConfig
        const methodFormDigest = generateFormDigest(method.form)

        // Ensure the saved EchoForm is the same form as the current EchoForm
        if (formDigest === methodFormDigest) {
          selectedAccessMethod = methodName
          accessMethods[methodName] = savedAccessConfig
        }
      }
    })
  }

  // If there is only 1 access method, it should be selected
  if (Object.keys(accessMethods).length === 1) {
    [selectedAccessMethod] = Object.keys(accessMethods)
  }

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ accessMethods, selectedAccessMethod })
  }
}

export default getAccessMethods
