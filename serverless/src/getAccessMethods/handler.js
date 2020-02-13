import { DOMParser } from 'xmldom'

import { getValueForTag, hasTag } from '../../../sharedUtils/tags'
import { getOptionDefinitions } from './getOptionDefinitions'
import { getServiceOptionDefinitions } from './getServiceOptionDefinitions'
import { getJwtToken } from '../util/getJwtToken'
import { getDbConnection } from '../util/database/getDbConnection'
import { generateFormDigest } from '../util/generateFormDigest'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getVariables } from './getVariables'
import { getOutputFormats } from './getOutputFormats'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getApplicationConfig } from '../../../sharedUtils/config'


/**
 * Retrieve access methods for a provided collection
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const getAccessMethods = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()

  try {
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

    // Retrieve the user record from the database
    const accessConfigRecord = await dbConnection('access_configurations')
      .first('access_method')
      .where({ user_id: userId, collection_id: collectionId })

    // Retrieve the savedAccessConfig for this user and collection
    const authenticatedUser = await dbConnection('users')
      .first('urs_profile')
      .where({ id: userId, environment: cmrEnv() })

    let selectedAccessMethod

    // Iterate through all the access methods
    Object.keys(accessMethods).forEach((methodName) => {
      const method = accessMethods[methodName]

      // Update the accessMethod that matches the savedAccessConfig
      if (accessConfigRecord) {
        const { access_method: savedAccessConfig } = accessConfigRecord

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

            try {
              // Parse the savedAccessConfig values and if it is not valid XML, don't use it
              new DOMParser().parseFromString(form)
              new DOMParser().parseFromString(model)
              new DOMParser().parseFromString(rawModel)

              // Only override values that the user configured
              accessMethods[methodName] = {
                ...accessMethods[methodName],
                form,
                model,
                rawModel,
                form_digest: formDigest
              }
            } catch (error) {
              console.warn('There was a problem parsing the savedAccessConfig values, using the default form instead.')
              return
            }
          }
        }
      }

      // Add the users email address to all forms that appear within the
      // access methods (savedAccessConfigs will overwrite these with saved values)
      if (['ESI', 'ECHO ORDERS'].includes(method.type)) {
        // Retrieve the email address of the currently authenticated user to prepopulate the form
        const { urs_profile: ursProfile } = authenticatedUser
        const { email_address: emailAddress = '' } = ursProfile

        const { form } = method

        // Only attempt to update the form if an email address exists and there is a valid form
        if (emailAddress.length > 0 && form.length > 0) {
          method.form = form.replace('<ecs:email/>', `<ecs:email>${emailAddress}</ecs:email>`)
        }
      }
    })

    // If there is only 1 access method, it should be selected
    if (Object.keys(accessMethods).length === 1) {
      [selectedAccessMethod] = Object.keys(accessMethods)
    }

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ accessMethods, selectedAccessMethod })
    }
  } catch (e) {
    console.log('error', e)

    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: defaultResponseHeaders,
      body: JSON.stringify({ errors: [e] })
    }
  }
}

export default getAccessMethods
