import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import getByTextWithMarkup from '../../../../../../vitestConfigs/getByTextWithMarkup'

import * as EventEmitter from '../../../events/events'
import ShapefileUploadModal from '../ShapefileUploadModal'
import { MODAL_NAMES } from '../../../constants/modalNames'

const setup = setupTest({
  Component: ShapefileUploadModal,
  defaultZustandState: {
    ui: {
      modals: {
        openModal: MODAL_NAMES.SHAPEFILE_UPLOAD,
        setOpenModal: vi.fn()
      }
    }
  }
})

describe('ShapefileUploadModal component', () => {
  test('does not render when modal is closed', () => {
    setup({
      overrideZustandState: {
        ui: {
          modals: {
            openModal: null
          }
        }
      }
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('should render a Modal', () => {
    setup()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  test('should render a title', () => {
    setup()

    expect(screen.getByText('Search by Shape File')).toBeInTheDocument()
  })

  test('should render instructions', () => {
    setup()

    const element = getByTextWithMarkup('Drag and drop a shape file onto the screen or click Browse Files below to upload.')
    expect(element).toBeInTheDocument()
  })

  test('should render file type information', () => {
    setup()

    expect(screen.getByText('Valid formats include:')).toBeInTheDocument()
    expect(screen.getByText('Shapefile (.zip including .shp, .dbf, and .shx file)')).toBeInTheDocument()
    expect(screen.getByText('Keyhole Markup Language (.kml or .kmz)')).toBeInTheDocument()
    expect(screen.getByText('GeoJSON (.json or .geojson)')).toBeInTheDocument()
    expect(screen.getByText('GeoRSS (.rss, .georss, or .xml)')).toBeInTheDocument()
  })

  test('should render a hint', () => {
    setup()

    const element = getByTextWithMarkup('Hint:You may also simply drag and drop shape files onto the screen at any time.')
    expect(element).toBeInTheDocument()
  })

  test('should call setOpenModal when the modal is closed', async () => {
    const { user, zustandState } = setup()

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
    expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
  })

  describe('modal actions', () => {
    test('Browse Files button should emit event', async () => {
      const { user } = setup()

      const eventEmitterEmitMock = vi.spyOn(EventEmitter.eventEmitter, 'emit')
      eventEmitterEmitMock.mockImplementation(() => vi.fn())

      const button = screen.getByRole('button', { name: 'Browse Files' })
      await user.click(button)

      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith('shapefile.dropzoneOpen')
    })

    test('Cancel button should trigger setOpenModal', async () => {
      const { user, zustandState } = setup()

      const button = screen.getByRole('button', { name: 'Cancel' })
      await user.click(button)

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(null)
    })
  })
})
