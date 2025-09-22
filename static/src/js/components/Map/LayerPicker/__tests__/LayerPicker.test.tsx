import { screen, act } from '@testing-library/react'

import setupTest from '../../../../../../../jestConfigs/setupTest'
import LayerPicker from '../LayerPicker'
import useEdscStore from '../../../../zustand/useEdscStore'

const mockCollectionId = 'C123451234-EDSC'

// Create shared mock functions
const mockToggleLayerVisibility = jest.fn()
const mockSetMapLayersOrder = jest.fn()
const mocksetLayerOpacity = jest.fn()

const mockImageryLayers = {
  layerData: [
    {
      product: 'IMERG_Precipitation_Rate',
      title: 'Precipitation Rate',
      colormap: {},
      isVisible: false,
      opacity: 1
    },
    {
      product: 'IMERG_Precipitation_Rate_30min',
      title: 'Precipitation Rate (30-min)',
      colormap: {},
      isVisible: true,
      opacity: 0.5
    }
  ],
  toggleLayerVisibility: mockToggleLayerVisibility,
  setLayerOpacity: mocksetLayerOpacity,
  setMapLayersOrder: mockSetMapLayersOrder
}

const setup = setupTest({
  Component: LayerPicker,
  defaultProps: {
    collectionId: mockCollectionId,
    imageryLayers: mockImageryLayers
  },
  defaultZustandState: {
    map: {
      toggleLayerVisibility: mockToggleLayerVisibility,
      setMapLayersOrder: mockSetMapLayersOrder,
      setLayerOpacity: mocksetLayerOpacity,
      mapLayers: {
        [mockCollectionId]: [
          {
            product: 'IMERG_Precipitation_Rate',
            title: 'Precipitation Rate',
            isVisible: false,
            opacity: 1
          },
          {
            product: 'IMERG_Precipitation_Rate_30min',
            title: 'Precipitation Rate (30-min)',
            isVisible: true,
            opacity: 0.5
          }
        ]
      }
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
      const { user } = setup()
      const toggleButton = screen.getByRole('button', { name: 'Show Precipitation Rate' })

      await act(async () => {
        await user.click(toggleButton)
      })

      const zustandState = useEdscStore.getState()
      const { map } = zustandState
      const { toggleLayerVisibility } = map
      expect(toggleLayerVisibility).toHaveBeenCalledWith(mockCollectionId, 'IMERG_Precipitation_Rate')
    })
  })

  describe('Layer Opacity Updates', () => {
    test('calls setLayerOpacity when opacity slider is released', async () => {
      const { user } = setup()
      const settingsButton = screen.getByRole('button', { name: 'Adjust settings for Precipitation Rate' })

      await act(async () => {
        await user.click(settingsButton)
      })

      const opacitySlider = screen.getByRole('slider')
      await user.click(opacitySlider)

      const zustandState = useEdscStore.getState()
      const { map } = zustandState
      const { setLayerOpacity } = map
      expect(setLayerOpacity).toHaveBeenCalledWith(mockCollectionId, 'IMERG_Precipitation_Rate', 1)
    })
  })

  // These have to be pointer events: https://github.com/clauderic/dnd-kit/issues/261
  describe('Layer Reordering', () => {
    test('calls setMapLayersOrder when layers are dragged and reordered', async () => {
      const { user, zustandState } = setup()

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
      expect(mockSetMapLayersOrder).toHaveBeenCalledWith(
        mockCollectionId,
        [{
          colormap: {},
          isVisible: true,
          opacity: 0.5,
          product: 'IMERG_Precipitation_Rate_30min',
          title: 'Precipitation Rate (30-min)'
        }, {
          colormap: {},
          isVisible: false,
          opacity: 1,
          product: 'IMERG_Precipitation_Rate',
          title: 'Precipitation Rate'
        }]
      )
    })
  })
})
