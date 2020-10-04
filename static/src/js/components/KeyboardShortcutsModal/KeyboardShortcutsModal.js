import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Modal, Container,
  Row, Col, Button
} from 'react-bootstrap'
import config from './config.json'
import './KeyboardShortcutsModal.scss'

export class KeyboardShortcutsModal extends Component {
  constructor(props) {
    super(props)
    this.keyboardShortcuts = {
      toggleModal: '?',
      escapeModal: 'Escape'
    }

    this.onWindowKeyDown = this.onWindowKeyDown.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onWindowKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onWindowKeyDown)
  }

  onWindowKeyDown(e) {
    const { key } = e
    const { keyboardShortcuts } = this
    const { isOpen, onToggleKeyboardShortcutsModal } = this.props
    // Toggle the modal when question key pressed
    if (key === keyboardShortcuts.toggleModal) {
      onToggleKeyboardShortcutsModal(!isOpen)
      e.preventDefault()
      e.stopPropagation()
    } else if (key === keyboardShortcuts.escapeModal) {
      if (isOpen) onToggleKeyboardShortcutsModal(false)
      e.preventDefault()
      e.stopPropagation()
    }
  }


  render() {
    const { isOpen, onToggleKeyboardShortcutsModal } = this.props
    const keyboardShortcutsList = config
    return (
      <Modal
        show={isOpen}
        size="md"
        aria-labelledby="modal__shapefile-modal"
        centered
        onHide={() => onToggleKeyboardShortcutsModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Keyboard Shortcuts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {Object.entries(keyboardShortcutsList)
              .map(arr => (
                <Row key={arr[0]} className="row">
                  <Col xs={1}><kbd>{arr[0]}</kbd></Col>
              :
                  <Col>{arr[1]}</Col>
                </Row>
              ))}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onToggleKeyboardShortcutsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

KeyboardShortcutsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleKeyboardShortcutsModal: PropTypes.func.isRequired
}

export default KeyboardShortcutsModal
