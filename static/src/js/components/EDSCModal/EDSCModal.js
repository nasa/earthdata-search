import React, { Component, cloneElement } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import classNames from 'classnames'

import { Button } from '../Button/Button'
import EDSCModalOverlay from './EDSCModalOverlay'

import './EDSCModal.scss'

// id should be a string ex 'advanced-search'. This will be used to populate the aria-label and classnames

export class EDSCModal extends Component {
  constructor(props) {
    super(props)

    this.onSetOverlayModalContent = this.onSetOverlayModalContent.bind(this)
    this.onModalExit = this.onModalExit.bind(this)
    this.onModalHide = this.onModalHide.bind(this)
    this.state = {
      modalOverlayContent: null
    }
  }

  onSetOverlayModalContent(content) {
    this.setState({
      modalOverlayContent: content || null
    })
  }

  onModalHide() {
    const { onClose } = this.props
    if (onClose) onClose(false)
  }

  onModalExit() {
    this.setState({
      modalOverlayContent: null
    })
  }

  render() {
    const {
      body,
      className,
      size,
      fixedHeight,
      footer,
      footerMeta,
      id,
      isOpen,
      title,
      primaryAction,
      primaryActionDisabled,
      secondaryAction,
      onPrimaryAction,
      onSecondaryAction
    } = this.props

    const bodyEl = cloneElement(body, {
      setModalOverlay: (overlay) => {
        this.onSetOverlayModalContent(overlay)
      }
    })

    const {
      modalOverlayContent
    } = this.state

    const identifier = `edsc-modal__${id}-modal`

    const modalClassNames = classNames([
      identifier,
      {
        [`${className}`]: className,
        'edsc-modal--fixed-height': fixedHeight
      }
    ])

    return (
      <Modal
        dialogClassName={modalClassNames}
        show={isOpen}
        onHide={this.onModalHide}
        onExit={this.onModalExit}
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
          {bodyEl}
          {
            modalOverlayContent && (
              <EDSCModalOverlay>
                {modalOverlayContent}
              </EDSCModalOverlay>
            )
          }
        </Modal.Body>
        {
          ((footer || primaryAction || footerMeta) && !modalOverlayContent) && (
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
  }
}

EDSCModal.defaultProps = {
  className: '',
  fixedHeight: false,
  footer: null,
  footerMeta: null,
  onClose: null,
  title: null,
  size: 'sm',
  primaryAction: null,
  primaryActionDisabled: false,
  secondaryAction: null,
  onPrimaryAction: null,
  onSecondaryAction: null
}

EDSCModal.propTypes = {
  body: PropTypes.node.isRequired,
  className: PropTypes.string,
  fixedHeight: PropTypes.bool,
  footer: PropTypes.node,
  footerMeta: PropTypes.node,
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
  size: PropTypes.string,
  primaryAction: PropTypes.string,
  primaryActionDisabled: PropTypes.bool,
  secondaryAction: PropTypes.string,
  onPrimaryAction: PropTypes.func,
  onSecondaryAction: PropTypes.func
}

export default EDSCModal
