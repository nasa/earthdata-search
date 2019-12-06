import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import classNames from 'classnames'

import { Button } from '../Button/Button'

import './EDSCModal.scss'

// id should be a string ex 'advanced-search'. This will be used to populate the aria-label and classnames

export class EDSCModal extends Component {
  constructor(props) {
    super(props)
    this.onModalClose = this.onModalClose.bind(this)
  }

  onModalClose() {
    const { onClose } = this.props
    if (onClose) onClose(false)
  }

  render() {
    const {
      body,
      className,
      size,
      footer,
      footerMeta,
      id,
      isOpen,
      title,
      primaryAction,
      secondaryAction,
      onPrimaryAction,
      onSecondaryAction
    } = this.props

    const identifier = `edsc-modal__${id}-modal`

    const modalClassNames = classNames([
      identifier,
      {
        [`${className}`]: className
      }
    ])

    return (
      <Modal
        dialogClassName={modalClassNames}
        show={isOpen}
        onHide={this.onModalClose}
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
          {body}
        </Modal.Body>
        {
          (footer || primaryAction || footerMeta) && (
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
  footer: null,
  footerMeta: null,
  onClose: null,
  title: null,
  size: 'sm',
  primaryAction: null,
  secondaryAction: null,
  onPrimaryAction: null,
  onSecondaryAction: null
}

EDSCModal.propTypes = {
  body: PropTypes.node.isRequired,
  className: PropTypes.string,
  footer: PropTypes.node,
  footerMeta: PropTypes.node,
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
  size: PropTypes.string,
  primaryAction: PropTypes.string,
  secondaryAction: PropTypes.string,
  onPrimaryAction: PropTypes.func,
  onSecondaryAction: PropTypes.func
}

export default EDSCModal
