import React from 'react'
import Enzyme, { shallow,mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import KeyboardShortcutsModal from '../KeyboardShortcutsModal'
import { Modal, Button } from 'react-bootstrap'

Enzyme.configure({ adapter: new Adapter() })

const windowEventMap = {}
const documentEventMap = {}

beforeEach(() => {
  jest.clearAllTimers()
  jest.clearAllMocks()

  window.addEventListener = jest.fn((event, cb) => {
    windowEventMap[event] = cb
  })
  window.removeEventListener = jest.fn()
  document.addEventListener = jest.fn((event, cb) => {
    documentEventMap[event] = cb
  })
  document.removeEventListener = jest.fn()
})

const setupForModal = (visibility) => {
  const props = {
    isOpen: visibility,
    onToggleKeyboardShortcutsModal: jest.fn()
  }

  const enzymeWrapper = mount(<KeyboardShortcutsModal {...props} />)

  return {
    enzymeWrapper,
    props
  }
}


describe('KeyboardShortcutsModal component', () => {
    test('initial state of modal', () => {
      const { enzymeWrapper } = setupForModal(false)
      expect(enzymeWrapper.find(Modal).props().show).toEqual(false)
    })
    test('when modal is visible', () => {
      const { enzymeWrapper } = setupForModal(true)
      expect(enzymeWrapper.find(Modal).props().show).toEqual(true)
    })
    test('modal should be centered', () => {
      const { enzymeWrapper } = setupForModal(true)
      expect(enzymeWrapper.find(Modal).props().centered).toEqual(true)
    })
    test('modal shouldn\'t be empty',() => {
      const { enzymeWrapper } = setupForModal(true)
      expect(enzymeWrapper.find('kbd').length).not.toEqual(0)
    })
    test('modal should have a close button',() => {
      const { enzymeWrapper } = setupForModal(true)
      expect(enzymeWrapper.find('button').length).not.toEqual(0)
      expect(enzymeWrapper.find('button').props().children).toMatch(/Close/i)
    })
})

describe('KeyboardShortcutsModal actions', () => {
  test('keyboard action for displaying the modal', () => {
    const { props } = setupForModal(false)
    const preventDefaultMock = jest.fn()
    const stopPropagationMock = jest.fn()
    windowEventMap.keydown({
        key: '?',
        preventDefault: preventDefaultMock,
        stopPropagation: stopPropagationMock
      })
    expect(props.onToggleKeyboardShortcutsModal).toHaveBeenCalledTimes(1)
    expect(props.onToggleKeyboardShortcutsModal).toHaveBeenCalledWith(true)
  })
  test('keyboard action for closing the modal by pressing ?', () => {
    const { props } = setupForModal(true)
    const preventDefaultMock = jest.fn()
    const stopPropagationMock = jest.fn()
    windowEventMap.keydown({
        key: '?',
        preventDefault: preventDefaultMock,
        stopPropagation: stopPropagationMock
      })
    expect(props.onToggleKeyboardShortcutsModal).toHaveBeenCalledTimes(1)
    expect(props.onToggleKeyboardShortcutsModal).toHaveBeenCalledWith(false)
  })
  test('modal shouldn\'t pop up by pressing Escape', () => {
    const { props } = setupForModal(false)
    const preventDefaultMock = jest.fn()
    const stopPropagationMock = jest.fn()
    windowEventMap.keydown({
        key: 'Escape',
        preventDefault: preventDefaultMock,
        stopPropagation: stopPropagationMock
      })
    expect(props.onToggleKeyboardShortcutsModal).toHaveBeenCalledTimes(0)
  })
  test('closing the modal by pressing Esc', () => {
    const { props } = setupForModal(true)
    const preventDefaultMock = jest.fn()
    const stopPropagationMock = jest.fn()
    windowEventMap.keydown({
        key: 'Escape',
        preventDefault: preventDefaultMock,
        stopPropagation: stopPropagationMock
      })
    expect(props.onToggleKeyboardShortcutsModal).toHaveBeenCalledTimes(1)
    expect(props.onToggleKeyboardShortcutsModal).toHaveBeenCalledWith(false)
  })
  test('closing the modal by pressing Close button', () => {
    const { enzymeWrapper } = setupForModal(true)
    enzymeWrapper.find(Button).simulate('click')
    expect(enzymeWrapper.props().onToggleKeyboardShortcutsModal).toHaveBeenCalledTimes(1)
    expect(enzymeWrapper.props().onToggleKeyboardShortcutsModal).toHaveBeenCalledWith(false)
  })
})