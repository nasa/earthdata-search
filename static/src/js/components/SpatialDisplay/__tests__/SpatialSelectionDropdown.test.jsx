import { screen } from '@testing-library/react'
import { useLocation } from 'react-router-dom'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import SpatialSelectionDropdown from '../SpatialSelectionDropdown'
import * as EventEmitter from '../../../events/events'
import spatialTypes from '../../../constants/spatialTypes'
import { mapEventTypes } from '../../../constants/eventTypes'
import { MODAL_NAMES } from '../../../constants/modalNames'
import { metricsSpatialSelection } from '../../../util/metrics/metricsSpatialSelection'
import { routes } from '../../../constants/routes'

import useEdscStore from '../../../zustand/useEdscStore'

const mockUseNavigate = vi.fn()

vi.mock('../../../util/metrics/metricsSpatialSelection', () => ({
  metricsSpatialSelection: vi.fn()
}))

// Mock react react-router-dom so that the tests do not think we are on the homepage
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')), // Preserve other exports
  useLocation: vi.fn().mockReturnValue({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  }),
  useNavigate: () => mockUseNavigate
}))

useLocation.mockReturnValue({
  pathname: `${routes.SEARCH}`,
  search: '',
  hash: '',
  state: null,
  key: 'testKey'
})

const setup = setupTest({
  Component: SpatialSelectionDropdown,
  defaultZustandState: {
    ui: {
      modals: {
        setOpenModal: vi.fn()
      }
    },
    query: {
      changeQuery: vi.fn()
    }
  },
  withRouter: true
})

describe('SpatialSelectionDropdown component', () => {
  test('renders dropdown items', async () => {
    const { user } = setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })
    await user.click(dropdownSelectionButton)

    expect(screen.getByRole('button', { name: 'Polygon' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Rectangle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Point' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Circle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'File (KML, KMZ, ESRI, …)' })).toBeInTheDocument()
  })

  test('clicking the polygon dropdown emits an event and tracks metric', async () => {
    const eventEmitterEmitMock = vi.spyOn(EventEmitter.eventEmitter, 'emit')

    const { user } = setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })
    await user.click(dropdownSelectionButton)

    await user.click(screen.getByRole('button', { name: 'Polygon' }))

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith(mapEventTypes.DRAWSTART, spatialTypes.POLYGON)

    expect(metricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(metricsSpatialSelection).toHaveBeenCalledWith('polygon')
  })

  test('clicking the rectangle dropdown emits an event and tracks metric', async () => {
    const eventEmitterEmitMock = vi.spyOn(EventEmitter.eventEmitter, 'emit')

    const { user } = setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })
    await user.click(dropdownSelectionButton)

    await user.click(screen.getByRole('button', { name: 'Rectangle' }))

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith(
      mapEventTypes.DRAWSTART,
      spatialTypes.BOUNDING_BOX
    )

    expect(metricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(metricsSpatialSelection).toHaveBeenCalledWith('rectangle')
  })

  test('clicking the point dropdown emits an event and tracks metric', async () => {
    const eventEmitterEmitMock = vi.spyOn(EventEmitter.eventEmitter, 'emit')

    const { user } = setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })
    await user.click(dropdownSelectionButton)

    await user.click(screen.getByRole('button', { name: 'Point' }))

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith(mapEventTypes.DRAWSTART, spatialTypes.POINT)

    expect(metricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(metricsSpatialSelection).toHaveBeenCalledWith('point')
  })

  test('clicking the circle dropdown emits an event and tracks metric', async () => {
    const eventEmitterEmitMock = vi.spyOn(EventEmitter.eventEmitter, 'emit')

    const { user } = setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })
    await user.click(dropdownSelectionButton)

    await user.click(screen.getByRole('button', { name: 'Circle' }))

    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledWith(mapEventTypes.DRAWSTART, spatialTypes.CIRCLE)

    expect(metricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(metricsSpatialSelection).toHaveBeenCalledWith('circle')
  })

  test('clicking the shapefile dropdown calls setOpenModal', async () => {
    const { user, zustandState } = setup()

    const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })
    await user.click(dropdownSelectionButton)

    await user.click(screen.getByRole('button', { name: 'File (KML, KMZ, ESRI, …)' }))

    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(MODAL_NAMES.SHAPEFILE_UPLOAD)

    expect(metricsSpatialSelection).toHaveBeenCalledTimes(1)
    expect(metricsSpatialSelection).toHaveBeenCalledWith('file')
  })

  describe('if the database is disabled', () => {
    test('searching with the `shapefileUpload` buttons should also be disabled', async () => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      const { user, zustandState } = setup()

      const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })
      await user.click(dropdownSelectionButton)

      const shapeFileSelectionButton = screen.getByRole('button', { name: 'File (KML, KMZ, ESRI, …)' })
      await user.click(shapeFileSelectionButton)

      expect(shapeFileSelectionButton).toHaveClass('disabled')
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(0)
      expect(metricsSpatialSelection).toHaveBeenCalledTimes(0)
    })

    test('hovering over the shapefile reveals tool-tip', async () => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      const { user } = setup()

      const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })
      await user.click(dropdownSelectionButton)

      // Note that the overlay trigger is not on the actual button but, on the span inside the button
      const shapeFileExtensions = screen.getByText('(KML, KMZ, ESRI, …)')
      await user.hover(shapeFileExtensions)

      expect(screen.getByText('Shapefile subsetting is currently disabled')).toBeInTheDocument()
    })
  })

  describe('if dropdown is located on the homepage', () => {
    beforeEach(() => {
      useLocation.mockReturnValue({
        pathname: '/',
        search: '',
        hash: '',
        state: null,
        key: 'testKey'
      })
    })

    test('updates query, navigates, and sets start drawing when an item is clicked', async () => {
      const { user } = setup()

      const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })
      await user.click(dropdownSelectionButton)

      await user.click(screen.getByRole('button', { name: 'Polygon' }))

      expect(mockUseNavigate).toHaveBeenCalledTimes(1)
      expect(mockUseNavigate).toHaveBeenCalledWith(`${routes.SEARCH}`)

      const updatedState = useEdscStore.getState()
      const { home: updatedHome } = updatedState
      expect(updatedHome.startDrawing).toBe('Polygon')
    })

    test('updates query with keyword if provided in searchParams', async () => {
      const { user, zustandState } = setup({
        overrideProps: {
          searchParams: {
            q: 'test keyword'
          }
        }
      })

      const dropdownSelectionButton = screen.getByRole('button', { name: 'spatial-selection-dropdown' })
      await user.click(dropdownSelectionButton)

      await user.click(screen.getByRole('button', { name: 'Polygon' }))

      expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
      expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
        collection: {
          keyword: 'test keyword'
        }
      })
    })
  })
})
