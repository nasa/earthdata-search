import { getValueForTag, hasTag } from '../../../sharedUtils/tags'
import { getOptionDefinitions } from './getOptionDefinitions'

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
          ...form[key],
          type: 'ECHO_ORDER'
        }
      })
    }
  }

  if (hasEsi) {
    // TODO implement this stuff
    accessMethods.esi = {
      type: 'esi'
    }
  }

  if (hasOpendap) {
    // TODO implement this stuff
    accessMethods.opendap = {
      type: 'opendap'
    }
  }

  // TODO implement default access configuration

  return {
    statusCode: 200,
    body: JSON.stringify({ accessMethods })
  }
}

export default getAccessMethods
