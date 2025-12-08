import React from 'react'
import Modal from 'react-bootstrap/Modal'

import { eventEmitter } from '../../events/events'

import Button from '../Button/Button'

import useEdscStore from '../../zustand/useEdscStore'
import { isModalOpen, setOpenModalFunction } from '../../zustand/selectors/ui'

import { MODAL_NAMES } from '../../constants/modalNames'

import './ShapefileUploadModal.scss'

const ShapefileUploadModal = () => {
  const isOpen = useEdscStore((state) => isModalOpen(state, MODAL_NAMES.SHAPEFILE_UPLOAD))
  const setOpenModal = useEdscStore(setOpenModalFunction)

  if (!isOpen) return null

  const onModalClose = () => {
    setOpenModal(null)
  }

  return (
    <Modal
      dialogClassName="shapefile-modal"
      show={isOpen}
      onHide={onModalClose}
      centered
      size="md"
      aria-labelledby="modal__shapefile-modal"
    >
      <Modal.Header
        className="shapefile-modal__header"
        closeButton
      >
        <Modal.Title
          className="shapefile-modal__title"
        >
          Search by Shape File
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="shapefile-modal__body">
        <p>
          Drag and drop a shape file onto the screen or click
          {' '}
          <strong>Browse Files</strong>
          {' '}
          below to upload.
        </p>
        <p>
          Valid formats include:
        </p>
        <ul>
          <li>Shapefile (.zip including .shp, .dbf, and .shx file)</li>
          <li>Keyhole Markup Language (.kml or .kmz)</li>
          <li>GeoJSON (.json or .geojson)</li>
          <li>GeoRSS (.rss, .georss, or .xml)</li>
        </ul>
        <p className="shapefile-modal__hint">
          <span className="shapefile-modal__hint-label">Hint:</span>
          You may also simply drag and drop shape files onto the screen at any time.
        </p>
        <div className="shapefile-modal__actions">
          <Button
            className="shapefile-modal__action shapefile-modal__action--primary"
            bootstrapVariant="primary"
            label="Browse Files"
            onClick={
              () => {
                eventEmitter.emit('shapefile.dropzoneOpen')
              }
            }
          >
            Browse Files
          </Button>
          <Button
            className="shapefile-modal__action shapefile-modal__action--secondary"
            bootstrapVariant="secondary"
            label="Cancel"
            onClick={onModalClose}
          >
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ShapefileUploadModal
