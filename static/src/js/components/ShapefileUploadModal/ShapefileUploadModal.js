import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

import { eventEmitter } from '../../events/events'

import Button from '../Button/Button'

import './ShapefileUploadModal.scss'

export class ShapefileUploadModal extends Component {
  constructor(props) {
    super(props)
    this.onModalClose = this.onModalClose.bind(this)
  }

  onModalClose() {
    const { onToggleShapefileUploadModal } = this.props
    onToggleShapefileUploadModal(false)
  }

  render() {
    const {
      isOpen
    } = this.props

    return (
      <Modal
        dialogClassName="shapefile-modal"
        show={isOpen}
        onHide={this.onModalClose}
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
              label="Cancel"
              onClick={() => {
                eventEmitter.emit('shapefile.dropzoneOpen')
              }}
            >
              Browse Files
            </Button>
            <Button
              className="shapefile-modal__action shapefile-modal__action--secondary"
              bootstrapVariant="secondary"
              label="Cancel"
              onClick={this.onModalClose}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

ShapefileUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleShapefileUploadModal: PropTypes.func.isRequired
}

export default ShapefileUploadModal
