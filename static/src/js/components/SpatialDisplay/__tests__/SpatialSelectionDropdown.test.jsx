import React from 'react'

import {
  act,
  render,
  screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import SpatialSelectionDropdown from '../SpatialSelectionDropdown'
import * as EventEmitter from '../../../events/events'

const onMetricsSpatialSelection = jest.fn()
const onToggleShapefileUploadModal = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

const setup = () => {
  const props = {
    onToggleShapefileUploadModal,
    onMetricsSpatialSelection
  }

  render(<SpatialSelectionDropdown {...props} />)
}

describe('SpatialSelectionDropdown component', () => {
  test('renders dropdown items', async () => {
    const user = userEvent.setup()

    setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

    await act(async () => {
      await user.click(dropdownSelectionButton)
    })

    expect(screen.getByRole('button', { name: 'Select Polygon' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select Rectangle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select Point' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select Circle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select Shapefile' })).toBeInTheDocument()
  })

  test('clicking the polygon dropdown emits an event and tracks metric', async () => {
    const user = userEvent.setup()
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

    await act(async () => {
      await user.click(dropdownSelectionButton)
    })

    await user.click(screen.getByRole('button', { name: 'Select Polygon' }))

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith('map.drawStart', { type: 'polygon' })

    expect(onMetricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(onMetricsSpatialSelection).toHaveBeenCalledWith({ item: 'polygon' })
  })

  test('clicking the rectangle dropdown emits an event and tracks metric', async () => {
    const user = userEvent.setup()
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

    await act(async () => {
      await user.click(dropdownSelectionButton)
    })

    await user.click(screen.getByRole('button', { name: 'Select Rectangle' }))

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith('map.drawStart', { type: 'rectangle' })

    expect(onMetricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(onMetricsSpatialSelection).toHaveBeenCalledWith({ item: 'rectangle' })
  })

  test('clicking the point dropdown emits an event and tracks metric', async () => {
    const user = userEvent.setup()
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

    await act(async () => {
      await user.click(dropdownSelectionButton)
    })

    await user.click(screen.getByRole('button', { name: 'Select Point' }))

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith('map.drawStart', { type: 'marker' })

    expect(onMetricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(onMetricsSpatialSelection).toHaveBeenCalledWith({ item: 'point' })
  })

  test('clicking the circle dropdown emits an event and tracks metric', async () => {
    const user = userEvent.setup()
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

    await act(async () => {
      await user.click(dropdownSelectionButton)
    })

    await user.click(screen.getByRole('button', { name: 'Select Circle' }))

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith('map.drawStart', { type: 'circle' })

    expect(onMetricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(onMetricsSpatialSelection).toHaveBeenCalledWith({ item: 'circle' })
  })

  test('clicking the shapefile dropdown calls onToggleShapefileUploadModal', async () => {
    const user = userEvent.setup()

    setup()
    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

    await act(async () => {
      await user.click(dropdownSelectionButton)
    })

    await user.click(screen.getByRole('button', { name: 'Select Shapefile' }))

    expect(onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
    expect(onToggleShapefileUploadModal).toHaveBeenCalledWith(true)

    expect(onMetricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(onMetricsSpatialSelection).toHaveBeenCalledWith({ item: 'file' })
  })

  describe('if the database is disabled', () => {
    test('searching with the `shapefileUpload` buttons should also be disabled', async () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      const user = userEvent.setup()

      setup()

      const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

      await act(async () => {
        await user.click(dropdownSelectionButton)
      })

      const shapeFileSelectionButton = screen.getByRole('button', { name: 'Select Shapefile' })
      await user.click(shapeFileSelectionButton)

      expect(shapeFileSelectionButton).toBeDisabled()
      expect(onToggleShapefileUploadModal).toHaveBeenCalledTimes(0)
      expect(onMetricsSpatialSelection).toHaveBeenCalledTimes(0)
    })

    test('hovering over the shapefile reveals tool-tip', async () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      const user = userEvent.setup()
      setup()

      const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

      await act(async () => {
        await user.click(dropdownSelectionButton)
      })

      // Note that the overlay trigger is not on the actual button but, on the span inside the button
      const shapeFileExtensions = screen.getByText('(KML, KMZ, ESRI, …)')

      await act(async () => {
        await user.hover(shapeFileExtensions)
      })

      expect(screen.getByText('Shapefile subsetting is currently disabled')).toBeInTheDocument()
    })
  })
})
