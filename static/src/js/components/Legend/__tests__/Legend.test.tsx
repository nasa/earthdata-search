import React from 'react'

import { screen } from '@testing-library/react'

import Legend from '../Legend'
import setupTest from '../../../../../../jestConfigs/setupTest'
import { ImageryLayers } from '../../../types/sharedTypes'

// Mock the LayerPicker component
jest.mock('../../LayerPicker/LayerPicker', () => jest.fn(() => <div data-testid="layer-picker" />))

const mockCollectionId = 'test-collection'

// Create mock functions
const mockToggleLayerVisibility = jest.fn()
const mockSetMapLayersOrder = jest.fn()
const mockUpdateLayerOpacity = jest.fn()

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
  updateLayerOpacity: mockUpdateLayerOpacity
}

const mockImageryLayersEmpty: ImageryLayers = {
  layerData: [],
  toggleLayerVisibility: mockToggleLayerVisibility,
  setMapLayersOrder: mockSetMapLayersOrder,
  updateLayerOpacity: mockUpdateLayerOpacity
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

    const legend = screen.getByTestId('legend')
    expect(legend).toBeInTheDocument()

    // LayerPicker should be rendered with the layer data
    expect(screen.getByTestId('layer-picker')).toBeInTheDocument()
  })

  test('does not render LayerPicker when imageryLayers has no layers', () => {
    setup()

    const legend = screen.getByTestId('legend')

    expect(legend).toBeInTheDocument()
    expect(legend).toBeEmptyDOMElement()
    expect(screen.queryByTestId('layer-picker')).not.toBeInTheDocument()
  })
})
