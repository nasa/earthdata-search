import { getValueForTag, hasTag } from '../../../sharedUtils/tags'
import { getOptionDefinitions } from './getOptionDefinitions'
import { getServiceOptionDefinitions } from './getServiceOptionDefinitions'
import { getJwtToken } from '../util/getJwtToken'
import { getDbConnection } from '../util/database/getDbConnection'
import { generateFormDigest } from '../util/generateFormDigest'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { isWarmUp } from '../util/isWarmup'
import { getVariables } from './getVariables'
import { getOutputFormats } from './getOutputFormats'


/**
 * Retrieve access methods for a provided collection
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const getAccessMethods = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  // Prevent execution if the event source is the warmer
  if (await isWarmUp(event, context)) return false

  const { body } = event
  const { params = {} } = JSON.parse(body)
  const {
    associations,
    collection_id: collectionId,
    collection_provider: collectionProvider,
    tags
  } = params

  const jwtToken = getJwtToken(event)

  const { id: userId } = getVerifiedJwtToken(jwtToken)

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
      const forms = await getOptionDefinitions(
        collectionProvider,
        optionDefinitions,
        jwtToken
      )

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
      const forms = await getServiceOptionDefinitions(
        collectionProvider,
        serviceOptionDefinitions,
        jwtToken
      )

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
    const opendapData = getValueForTag('subset_service.opendap', tags)
    const { id: serviceId } = opendapData
    const { variables: variableIds } = associations

    const { keywordMappings, variables } = await getVariables(variableIds, jwtToken)
    const { supportedOutputFormats } = await getOutputFormats(serviceId, jwtToken)

    accessMethods.opendap = {
      ...opendapData,
      isValid: true,
      keywordMappings,
      variables,
      supportedOutputFormats
    }
  }

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  // Retrieve the savedAccessConfig for this user and collection
  const accessConfigRecord = await dbConnection('access_configurations')
    .first('access_method')
    .where({ user_id: userId, collection_id: collectionId })

  let selectedAccessMethod

  // Update the accessMethod that matches the savedAccessConfig
  if (accessConfigRecord) {
    const { access_method: savedAccessConfig } = accessConfigRecord

    Object.keys(accessMethods).forEach((methodName) => {
      const method = accessMethods[methodName]
      if (method.type === savedAccessConfig.type && ['download', 'OPeNDAP'].includes(method.type)) {
        selectedAccessMethod = methodName
        return
      }

      if (method.type === savedAccessConfig.type) {
        const { form_digest: formDigest } = savedAccessConfig
        const methodFormDigest = generateFormDigest(method.form)

        // Ensure the saved EchoForm is the same form as the current EchoForm
        if (formDigest === methodFormDigest) {
          selectedAccessMethod = methodName

          // Pull out values from the saved access method that would not have changed
          const {
            form,
            model,
            rawModel,
            form_digest: formDigest
          } = savedAccessConfig

          // Only override values that the user configured
          accessMethods[methodName] = {
            ...accessMethods[methodName],
            form,
            model,
            rawModel,
            form_digest: formDigest
          }
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
