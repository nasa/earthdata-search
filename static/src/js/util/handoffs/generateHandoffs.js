import { isEmpty } from 'lodash'
import template from 'url-template'

import { getHandoffValue } from './getHandoffValue'

/**
 * Generate an array of objects that will be used to render smart handoff links
 * @param {Object} params
 * @param {Object} params.collectionMetadata Collection metadata from CMR
 * @param {Object} params.collectionQuery Collection Search data from Redux
 * @param {Object} params.handoffs Handoffs data from from Redux
 * @param {Object} params.map Current map configuration from Redux
 */
export const generateHandoffs = ({
  collectionMetadata,
  collectionQuery,
  handoffs,
  map
}) => {
  const { tools = {} } = collectionMetadata
  let { items: toolItems } = tools

  if (!toolItems) toolItems = []

  const handoffLinks = []

  // Loop through each associated Tool to build a handoff link for each
  toolItems.forEach((tool) => {
    let allRequiredItemsPresent = true

    const {
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
        valueRequired = false
      } = input

      const value = getHandoffValue({
        collectionMetadata,
        collectionQuery,
        handoffInput: input,
        handoffs,
        map
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
    }
  })

  return handoffLinks
}

export default generateHandoffs
