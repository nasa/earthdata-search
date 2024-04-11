import generateHandoffs from '@edsc/smart-handoffs'

/**
 * Generate an array of objects that will be used to render smart handoff links
 * @param {Object} params
 * @param {Object} params.collectionMetadata Collection metadata from CMR
 * @param {Object} params.collectionQuery Collection Search data from Redux
 * @param {Object} params.map Current map configuration from Redux
 */
export const getHandoffLinks = ({
  collectionMetadata,
  collectionQuery,
  map
}) => {
  const { tools = {} } = collectionMetadata
  let { items: toolItems } = tools

  if (!toolItems) toolItems = []

  const handoffLinks = []

  // Loop through each associated Tool to build a handoff link for each
  toolItems.forEach((tool) => {
    const handoffUrls = generateHandoffs({
      collectionMetadata,
      searchContext: {
        ...collectionQuery,
        map
      },
      ummT: tool
    })

    handoffLinks.push(...handoffUrls)
  })

  return handoffLinks
}

export default getHandoffLinks
