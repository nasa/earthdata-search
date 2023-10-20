import { camelCase, uniq } from 'lodash'

import { isDownloadable } from '../../../../../sharedUtils/isDownloadable'
import { generateFormDigest } from './generateFormDigest'
import { getVariables } from './getVariables'
import { supportsBoundingBoxSubsetting } from './supportsBoundingBoxSubsetting'
import { supportsShapefileSubsetting } from './supportsShapefileSubsetting'
import { supportsTemporalSubsetting } from './supportsTemporalSubsetting'
import { supportsVariableSubsetting } from './supportsVariableSubsetting'

/**
 * Builds the different access methods available for the provided collection
 * @param {object} collectionMetadata Collection Metadata
 * @param {boolean} isOpenSearch Is the collection an open search collection
 * @returns {object} Access methods
 */
export const buildAccessMethods = (collectionMetadata, isOpenSearch) => {
  const {
    granules = {},
    services = {},
    variables: collectionAssociatedVariables = {}
  } = collectionMetadata

  const accessMethods = {}
  let harmonyIndex = 0
  let associatedVariables = collectionAssociatedVariables
  const { items: serviceItems = null } = services

  if (serviceItems !== null) {
    serviceItems.forEach((serviceItem) => {
      const {
        conceptId: serviceConceptId,
        orderOptions,
        type: serviceType,
        url,
        longName,
        maxItemsPerOrder,
        name,
        supportedReformattings,
        variables: serviceAssociatedVariables = {}
      } = serviceItem

      if (serviceAssociatedVariables.items) {
        associatedVariables = serviceAssociatedVariables
      }

      // Only process service types that EDSC supports
      const supportedServiceTypes = ['esi', 'echo orders', 'opendap', 'harmony']
      if (!supportedServiceTypes.includes(serviceType.toLowerCase())) return

      const { urlValue } = url

      const supportsOrderOptions = ['esi', 'echo orders']

      // Only process orderOptions if the service type uses orderOptions
      if (supportsOrderOptions.includes(serviceType.toLowerCase())) {
        const { items: orderOptionsItems } = orderOptions
        if (orderOptionsItems === null) return

        orderOptionsItems.forEach((orderOptionItem, orderOptionIndex) => {
          const {
            conceptId: orderOptionConceptId,
            form,
            name: orderOptionName
          } = orderOptionItem

          const method = {
            type: serviceType,
            maxItemsPerOrder,
            url: urlValue,
            optionDefinition: {
              conceptId: orderOptionConceptId,
              name: orderOptionName
            },
            form,
            formDigest: generateFormDigest(form)
          }

          let methodKey = camelCase(serviceType)

          // `echoOrders` needs to be singular to match existing savedAccessConfigurations
          if (methodKey === 'echoOrders') {
            methodKey = 'echoOrder'
          }

          accessMethods[`${methodKey}${orderOptionIndex}`] = method
        })
      }

      if (serviceType.toLowerCase() === 'opendap') {
        const {
          hierarchyMappings,
          keywordMappings,
          variables
        } = getVariables(associatedVariables)

        const outputFormats = []

        if (supportedReformattings) {
          supportedReformattings.forEach((reformatting) => {
            const { supportedOutputFormats } = reformatting

            // Collect all supported output formats from each mapping
            outputFormats.push(...supportedOutputFormats)
          })
        }

        accessMethods.opendap = {
          hierarchyMappings,
          id: serviceConceptId,
          isValid: true,
          keywordMappings,
          longName,
          name,
          supportedOutputFormats: uniq(outputFormats),
          supportsVariableSubsetting: supportsVariableSubsetting(serviceItem),
          type: serviceType,
          variables
        }
      }

      if (serviceType.toLowerCase() === 'harmony') {
        const {
          hierarchyMappings,
          keywordMappings,
          variables
        } = getVariables(associatedVariables)
        const {
          supportedOutputProjections
        } = serviceItem

        const outputFormats = []

        if (supportedReformattings) {
          supportedReformattings.forEach((reformatting) => {
            const { supportedOutputFormats } = reformatting

            // Collect all supported output formats from each mapping
            outputFormats.push(...supportedOutputFormats)
          })
        }

        let outputProjections = []
        if (supportedOutputProjections) {
          outputProjections = supportedOutputProjections.filter((projection) => {
            const { projectionAuthority } = projection

            return projectionAuthority != null
          }).map((projection) => {
            const { projectionAuthority } = projection

            return projectionAuthority
          })
        }

        accessMethods[`harmony${harmonyIndex}`] = {
          enableTemporalSubsetting: true,
          enableSpatialSubsetting: true,
          hierarchyMappings,
          id: serviceConceptId,
          isValid: true,
          keywordMappings,
          longName,
          name,
          supportedOutputFormats: uniq(outputFormats),
          supportedOutputProjections: outputProjections,
          supportsBoundingBoxSubsetting: supportsBoundingBoxSubsetting(serviceItem),
          supportsShapefileSubsetting: supportsShapefileSubsetting(serviceItem),
          supportsTemporalSubsetting: supportsTemporalSubsetting(serviceItem),
          supportsVariableSubsetting: supportsVariableSubsetting(serviceItem),
          type: serviceType,
          url: urlValue,
          variables
        }

        harmonyIndex += 1
      }
    })
  }

  // Determine if the collection should have the downloadable accessMethod
  let onlineAccessFlag = false

  if (granules) {
    // If the collection has granules, check their online access flags to
    // determine if this collection is downloadable
    const { items: granuleItems } = granules

    if (granuleItems) {
      onlineAccessFlag = isDownloadable(granuleItems)
    }

    if (onlineAccessFlag || isOpenSearch) {
      accessMethods.download = {
        isValid: true,
        type: 'download'
      }
    }
  }

  return accessMethods
}
