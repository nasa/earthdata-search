import { metricsCollectionSortChange } from '../metricsCollectionSortChange'

describe('metricsCollectionSortChange', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsCollectionSortChange('relevance')

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'collectionSortChange',
      collectionSortChangeCategory: 'search result sort',
      collectionSortChangeAction: 'change',
      collectionSortChangeLabel: 'relevance'
    })
  })
})
