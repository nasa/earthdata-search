import { hasTag } from '../../../../../sharedUtils/tags'
import { getHandoffValue } from './getHandoffValue'
import { fetchGiovanniHandoffUrl } from './giovanni'
import { fetchOpenAltimetryHandoffUrl } from './openAltimetry'

/**
 * Generate an array of objects that will be used to render smart handoff links
 * @param {Object} collectionMetadata Collection metadata from CMR
 * @param {Object} collectionQuery Collection Search data from Redux
 */
export const generateHandoffs = (collectionMetadata, collectionQuery, mapProjection) => {
  /*
   * UMM-T Handoffs
   */
  const { tools = {} } = collectionMetadata
  let { items: toolItems = [] } = tools

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
    let handoffUrl = urlTemplate

    // Loop through each input and replace the input value in the urlTemplate to create the URL
    queryInput.forEach((input) => {
      const {
        valueName,
        valueRequired
      } = input

      const value = getHandoffValue({
        collectionMetadata,
        collectionQuery,
        handoffInput: input
      })

      if (valueRequired && !value) {
        allRequiredItemsPresent = false
      }

      // Insert value into handoffUrl
      const replaceRegex = `{${valueName}}`
      const regex = new RegExp(replaceRegex, 'g')
      handoffUrl = handoffUrl.replace(regex, value)
    })

    // If all the required inputs are present, push the generated link onto handoffLinks to be returned
    if (allRequiredItemsPresent) {
      handoffLinks.push({
        title: name,
        href: handoffUrl
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
