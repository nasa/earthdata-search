import {
  screen,
  act,
  within
} from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import LayerPicker from '../LayerPicker'
import useEdscStore from '../../../zustand/useEdscStore'

describe('LayerPicker', () => {
  const mockCollectionId = 'C123451234-EDSC'

  // Create shared mock functions
  const mockToggleLayerVisibility = jest.fn()
  const mockSetMapLayersOrder = jest.fn()
  const mockUpdateLayerOpacity = jest.fn()

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
    updateLayerOpacity: mockUpdateLayerOpacity,
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
        updateLayerOpacity: mockUpdateLayerOpacity,
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

  describe('Rendering', () => {
    test('renders draggable layer items for each layer in the store', async () => {
      setup()

      await screen.findByText('Precipitation Rate')
      await screen.findByText('Precipitation Rate (30-min)')
    })

    test('shows drag handles when there are multiple layers', async () => {
      setup()

      // Should show drag handles for both layers when there are 2+ layers
      const dragHandles = screen.getAllByRole('button', { name: 'Drag to reorder layer' })
      // There are 2 drag handles and 2 tooltips
      expect(dragHandles).toHaveLength(4)
    })

    test('hides drag handles when there is only one layer', async () => {
      setup({
        overrideZustandState: {
          map: {
            toggleLayerVisibility: jest.fn(),
            setMapLayersOrder: jest.fn(),
            updateLayerOpacity: jest.fn(),
            mapLayers: {
              [mockCollectionId]: [
                {
                  product: 'IMERG_Precipitation_Rate',
                  title: 'Precipitation Rate',
                  isVisible: false,
                  opacity: 1
                }
              ]
            }
          }
        }
      })

      await screen.findByText('Precipitation Rate')

      // Should not show any drag handles when there's only one layer
      const dragHandles = screen.queryAllByRole('button', { name: 'Grab to reorder layer' })
      expect(dragHandles).toHaveLength(0)
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
    test('calls updateLayerOpacity when opacity slider is released', async () => {
      const { user } = setup()
      const settingsButton = screen.getByRole('button', { name: 'Adjust settings for Precipitation Rate' })

      await act(async () => {
        await user.click(settingsButton)
      })

      const opacitySlider = screen.getByRole('slider')
      await user.click(opacitySlider)

      const zustandState = useEdscStore.getState()
      const { map } = zustandState
      const { updateLayerOpacity } = map
      expect(updateLayerOpacity).toHaveBeenCalledWith(mockCollectionId, 'IMERG_Precipitation_Rate', 1)
    })
  })

  // These have to be pointer events: https://github.com/clauderic/dnd-kit/issues/261
  describe('Layer Reordering', () => {
    test('calls setMapLayersOrder when layers are dragged and reordered', async () => {
      const { user } = setup()

      // Get the first layer container by finding the layer with specific text
      const firstLayerText = screen.getByText('Precipitation Rate')
      // eslint-disable-next-line testing-library/no-node-access
      const firstLayerContainer = firstLayerText.closest('[aria-label="Drag to reorder layer"]') as HTMLElement

      const secondLayerText = screen.getByText('Precipitation Rate (30-min)')
      // eslint-disable-next-line testing-library/no-node-access
      const secondLayerContainer = secondLayerText.closest('[aria-label="Drag to reorder layer"]') as HTMLElement

      // Get the drag handles within each container
      const firstDragHandle = within(firstLayerContainer).getByLabelText('Drag to reorder layer')
      const secondDragHandle = within(secondLayerContainer).getByLabelText('Drag to reorder layer')

      // Simulate drag and drop from first layer to second layer
      await act(async () => {
        await user.pointer([
          {
            target: firstDragHandle,
            keys: '[MouseLeft>]'
          },
          {
            target: secondDragHandle,
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
