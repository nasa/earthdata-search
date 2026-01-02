import { metricsVirtualPageview } from '../metricsVirtualPageview'
import * as helpers from '../helpers'

// Mock the helpers module
jest.mock('../helpers', () => ({
  computeKeyword: jest.fn(() => 'test keyword'),
  computeSpatialType: jest.fn(() => 'test spatial'),
  computeTemporalType: jest.fn(() => 'test temporal'),
  computeCollectionsViewed: jest.fn(() => 'test collections viewed'),
  computeCollectionsAdded: jest.fn(() => 'test collections added'),
  computeFacets: jest.fn(() => 'test facets')
}))

describe('metricsVirtualPageview', () => {
  test('pushes the correct event to the dataLayer on PUSH navigation', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsVirtualPageview('PUSH')

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'virtualPageView',
      dimension11: 'test keyword',
      dimension12: 'test spatial',
      dimension13: 'test temporal',
      dimension14: 'test collections viewed',
      dimension15: 'test collections added',
      dimension16: 'test facets'
    })

    expect(helpers.computeKeyword).toHaveBeenCalledTimes(1)
    expect(helpers.computeKeyword).toHaveBeenCalledWith()

    expect(helpers.computeSpatialType).toHaveBeenCalledTimes(1)
    expect(helpers.computeSpatialType).toHaveBeenCalledWith()

    expect(helpers.computeTemporalType).toHaveBeenCalledTimes(1)
    expect(helpers.computeTemporalType).toHaveBeenCalledWith()

    expect(helpers.computeCollectionsViewed).toHaveBeenCalledTimes(1)
    expect(helpers.computeCollectionsViewed).toHaveBeenCalledWith()

    expect(helpers.computeCollectionsAdded).toHaveBeenCalledTimes(1)
    expect(helpers.computeCollectionsAdded).toHaveBeenCalledWith()

    expect(helpers.computeFacets).toHaveBeenCalledTimes(1)
    expect(helpers.computeFacets).toHaveBeenCalledWith()
  })
})
