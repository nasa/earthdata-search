import React from 'react'

import {
  act, render
} from '@testing-library/react'

import {
  MapContainer
} from 'react-leaflet'

import '@testing-library/jest-dom'

import CollectionDetailsMinimap from '../CollectionDetailsMinimap'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => (
  {
    createLayerComponent: jest.fn().mockImplementation(() => {}),
    MapContainer: jest.fn().mockImplementation(() => (<div />)),
    ImageOverlay: jest.fn().mockImplementation(() => (<div />))
  }))

jest.mock('react-leaflet/ImageOverlay')

jest.mock('../CollectionDetailsFeatureGroup', () => jest.fn(() => (
  <mock-MapContainer data-testid="MapContainer" />
)))

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
  act(() => {
    render(<CollectionDetailsMinimap {...props} />)
  })
}

describe('CollectionDetailsBody component', () => {
  describe('when the collection details mini-map is loaded with metadata', () => {
    test('calls leaflet to render the map container', () => {
      setup()
      expect(MapContainer).toHaveBeenCalledTimes(1)
    })
  })
})
