const { dataLayer = [] } = window

type MetricsAddCollectionToProjectParams = {
  /** The concept ID of the collection being added to the project */
  collectionConceptId: string
  /** The view in which the collection was added */
  view: string
  /** The page on which the collection was added */
  page: string
}

/**
* Pushes an add collection to project event on the dataLayer.
* This event is fired when a user adds a collection to their project
*/
export const metricsAddCollectionToProject = ({
  collectionConceptId,
  view,
  page
}: MetricsAddCollectionToProjectParams) => {
  dataLayer.push({
    event: 'addCollectionToProject',
    addProjectCollectionConceptId: collectionConceptId,
    addProjectCollectionResultsView: view,
    addProjectCollectionPage: page
  })
}
