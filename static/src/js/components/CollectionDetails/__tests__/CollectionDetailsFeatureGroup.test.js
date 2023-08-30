import '@testing-library/jest-dom'

import { createLayer } from '../CollectionDetailsFeatureGroup'

import { buildLayer } from '../../../util/map/layers'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet/core', () => (
  {
    createLayerComponent: jest.fn().mockImplementation((children) => ({ children }))
  }))

jest.mock('../../../util/map/layers', () => (
  {
    buildLayer: jest.fn().mockImplementation((children) => ({ children }))
  }))

const setup = (overrides) => {
  const {
    overrideMetadata = {},
    overrideProps = {}
  } = overrides || {}

  const props = {
    metadata: {
      hasAllMetadata: true,
      dataCenters: [],
      directDistributionInformation: {},
      scienceKeywords: [],
      nativeDataFormats: [],
      urls: {},
      ...overrideMetadata
    },
    ...overrideProps
  }
  return {
    props

  }
}

describe('CollectionDetailsFeatureGroup component', () => {
  describe('when the feature group is loaded with metadata', () => {
    test('calls leaflet to build the layer component', () => {
      const { props } = setup()
      const context = {}
      createLayer(props, context)
      expect(buildLayer).toHaveBeenCalled()
    })
  })
})
