import { screen, act } from '@testing-library/react'

import setupTest from '../../../../../../../jestConfigs/setupTest'
import LayerPicker, { LayerPickerProps } from '../LayerPicker'

const mockCollectionId = 'C123451234-EDSC'

const setup = setupTest({
  Component: LayerPicker,
  defaultProps: {
    collectionId: 'C123451234-EDSC',
    imageryLayers: {
      layerData: [
        {
          product: 'IMERG_Precipitation_Rate',
          title: 'Precipitation Rate',
          colormap: undefined,
          isVisible: false,
          opacity: 1
        },
        {
          product: 'IMERG_Precipitation_Rate_30min',
          title: 'Precipitation Rate (30-min)',
          colormap: undefined,
          isVisible: true,
          opacity: 0.5
        }
      ],
      toggleLayerVisibility: jest.fn(),
      setLayerOpacity: jest.fn(),
      setMapLayersOrder: jest.fn()
    }
  }
})

describe('LayerPicker', () => {
  describe('Rendering', () => {
    test('renders draggable layer items for each layer in the store', async () => {
      setup()

      await screen.findByText('Precipitation Rate')
      await screen.findByText('Precipitation Rate (30-min)')
    })
  })

  describe('Layer Visibility Toggling', () => {
    test('calls toggleLayerVisibility when visibility button is clicked', async () => {
      const { user, props } = setup()
      const toggleButton = screen.getByRole('button', { name: 'Show Precipitation Rate' })

      await act(async () => {
        await user.click(toggleButton)
      })

      const { imageryLayers } = props as unknown as LayerPickerProps
      const { toggleLayerVisibility } = imageryLayers

      expect(toggleLayerVisibility).toHaveBeenCalledWith(mockCollectionId, 'IMERG_Precipitation_Rate')
      expect(toggleLayerVisibility).toHaveBeenCalledTimes(1)
    })
  })

  describe('Layer Opacity Updates', () => {
    test('calls setLayerOpacity when opacity slider is released', async () => {
      const { user, props } = setup()
      const settingsButton = screen.getByRole('button', { name: 'Adjust settings for Precipitation Rate' })

      await act(async () => {
        await user.click(settingsButton)
      })

      const opacitySlider = screen.getByRole('slider')
      await user.click(opacitySlider)

      const { imageryLayers } = props as unknown as LayerPickerProps
      const { setLayerOpacity } = imageryLayers

      expect(setLayerOpacity).toHaveBeenCalledWith(mockCollectionId, 'IMERG_Precipitation_Rate', 1)
      expect(setLayerOpacity).toHaveBeenCalledTimes(1)
    })
  })

  // These have to be pointer events: https://github.com/clauderic/dnd-kit/issues/261
  describe('Layer Reordering', () => {
    test('calls setMapLayersOrder when layers are dragged and reordered', async () => {
      const { user, props } = setup()

      // Most parts of the layer picker items can be dragged
      const firstLayerText = screen.getByText('Precipitation Rate')
      const secondLayerText = screen.getByText('Precipitation Rate (30-min)')

      // Simulate drag and drop from first layer to second layer
      await act(async () => {
        await user.pointer([
          {
            target: firstLayerText,
            keys: '[MouseLeft>]'
          },
          {
            target: secondLayerText,
            keys: '[MouseLeft]'
          }
        ])
      })

      // Verify setMapLayersOrder was called with the reordered layers
      // After dragging first layer to second position send request with updated order
      const { imageryLayers } = props as unknown as LayerPickerProps
      const { setMapLayersOrder } = imageryLayers

      expect(setMapLayersOrder).toHaveBeenCalledWith(
        mockCollectionId,
        [{
          colormap: undefined,
          isVisible: true,
          opacity: 0.5,
          product: 'IMERG_Precipitation_Rate_30min',
          title: 'Precipitation Rate (30-min)'
        }, {
          colormap: undefined,
          isVisible: false,
          opacity: 1,
          product: 'IMERG_Precipitation_Rate',
          title: 'Precipitation Rate'
        }]
      )

      expect(setMapLayersOrder).toHaveBeenCalledTimes(1)
    })
  })
})
