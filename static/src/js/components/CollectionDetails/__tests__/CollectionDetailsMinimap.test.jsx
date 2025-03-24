import React from 'react'
// Mock Canvas element for jest testing
import 'jest-canvas-mock'

import { render, screen } from '@testing-library/react'

import CollectionDetailsMinimap from '../CollectionDetailsMinimap'

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
  render(<CollectionDetailsMinimap {...props} />)
}

describe('CollectionDetailsBody component', () => {
  describe('when the collection details mini-map is loaded with metadata', () => {
    test('calls leaflet to render the map container', () => {
      setup()
      const canvasElement = screen.getByTestId('collection-details-minimap')
      expect(canvasElement).toBeInTheDocument()
    })
  })
})
