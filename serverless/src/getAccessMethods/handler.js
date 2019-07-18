import { getValueForTag, hasTag } from '../../../sharedUtils/tags'
import { getOptionDefinitions } from './getOptionDefinitions'
import { getServiceOptionDefinitions } from './getServiceOptionDefinitions'

import { getJwtToken } from '../util'

const getAccessMethods = async (event) => {
  const { body } = event
  const { params = {} } = JSON.parse(body)

  // TODO will need collectionId for default access configurations
  // eslint-disable-next-line no-unused-vars
  const { collection_id: collectionId, tags } = params

  const jwtToken = getJwtToken(event)

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

  // TODO implement default access configuration

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ accessMethods })
  }
}

export default getAccessMethods
