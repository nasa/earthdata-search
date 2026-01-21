import React from 'react'

import { screen } from '@testing-library/react'

import Legend from '../Legend'
import LayerPicker from '../../LayerPicker/LayerPicker'

import setupTest from '../../../../../../../vitestConfigs/setupTest'

import { ImageryLayers } from '../../../../types/sharedTypes'

// Mock the LayerPicker component
vi.mock('../../LayerPicker/LayerPicker', () => ({ default: vi.fn(() => <div />) }))

const mockCollectionId = 'test-collection'

// Create mock functions
const mockToggleLayerVisibility = vi.fn()
const mockSetMapLayersOrder = vi.fn()
const mockSetLayerOpacity = vi.fn()

const mockImageryLayersWithLayers: ImageryLayers = {
  layerData: [
    {
      product: 'IMERG_Precipitation_Rate',
      title: 'Precipitation Rate',
      colormap: {
        scale: {
          colors: [],
          labels: []
        }
      },
      isVisible: true,
      opacity: 1
    },
    {
      product: 'IMERG_Precipitation_Rate_30min',
      title: 'Precipitation Rate (30-min)',
      colormap: {
        scale: {
          colors: [],
          labels: []
        }
      },
      isVisible: false,
      opacity: 0.5
    }
  ],
  toggleLayerVisibility: mockToggleLayerVisibility,
  setMapLayersOrder: mockSetMapLayersOrder,
  setLayerOpacity: mockSetLayerOpacity
}

const mockImageryLayersEmpty: ImageryLayers = {
  layerData: [],
  toggleLayerVisibility: mockToggleLayerVisibility,
  setMapLayersOrder: mockSetMapLayersOrder,
  setLayerOpacity: mockSetLayerOpacity
}

const setup = setupTest({
  Component: Legend,
  defaultProps: {
    collectionId: mockCollectionId,
    imageryLayers: mockImageryLayersEmpty
  }
})

describe('Legend', () => {
  test('renders the legend container', () => {
    setup()

    const legend = screen.getByTestId('legend')

    expect(legend).toBeInTheDocument()
    expect(legend).toHaveClass('legend')
  })

  test('renders LayerPicker when imageryLayers has layers', () => {
    setup({
      overrideProps: {
        imageryLayers: mockImageryLayersWithLayers
      }
    })

    // LayerPicker should be rendered with the layer data
    expect(LayerPicker).toHaveBeenCalledWith({
      collectionId: mockCollectionId,
      imageryLayers: mockImageryLayersWithLayers
    }, {})

    expect(LayerPicker).toHaveBeenCalledTimes(1)
  })

  test('does not render LayerPicker when imageryLayers has no layers', () => {
    setup()
    expect(LayerPicker).toHaveBeenCalledTimes(0)
  })
})
