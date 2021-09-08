import { isEmpty } from 'lodash'
import template from 'url-template'

import { hasTag } from '../../../../../sharedUtils/tags'
import { getHandoffValue } from './getHandoffValue'
import { fetchGiovanniHandoffUrl } from './giovanni'
import { fetchOpenAltimetryHandoffUrl } from './openAltimetry'

/**
 * Generate an array of objects that will be used to render smart handoff links
 * @param {Object} params
 * @param {Object} params.collectionMetadata Collection metadata from CMR
 * @param {Object} params.collectionQuery Collection Search data from Redux
 * @param {Object} params.handoffs Handoffs data from from Redux
 * @param {Object} params.mapProjection Current map projection from Redux
 */
export const generateHandoffs = ({
  collectionMetadata,
  collectionQuery,
  handoffs,
  mapProjection
}) => {
  /*
   * UMM-T Handoffs
   */
  const { tools = {} } = collectionMetadata
  let { items: toolItems } = tools

  if (!toolItems) toolItems = []

  const handoffLinks = []
  let allRequiredItemsPresent = true
  // If Giovanni or Open Altimetry are generated with UMM-T, we will skip the tag based generation
  let giovanniUmmTGenerated = false
  let openAltimetryUmmTGenerated = false

  // Loop through each associated Tool to build a handoff link for each
  toolItems.forEach((tool) => {
    const {
      name,
      longName,
      potentialAction
    } = tool

    // If no potentialAction exists, no link should be generated
    if (!potentialAction) {
      return
    }

    const {
      target,
      queryInput
    } = potentialAction

    const { urlTemplate } = target
    const handoffUrl = template.parse(urlTemplate)
    const urlValues = {}

    // Loop through each input and replace the input value in the urlTemplate to create the URL
    queryInput.forEach((input) => {
      const {
        valueName,
        valueRequired
      } = input

      const value = getHandoffValue({
        collectionMetadata,
        collectionQuery,
        handoffInput: input,
        handoffs
      })

      if (valueRequired && isEmpty(value)) {
        allRequiredItemsPresent = false
      }

      // Add the value to be expanded onto the urlTemplate later
      urlValues[valueName] = value
    })

    // If all the required inputs are present, push the generated link onto handoffLinks to be returned
    if (allRequiredItemsPresent) {
      handoffLinks.push({
        title: longName,
        href: handoffUrl.expand(urlValues)
      })

      // If Giovanni or Open Altimetry were generated with UMM-T, skip the tag based generation
      if (name.toLowerCase() === 'giovanni') {
        giovanniUmmTGenerated = true
      }
      if (name.toLowerCase() === 'open altimetry') {
        openAltimetryUmmTGenerated = true
      }
    }
  })

  /*
   * Tag based Handoffs
   */

  // Giovanni Handoff
  if (!giovanniUmmTGenerated && hasTag(collectionMetadata, 'handoff.giovanni', 'edsc.extra')) {
    handoffLinks.push(
      fetchGiovanniHandoffUrl(collectionMetadata, collectionQuery)
    )
  }

  // Open Altimetry Handoff
  if (!openAltimetryUmmTGenerated && hasTag(collectionMetadata, 'handoff.open_altimetry', 'edsc.extra')) {
    handoffLinks.push(
      fetchOpenAltimetryHandoffUrl(collectionMetadata, collectionQuery, mapProjection)
    )
  }

  return handoffLinks
}

export default generateHandoffs
