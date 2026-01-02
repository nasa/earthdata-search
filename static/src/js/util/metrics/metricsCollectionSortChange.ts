const { dataLayer = [] } = window

/**
* Pushes a collectionSortChange event on the dataLayer.
*/
export const metricsCollectionSortChange = (value: string) => {
  dataLayer.push({
    event: 'collectionSortChange',
    collectionSortChangeCategory: 'search result sort',
    collectionSortChangeAction: 'change',
    collectionSortChangeLabel: value
  })
}
