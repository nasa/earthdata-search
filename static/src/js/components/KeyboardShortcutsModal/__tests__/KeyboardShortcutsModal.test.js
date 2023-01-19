import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { Modal } from 'react-bootstrap'

import EDSCModal from '../../EDSCModal/EDSCModal'
import KeyboardShortcutsModal from '../KeyboardShortcutsModal'

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

const setup = (visibility) => {
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
    const { enzymeWrapper } = setup(false)
    expect(enzymeWrapper.find(EDSCModal).props().isOpen).toEqual(false)
  })

  test('when modal is visible', () => {
    const { enzymeWrapper } = setup(true)
    expect(enzymeWrapper.find(EDSCModal).props().isOpen).toEqual(true)
  })

  test('modal should be centered', () => {
    const { enzymeWrapper } = setup(true)
    expect(enzymeWrapper.find(Modal).props().centered).toEqual(true)
  })

  test('modal shouldn\'t be empty', () => {
    const { enzymeWrapper } = setup(true)
    expect(enzymeWrapper.find('kbd').length).not.toEqual(0)
  })

  test('modal should have a close button', () => {
    const { enzymeWrapper } = setup(true)
    expect(enzymeWrapper.find('button').length).not.toEqual(0)
  })
})

describe('KeyboardShortcutsModal actions', () => {
  test('keyboard action for displaying the modal', () => {
    const { props } = setup(false)
    const preventDefaultMock = jest.fn()
    const stopPropagationMock = jest.fn()
    windowEventMap.keyup({
      key: '?',
      tagName: 'input',
      type: 'keyup',
      preventDefault: preventDefaultMock,
      stopPropagation: stopPropagationMock
    })

    expect(props.onToggleKeyboardShortcutsModal).toHaveBeenCalledTimes(1)
    expect(props.onToggleKeyboardShortcutsModal).toHaveBeenCalledWith(true)
  })

  test('keyboard action for closing the modal by pressing ?', () => {
    const { props } = setup(true)
    const preventDefaultMock = jest.fn()
    const stopPropagationMock = jest.fn()
    windowEventMap.keyup({
      key: '?',
      tagName: 'input',
      type: 'keyup',
      preventDefault: preventDefaultMock,
      stopPropagation: stopPropagationMock
    })

    expect(props.onToggleKeyboardShortcutsModal).toHaveBeenCalledTimes(1)
    expect(props.onToggleKeyboardShortcutsModal).toHaveBeenCalledWith(false)
  })

  test('closing the modal by pressing Close button', () => {
    const { enzymeWrapper } = setup(true)
    enzymeWrapper.find('button').simulate('click')

    expect(enzymeWrapper.props().onToggleKeyboardShortcutsModal).toHaveBeenCalledTimes(1)
    expect(enzymeWrapper.props().onToggleKeyboardShortcutsModal).toHaveBeenCalledWith(false)
  })
})
