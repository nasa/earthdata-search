import React, { useEffect } from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import { triggerKeyboardShortcut } from '../../util/triggerKeyboardShortcut'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import useEdscStore from '../../zustand/useEdscStore'
import { isModalOpen, setOpenModalFunction } from '../../zustand/selectors/ui'
import { MODAL_NAMES } from '../../constants/modalNames'

export const keyboardShortcutsList = {
  ']': 'Toggle main search result/granules panel',
  g: 'Toggle granule filters panel',
  a: 'Toggle advanced search modal',
  '/': 'Focus on search input field',
  l: 'Toggle layers panel',
  t: 'Toggle timeline',
  '?': 'Display all keyboard shortcuts',
  Alt: 'Hold to rotate the map when in a polar projection'
}

const KeyboardShortcutsModal = () => {
  const keyboardShortcuts = {
    toggleModal: '?',
    escapeModal: 'Escape'
  }

  const isOpen = useEdscStore((state) => isModalOpen(state, MODAL_NAMES.KEYBOARD_SHORTCUTS))
  const setOpenModal = useEdscStore(setOpenModalFunction)

  const onModalClose = () => {
    setOpenModal(null)
  }

  const onWindowKeyUp = (event) => {
    const toggleModal = () => setOpenModal(isOpen ? null : MODAL_NAMES.KEYBOARD_SHORTCUTS)

    triggerKeyboardShortcut({
      event,
      shortcutKey: keyboardShortcuts.toggleModal,
      shortcutCallback: toggleModal
    })
  }

  useEffect(() => {
    window.addEventListener('keyup', onWindowKeyUp)

    return () => {
      window.removeEventListener('keyup', onWindowKeyUp)
    }
  }, [])

  if (!isOpen) return null

  return (
    <EDSCModalContainer
      isOpen={isOpen}
      size="md"
      id="keyboardShortcut"
      onClose={onModalClose}
      body={
        (
          <Container>
            {
              Object.entries(keyboardShortcutsList).map((shortcut) => (
                <Row key={shortcut[0]} className="mb-1">
                  <Col xs="auto">
                    <kbd>{shortcut[0]}</kbd>
                  </Col>
                  :
                  <Col>{shortcut[1]}</Col>
                </Row>
              ))
            }
          </Container>
        )
      }
      title="Keyboard Shortcuts"
    />
  )
}

export default KeyboardShortcutsModal
