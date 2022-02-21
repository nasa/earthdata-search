import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'

import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'
import EDSCModalOverlay from './EDSCModalOverlay'

import './EDSCModal.scss'

/**
 * Renders EDSCModal
 * @param {Element} activeModalOverlay
 * @param {Element} bodyEl Body element
 * @param {Element} footer The footer content.
 * @param {Element} footerMeta The footer meta content.
 * @param {String} identifier A unique id for the modal.
 * @param {Element} innerHeaderEl Inner header element
 * @param {Boolean} isOpen A flag that designates the modal open or closed.
 * @param {String} modalClassNames Class names applied to modal
 * @param {Element} modalInner modal inner reference
 * @param {Element} modalOverlayEl Modal overlay element
 * @param {Function} onModalExit A callback function for exiting the modal
 * @param {Function} onModalHide A callback function for hiding the modal
 * @param {Function} onPrimaryAction A callback function for the primary action.
 * @param {Function} onSecondaryAction A callback function for the secondary action.
 * @param {String} primaryAction The text content for the primary action.
 * @param {Boolean} primaryActionDisabled Disables the primary action.
 * @param {String} secondaryAction The text content for the secondary action.
 * @param {String} size The size to be passed to the Bootstrap modal.
 * @param {Boolean} spinner Shows a loading spinner.
 * @param {String} title The modal title.
 */
export const EDSCModal = ({
  activeModalOverlay,
  bodyEl,
  footer,
  footerMeta,
  identifier,
  innerHeaderEl,
  isOpen,
  modalClassNames,
  modalInner,
  modalOverlayEl,
  onModalExit,
  onModalHide,
  onPrimaryAction,
  onSecondaryAction,
  primaryAction,
  primaryActionDisabled,
  secondaryAction,
  size,
  spinner,
  title
}) => (
  <Modal
    dialogClassName={modalClassNames}
    show={isOpen}
    animation={false}
    onHide={onModalHide}
    onExit={onModalExit}
    centered
    size={size}
    aria-labelledby={identifier}
  >
    <Modal.Header
      className="edsc-modal__header"
      closeButton
    >
      <Modal.Title
        className="edsc-modal__title"
      >
        {title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="edsc-modal__body">
      {
        spinner && (
          <div className="edsc-modal__inner-loading">
            <Spinner type="dots" />
          </div>
        )
      }
      {
        innerHeaderEl && (
          <div className="edsc-modal__inner-header">
            {innerHeaderEl}
          </div>
        )
      }
      <div className="edsc-modal__inner-body" ref={modalInner}>
        {bodyEl}
      </div>
      {
        modalOverlayEl && (
          <EDSCModalOverlay>
            {modalOverlayEl}
          </EDSCModalOverlay>
        )
      }
    </Modal.Body>
    {
      ((footer || primaryAction || footerMeta) && !activeModalOverlay) && (
        <Modal.Footer className="edsc-modal__footer">
          {
            footer
              ? { footer }
              : (
                <>
                  {
                    footerMeta && (
                      <div className="edsc-modal__footer-meta">
                        {footerMeta}
                      </div>
                    )
                  }
                  <div className="edsc-modal__footer-actions">
                    {
                      (secondaryAction && onSecondaryAction) && (
                        <Button
                          className="edsc-modal__action edsc-modal__action--secondary"
                          bootstrapVariant="light"
                          onClick={onSecondaryAction}
                          label={secondaryAction}
                        >
                          {secondaryAction}
                        </Button>
                      )
                    }
                    {
                      (primaryAction && onPrimaryAction) && (
                        <Button
                          className="edsc-modal__action edsc-modal__action--primary"
                          bootstrapVariant="primary"
                          onClick={onPrimaryAction}
                          label={primaryAction}
                          disabled={primaryActionDisabled}
                        >
                          {primaryAction}
                        </Button>
                      )
                    }
                  </div>
                </>
              )
          }
        </Modal.Footer>
      )
    }
  </Modal>
)

EDSCModal.defaultProps = {
  activeModalOverlay: null,
  footer: null,
  footerMeta: null,
  innerHeaderEl: null,
  modalOverlayEl: null,
  modalOverlays: {},
  onModalExit: null,
  onModalHide: null,
  onPrimaryAction: null,
  onSecondaryAction: null,
  primaryAction: null,
  primaryActionDisabled: false,
  secondaryAction: null,
  size: 'sm',
  spinner: false,
  title: null
}

EDSCModal.propTypes = {
  activeModalOverlay: PropTypes.node,
  bodyEl: PropTypes.node.isRequired,
  footer: PropTypes.node,
  footerMeta: PropTypes.node,
  identifier: PropTypes.string.isRequired,
  innerHeaderEl: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  modalClassNames: PropTypes.string.isRequired,
  modalInner: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]).isRequired,
  modalOverlayEl: PropTypes.node,
  modalOverlays: PropTypes.shape({}),
  onModalExit: PropTypes.func,
  onModalHide: PropTypes.func,
  onPrimaryAction: PropTypes.func,
  onSecondaryAction: PropTypes.func,
  primaryAction: PropTypes.string,
  primaryActionDisabled: PropTypes.bool,
  secondaryAction: PropTypes.string,
  size: PropTypes.string,
  spinner: PropTypes.bool,
  title: PropTypes.string
}

export default EDSCModal
