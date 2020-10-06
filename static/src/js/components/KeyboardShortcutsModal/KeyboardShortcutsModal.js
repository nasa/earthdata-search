import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'react-bootstrap'
import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'

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
    const keyboardShortcutsList = {
      ']': 'Toggle main search result/granules panel',
      g: 'Toggle granule filters panel',
      a: 'Toggle advanced search modal',
      '/': 'Focus on search input field',
      '?': 'Display all keyboard shortcuts',
      t: 'Toggle timeline'
    }
    return (
      <EDSCModalContainer
        isOpen={isOpen}
        size="md"
        id="keyboardShortcut"
        onClose={() => onToggleKeyboardShortcutsModal(false)}
        body={(
          <Container>
            {Object.entries(keyboardShortcutsList)
              .map(arr => (
                <Row key={arr[0]} className="mb-1">
                  <Col xs={1}><kbd>{arr[0]}</kbd></Col>
      :
                  <Col>{arr[1]}</Col>
                </Row>
              ))}
          </Container>
        )}
        title="Keyboard Shortcuts"
      />
    )
  }
}

KeyboardShortcutsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleKeyboardShortcutsModal: PropTypes.func.isRequired
}

export default KeyboardShortcutsModal
