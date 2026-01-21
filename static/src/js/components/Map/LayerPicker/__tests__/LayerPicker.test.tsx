import { screen } from '@testing-library/react'

import setupTest from '../../../../../../../vitestConfigs/setupTest'
import LayerPicker, { type LayerPickerProps } from '../LayerPicker'

import { triggerKeyboardShortcut } from '../../../../util/triggerKeyboardShortcut'
import { metricsLayerPicker } from '../../../../util/metrics/metricsLayerPicker'

jest.mock('../../../../util/triggerKeyboardShortcut', () => ({
  triggerKeyboardShortcut: jest.fn()
}))

jest.mock('../../../../util/metrics/metricsLayerPicker', () => ({
  metricsLayerPicker: jest.fn()
}))

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
      toggleLayerVisibility: vi.fn(),
      setLayerOpacity: vi.fn(),
      setMapLayersOrder: vi.fn()
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

    test('toggles layer picker when icon is clicked', async () => {
      const { user } = setup()
      const hideLayerPickerIcon = screen.getByRole('button', { name: 'Hide layers' })

      expect(screen.getByText('Visualization Layers')).toBeInTheDocument()

      await user.click(hideLayerPickerIcon)

      expect(screen.queryByText('Visualization Layers')).not.toBeInTheDocument()

      const showLayerPickerIcon = screen.getByRole('button', { name: 'Show layers' })

      await user.click(showLayerPickerIcon)

      expect(screen.getByText('Visualization Layers')).toBeInTheDocument()
    })

    test('toggles layer picker with keyboard shortcut', async () => {
      const { user } = setup()

      expect(screen.getByText('Visualization Layers')).toBeInTheDocument()

      await user.keyboard('{l}')

      expect(triggerKeyboardShortcut).toHaveBeenCalledTimes(1)
      expect(triggerKeyboardShortcut).toHaveBeenCalledWith({
        event: expect.any(Object),
        shortcutKey: 'l',
        shortcutCallback: expect.any(Function)
      })

      expect(metricsLayerPicker).toHaveBeenCalledTimes(1)
      expect(metricsLayerPicker).toHaveBeenCalledWith('keyboardInput', 'layerPicker.toggle', { layersHidden: true })
    })
  })

  describe('Draggable Styling', () => {
    test('applies isDraggable class when there are multiple layers', () => {
      setup()

      // The default setup has 2 layers, so isDraggable should be true
      const layerItems = screen.getAllByRole('button', { name: 'Drag to reorder layer' })

      expect(layerItems).toHaveLength(2)
      layerItems.forEach((item) => {
        expect(item).toHaveClass('layer-picker-item--draggable')
      })
    })

    test('does not apply isDraggable class when there is only one layer', () => {
      setup({
        overrideProps: {
          imageryLayers: {
            layerData: [
              {
                product: 'IMERG_Precipitation_Rate',
                title: 'Precipitation Rate',
                colormap: undefined,
                isVisible: false,
                opacity: 1
              }
            ],
            toggleLayerVisibility: vi.fn(),
            setLayerOpacity: vi.fn(),
            setMapLayersOrder: vi.fn()
          }
        }
      })

      // With only 1 layer, isDraggable should be false
      const layerItems = screen.getAllByRole('button', { name: 'Drag to reorder layer' })

      expect(layerItems).toHaveLength(1)
      expect(layerItems[0]).not.toHaveClass('layer-picker-item--draggable')
    })
  })

  describe('Layer Visibility Toggling', () => {
    test('calls toggleLayerVisibility when visibility button is clicked', async () => {
      const { user, props } = setup()
      const toggleButton = screen.getByRole('button', { name: 'Show Precipitation Rate' })

      await user.click(toggleButton)

      const { imageryLayers } = props as unknown as LayerPickerProps
      const { toggleLayerVisibility } = imageryLayers

      expect(toggleLayerVisibility).toHaveBeenCalledTimes(1)
      expect(toggleLayerVisibility).toHaveBeenCalledWith(mockCollectionId, 'IMERG_Precipitation_Rate')
      expect(metricsLayerPicker).toHaveBeenCalledTimes(1)
      expect(metricsLayerPicker).toHaveBeenCalledWith('buttonClick', 'layerPicker.toggleLayer', {
        collectionId: 'C123451234-EDSC',
        productName: 'IMERG_Precipitation_Rate'
      })
    })
  })

  describe('Layer Opacity Updates', () => {
    test('calls setLayerOpacity when opacity slider is released', async () => {
      const { user, props } = setup()
      const settingsButton = screen.getByRole('button', { name: 'Adjust settings for Precipitation Rate' })

      await user.click(settingsButton)

      const opacitySlider = screen.getByRole('slider')
      await user.click(opacitySlider)

      const { imageryLayers } = props as unknown as LayerPickerProps
      const { setLayerOpacity } = imageryLayers

      expect(setLayerOpacity).toHaveBeenCalledWith(mockCollectionId, 'IMERG_Precipitation_Rate', 1)
      expect(setLayerOpacity).toHaveBeenCalledTimes(1)
      expect(metricsLayerPicker).toHaveBeenCalledTimes(1)
      expect(metricsLayerPicker).toHaveBeenCalledWith('drag', 'layerPicker.adjustOpacity', {
        collectionConceptId: 'C123451234-EDSC',
        opacity: 1,
        productName: 'IMERG_Precipitation_Rate'
      })
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
      expect(metricsLayerPicker).toHaveBeenCalledTimes(1)
      expect(metricsLayerPicker).toHaveBeenCalledWith('drag', 'layerPicker.reorderLayer', {
        collectionId: 'C123451234-EDSC',
        layerOrder: ['IMERG_Precipitation_Rate_30min', 'IMERG_Precipitation_Rate'],
        movedProduct: 'IMERG_Precipitation_Rate_30min',
        newIndex: 0,
        oldIndex: 1
      })
    })
  })
})
