import { metricsAddCollectionToProject } from '../metricsAddCollectionToProject'

describe('metricsAddCollectionToProject', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsAddCollectionToProject({
      collectionConceptId: 'C1234567890-EDSC',
      view: 'list',
      page: 'search'
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'addCollectionToProject',
      addProjectCollectionConceptId: 'C1234567890-EDSC',
      addProjectCollectionResultsView: 'list',
      addProjectCollectionPage: 'search'
    })
  })
})
