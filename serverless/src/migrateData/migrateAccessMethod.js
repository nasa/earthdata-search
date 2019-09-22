import request from 'request-promise'
import { getEarthdataConfig, getClientId } from '../../../sharedUtils/config'
import { generateFormDigest } from '../util/generateFormDigest'
import { tagName } from '../../../sharedUtils/tags'

export const migrateAccesMethod = async (
  methodJson,
  cmrEnvironment,
  collectionMetadata,
  cmrToken
) => {
  const {
    type,
    method,
    model,
    rawModel
  } = methodJson

  const newAccessMethod = {
    isValid: true,
    type
  }

  if (['service', 'order', 'opendap', 'download'].includes(type)) {
    newAccessMethod.rawModel = rawModel
    newAccessMethod.model = model

    const { tags = {} } = collectionMetadata
    const tagKeys = Object.keys(tags)

    const downloadTagKey = tagName('collection_capabilities')
    const opendapTagKey = tagName('subset_service.opendap')
    const esiTagKey = tagName('subset_service.esi')
    const echoOrdersTagKey = tagName('subset_service.echo_orders')

    let isDownload = type === 'download' && tagKeys.includes(downloadTagKey)
    if (isDownload) {
      const collectionCapabilityTags = tags[downloadTagKey]
      const { granule_online_access_flag: onlineAcessFlag } = collectionCapabilityTags

      isDownload = onlineAcessFlag
    }
    const isService = type === 'service' && tagKeys.includes(esiTagKey)
    const isOrder = type === 'order' && tagKeys.includes(echoOrdersTagKey)
    const isOpendap = type === 'opendap' && tagKeys.includes(opendapTagKey)

    if (isService) {
      const subsettingTag = tags[esiTagKey]
      const { data: tagData } = subsettingTag

      const {
        id: ummSId,
        type: tagType,
        url,
        updated_at: tagUpdatedAt,
        service_option_definitions: serviceOptions = []
      } = tagData

      newAccessMethod.id = ummSId
      newAccessMethod.type = tagType
      newAccessMethod.updated_at = tagUpdatedAt
      newAccessMethod.url = url

      await serviceOptions.forEachAsync(async (serviceOption) => {
        const { id, name } = serviceOption
        if (name === method) {
          newAccessMethod.service_option_definition = serviceOption

          const url = `${getEarthdataConfig(cmrEnvironment).cmrHost}/legacy-services/rest/service_option_definitions/${id}.json`

          const response = await request.get({
            uri: url,
            resolveWithFullResponse: true,
            headers: {
              'Client-Id': getClientId().lambda,
              'Echo-Token': cmrToken
            }
          })

          const { body } = response
          const {
            service_option_definition: responseServiceOptionDefinition
          } = JSON.parse(body)
          const { form } = responseServiceOptionDefinition

          newAccessMethod.form = form
          newAccessMethod.form_digest = generateFormDigest(form)
        }
      })
    }

    if (isOrder) {
      const subsettingTag = tags[echoOrdersTagKey]
      const { data: tagData } = subsettingTag

      const {
        id: ummSId,
        type: tagType,
        url,
        updated_at: tagUpdatedAt,
        option_definitions: optionDefinitions = []
      } = tagData

      newAccessMethod.id = ummSId
      newAccessMethod.type = tagType
      newAccessMethod.updated_at = tagUpdatedAt
      newAccessMethod.url = url

      await optionDefinitions.forEachAsync(async (optionDefinition) => {
        const { id, name } = optionDefinition

        if (name === method) {
          newAccessMethod.option_definition = optionDefinition

          const url = `${getEarthdataConfig(cmrEnvironment).cmrHost}/legacy-services/rest/option_definitions/${id}.json`

          const response = await request.get({
            uri: url,
            resolveWithFullResponse: true,
            headers: {
              'Client-Id': getClientId().lambda,
              'Echo-Token': cmrToken
            }
          })

          const { body } = response
          const {
            option_definition: responseOptionDefinition
          } = JSON.parse(body)
          const { form } = responseOptionDefinition

          newAccessMethod.form = form
          newAccessMethod.form_digest = generateFormDigest(form)
        }
      })
    }

    if (isOpendap) {
      const subsettingTag = tags[opendapTagKey]
      const { data: tagData } = subsettingTag

      const {
        id: ummSId,
        type: tagType,
        updated_at: tagUpdatedAt
      } = tagData

      newAccessMethod.id = ummSId
      newAccessMethod.type = tagType
      newAccessMethod.updated_at = tagUpdatedAt
    }

    if (isOrder || isService || isOpendap || isDownload) {
      return newAccessMethod
    }
  }

  return false
}
