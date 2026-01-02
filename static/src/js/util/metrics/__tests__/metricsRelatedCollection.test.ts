import { metricsRelatedCollection } from '../metricsRelatedCollection'

describe('metricsRelatedCollection', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsRelatedCollection({
      collectionId: 'C1234567890-EDSC',
      type: 'view'
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'relatedCollection',
      relatedCollectionCategory: 'related collection',
      relatedCollectionAction: 'view',
      relatedCollectionLabel: 'C1234567890-EDSC'
    })
  })

  test('handles default values', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsRelatedCollection({})

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'relatedCollection',
      relatedCollectionCategory: 'related collection',
      relatedCollectionAction: '',
      relatedCollectionLabel: ''
    })
  })
})
