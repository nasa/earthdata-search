const { dataLayer = [] } = window

/**
* Pushes a relatedCollection event on the dataLayer.
* @param {Object} action - The action.
*/
export const metricsRelatedCollection = ({
  collectionId = '',
  type = ''
}) => {
  dataLayer.push({
    event: 'relatedCollection',
    relatedCollectionCategory: 'related collection',
    relatedCollectionAction: type,
    relatedCollectionLabel: collectionId
  })
}
