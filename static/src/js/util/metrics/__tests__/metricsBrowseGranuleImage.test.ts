import { metricsBrowseGranuleImage } from '../metricsBrowseGranuleImage'

describe('metricsBrowseGranuleImage', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = vi.spyOn(window.dataLayer, 'push')

    metricsBrowseGranuleImage({
      modalOpen: true,
      granuleId: 'G1234567890-EDSC',
      value: 'Browse Image Clicked'
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'browseGranuleImage',
      browseGranuleImageCategory: 'Browse Granule Image',
      browseGranuleImageModalOpen: true,
      browseGranuleImageGranuleId: 'G1234567890-EDSC',
      browseGranuleImageValue: 'Browse Image Clicked'
    })
  })
})
