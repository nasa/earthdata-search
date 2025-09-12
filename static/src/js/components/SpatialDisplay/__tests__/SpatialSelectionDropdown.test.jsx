import { act, screen } from '@testing-library/react'
import { useLocation } from 'react-router-dom'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import SpatialSelectionDropdown from '../SpatialSelectionDropdown'
import * as EventEmitter from '../../../events/events'
import spatialTypes from '../../../constants/spatialTypes'
import { mapEventTypes } from '../../../constants/eventTypes'

// Mock react react-router-dom so that the tests do not think we are on the homepage
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

useLocation.mockReturnValue({
  pathname: '/search',
  search: '',
  hash: '',
  state: null,
  key: 'testKey'
})

const setup = setupTest({
  Component: SpatialSelectionDropdown,
  defaultProps: {
    searchParams: {},
    onChangePath: jest.fn(),
    onChangeUrl: jest.fn(),
    onToggleShapefileUploadModal: jest.fn(),
    onMetricsSpatialSelection: jest.fn(),
    location: '/search'
  }
})

describe('SpatialSelectionDropdown component', () => {
  test('renders dropdown items', async () => {
    const { user } = setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

    await act(async () => {
      await user.click(dropdownSelectionButton)
    })

    expect(screen.getByRole('button', { name: 'Polygon' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Rectangle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Point' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Circle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'File (KML, KMZ, ESRI, …)' })).toBeInTheDocument()
  })

  test('clicking the polygon dropdown emits an event and tracks metric', async () => {
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    const { props, user } = setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

    await act(async () => {
      await user.click(dropdownSelectionButton)
    })

    await user.click(screen.getByRole('button', { name: 'Polygon' }))

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith(mapEventTypes.DRAWSTART, spatialTypes.POLYGON)

    expect(props.onMetricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(props.onMetricsSpatialSelection).toHaveBeenCalledWith({ item: 'polygon' })
  })

  test('clicking the rectangle dropdown emits an event and tracks metric', async () => {
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    const { props, user } = setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

    await act(async () => {
      await user.click(dropdownSelectionButton)
    })

    await user.click(screen.getByRole('button', { name: 'Rectangle' }))

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith(
      mapEventTypes.DRAWSTART,
      spatialTypes.BOUNDING_BOX
    )

    expect(props.onMetricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(props.onMetricsSpatialSelection).toHaveBeenCalledWith({ item: 'rectangle' })
  })

  test('clicking the point dropdown emits an event and tracks metric', async () => {
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    const { props, user } = setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

    await act(async () => {
      await user.click(dropdownSelectionButton)
    })

    await user.click(screen.getByRole('button', { name: 'Point' }))

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith(mapEventTypes.DRAWSTART, spatialTypes.POINT)

    expect(props.onMetricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(props.onMetricsSpatialSelection).toHaveBeenCalledWith({ item: 'point' })
  })

  test('clicking the circle dropdown emits an event and tracks metric', async () => {
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    const { props, user } = setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

    await act(async () => {
      await user.click(dropdownSelectionButton)
    })

    await user.click(screen.getByRole('button', { name: 'Circle' }))

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith(mapEventTypes.DRAWSTART, spatialTypes.CIRCLE)

    expect(props.onMetricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(props.onMetricsSpatialSelection).toHaveBeenCalledWith({ item: 'circle' })
  })

  test('clicking the shapefile dropdown calls onToggleShapefileUploadModal', async () => {
    const { props, user } = setup()
    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

    await act(async () => {
      await user.click(dropdownSelectionButton)
    })

    await user.click(screen.getByRole('button', { name: 'File (KML, KMZ, ESRI, …)' }))

    expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(1)
    expect(props.onToggleShapefileUploadModal).toHaveBeenCalledWith(true)

    expect(props.onMetricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(props.onMetricsSpatialSelection).toHaveBeenCalledWith({ item: 'file' })
  })

  describe('if the database is disabled', () => {
    test('searching with the `shapefileUpload` buttons should also be disabled', async () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      const { props, user } = setup()

      const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })

      await act(async () => {
        await user.click(dropdownSelectionButton)
      })

      const shapeFileSelectionButton = screen.getByRole('button', { name: 'File (KML, KMZ, ESRI, …)' })
      await user.click(shapeFileSelectionButton)

      expect(shapeFileSelectionButton).toHaveClass('disabled')
      expect(props.onToggleShapefileUploadModal).toHaveBeenCalledTimes(0)
      expect(props.onMetricsSpatialSelection).toHaveBeenCalledTimes(0)
    })

    test('hovering over the shapefile reveals tool-tip', async () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      const { user } = setup()

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
