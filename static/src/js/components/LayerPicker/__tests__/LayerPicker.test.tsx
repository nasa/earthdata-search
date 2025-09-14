import React from 'react'
import { screen, act } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import LayerPicker from '../LayerPicker'
import useEdscStore from '../../../zustand/useEdscStore'

jest.mock('../../../components/Map/Map', () => <div />)
jest.mock('ol/layer/Group')
jest.mock('ol/layer/Tile')

const mockLayer = {
  get: jest.fn((key) => {
    if (key === 'product') return 'IMERG_Precipitation_Rate'

    return undefined
  })
}

const mockLayerGroup = {
  getLayers: jest.fn(() => ({
    getArray: jest.fn(() => [mockLayer]),
    forEach: jest.fn((callback) => {
      [mockLayer].forEach(callback)
    })
  }))
}

describe('LayerPicker', () => {
  const mockCollectionId = 'C123451234-EDSC'

  const mockColorMap = {
    IMERG_Precipitation_Rate: {},
    IMERG_Precipitation_Rate_30min: {}
  }

  const setup = setupTest({
    Component: LayerPicker,
    defaultProps: {
      collectionId: mockCollectionId,
      colorMap: mockColorMap,
      granuleImageryLayerGroup: mockLayerGroup
    },
    defaultZustandState: {
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

    test('handles missing collection in mapLayers gracefully', () => {
      setup({
        overrideProps: {
          collectionId: 'non-existent-collection',
          colorMap: mockColorMap
        },
        overrideZustandState: {
          map: {
            toggleLayerVisibility: jest.fn(),
            setMapLayersOrder: jest.fn(),
            updateLayerOpacity: jest.fn(),
            mapLayers: {}
          }
        }
      })

      expect(screen.queryByText('Precipitation Rate')).not.toBeInTheDocument()
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
      // TODO reallt this should be on in the store and then we can disable
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
})
