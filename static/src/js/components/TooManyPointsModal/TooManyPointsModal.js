import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

import Button from '../Button/Button'

import './TooManyPointsModal.scss'

export class TooManyPointsModal extends Component {
  constructor(props) {
    super(props)
    this.onModalClose = this.onModalClose.bind(this)
  }

  onModalClose() {
    const { onToggleTooManyPointsModal } = this.props
    onToggleTooManyPointsModal(false)
  }

  render() {
    const {
      isOpen
    } = this.props

    return (
      <Modal
        dialogClassName="too-many-points-modal"
        show={isOpen}
        onHide={this.onModalClose}
        centered
        size="md"
        aria-labelledby="modal__too-many-points-modal"
      >
        <Modal.Header
          className="too-many-points-modal__header"
          closeButton
        >
          <Modal.Title
            className="too-many-points-modal__title"
          >
            Shape file has too many points
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="too-many-points-modal__body">
          <p>
            To improve search performance, your shapefile has been simplified.
            Your original shapefile will be used for spatial subsetting if you
            choose to enable that setting during download.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="too-many-points-modal__action too-many-points-modal__action--secondary"
            bootstrapVariant="primary"
            label="Close"
            onClick={this.onModalClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

TooManyPointsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleTooManyPointsModal: PropTypes.func.isRequired
}

export default TooManyPointsModal
