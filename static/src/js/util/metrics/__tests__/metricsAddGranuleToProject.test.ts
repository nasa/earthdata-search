import { metricsAddGranuleToProject } from '../metricsAddGranuleToProject'

describe('metricsAddGranuleToProject', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = vi.spyOn(window.dataLayer, 'push')

    metricsAddGranuleToProject({
      collectionConceptId: 'C1234567890-EDSC',
      granuleConceptId: 'G1234567890-EDSC',
      view: 'list',
      page: 'search'
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'addGranuleToProject',
      addProjectCollectionConceptId: 'C1234567890-EDSC',
      addProjectGranuleConceptId: 'G1234567890-EDSC',
      addProjectGranulePage: 'search',
      addProjectGranuleResultsView: 'list'
    })
  })
})
