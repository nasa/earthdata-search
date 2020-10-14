import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'react-bootstrap'
import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'

import { triggerKeyboardShortcut } from '../../util/triggerKeyboardShortcut'

export class KeyboardShortcutsModal extends Component {
  constructor(props) {
    super(props)
    this.keyboardShortcuts = {
      toggleModal: '?',
      escapeModal: 'Escape'
    }
    this.onWindowKeyUp = this.onWindowKeyUp.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onWindowKeyUp)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onWindowKeyUp)
  }

  onWindowKeyUp(e) {
    const { keyboardShortcuts } = this
    const { isOpen, onToggleKeyboardShortcutsModal } = this.props

    const toggleModal = () => onToggleKeyboardShortcutsModal(!isOpen)

    triggerKeyboardShortcut({
      event: e,
      shortcutKey: keyboardShortcuts.toggleModal,
      shortcutCallback: toggleModal
    })
  }

  render() {
    const { isOpen, onToggleKeyboardShortcutsModal } = this.props
    const keyboardShortcutsList = {
      ']': 'Toggle main search result/granules panel',
      g: 'Toggle granule filters panel',
      a: 'Toggle advanced search modal',
      '/': 'Focus on search input field',
      '?': 'Display all keyboard shortcuts',
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
