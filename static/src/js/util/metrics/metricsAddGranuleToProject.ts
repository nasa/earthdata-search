const { dataLayer = [] } = window

type MetricsAddGranuleToProjectParams = {
  /** The concept ID of the collection being added to the project */
  collectionConceptId: string
  /** The concept ID of the granule being added to the project */
  granuleConceptId: string
  /** The view in which the collection was added */
  view: string
  /** The page on which the collection was added */
  page: string
}

/**
* Pushes an add granule to project event on the dataLayer.
* This event is fired when a user adds a granule to their project
* @param {Object} action - The action.
*/
export const metricsAddGranuleToProject = ({
  collectionConceptId,
  granuleConceptId,
  view,
  page
}: MetricsAddGranuleToProjectParams) => {
  dataLayer.push({
    event: 'addGranuleToProject',
    addProjectCollectionConceptId: collectionConceptId,
    addProjectGranuleConceptId: granuleConceptId,
    addProjectGranulePage: page,
    addProjectGranuleResultsView: view
  })
}
