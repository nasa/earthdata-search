import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

import Button from '../Button/Button'

import './OverrideTemporalModal.scss'

import focusedImage from '../../../assets/images/blue-bars-circle.png'
import temporalImage from '../../../assets/images/orange-bars-circle.png'

class OverrideTemporalModal extends Component {
  constructor(props) {
    super(props)

    this.onModalClose = this.onModalClose.bind(this)
    this.onFocusedClick = this.onFocusedClick.bind(this)
    this.onTemporalClick = this.onTemporalClick.bind(this)
  }

  /**
   * Called when the modal closes, sets the modal as closed in the store
   */
  onModalClose() {
    const { onToggleOverrideTemporalModal } = this.props
    onToggleOverrideTemporalModal(false)
  }

  /**
   * Called when the user selects the focused date
   */
  onFocusedClick() {
    const { timeline, onChangeQuery } = this.props
    const { query } = timeline
    const { end, start } = query

    onChangeQuery({
      collection: {
        overrideTemporal: {
          endDate: !end ? undefined : new Date(end).toISOString(),
          startDate: !start ? undefined : new Date(start).toISOString()
        }
      }
    })

    this.onModalClose()
  }

  /**
   * Called when the user selects the temporal search
   */
  onTemporalClick() {
    const { temporalSearch, onChangeQuery } = this.props
    const { endDate, startDate } = temporalSearch

    onChangeQuery({
      collection: {
        overrideTemporal: {
          endDate,
          startDate
        }
      }
    })

    this.onModalClose()
  }

  render() {
    const {
      isOpen
    } = this.props

    return (
      <Modal
        dialogClassName="override-temporal-modal modal--has-inner-header"
        show={isOpen}
        onHide={this.onModalClose}
        centered
        size="lg"
        aria-labelledby="modal__override-temporal-modal"
      >
        <Modal.Header
          className="override-temporal-modal__header"
          closeButton
        >
          <Modal.Title
            id="modal__override-temporal-modal"
            className="override-temporal-modal__title"
          >
            What temporal selection would you like to use?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="override-temporal-modal__body">
          <p>
            Would you like to filter your download by the focused time span (blue lines)
            or your selected temporal constraint (orange lines)?
          </p>
          <div>
            <div className="choice choice-1">
              <img src={focusedImage} alt="Focused Time Span" />
            </div>
            <div className="choice choice-2">
              <img src={temporalImage} alt="Temporal Constraint" />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="override-temporal-modal__footer">
          <div className="override-temporal-modal__footer-actions">
            <div className="choice choice-1">
              <Button
                className="override-temporal-modal__action override-temporal-modal__action--focused"
                bootstrapVariant="primary"
                label="Use Focused Time Span"
                onClick={this.onFocusedClick}
              >
                Use Focused Time Span
              </Button>
            </div>
            <div className="choice choice-2">
              <Button
                className="override-temporal-modal__action override-temporal-modal__action--temporal"
                bootstrapVariant="primary"
                label="Use Temporal Constraint"
                onClick={this.onTemporalClick}
              >
                Use Temporal Constraint
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}

OverrideTemporalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onToggleOverrideTemporalModal: PropTypes.func.isRequired,
  temporalSearch: PropTypes.shape({
    endDate: PropTypes.string,
    startDate: PropTypes.string
  }).isRequired,
  timeline: PropTypes.shape({
    endDate: PropTypes.string,
    query: PropTypes.string,
    startDate: PropTypes.string
  }).isRequired
}

export default OverrideTemporalModal
