import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { KeyboardShortcutsModalContainer } from '../KeyboardShortcutsModalContainer'
import { KeyboardShortcutsModal } from '../../../components/KeyboardShortcutsModal/KeyboardShortcutsModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: true,
    onToggleKeyboardShortcutsModal: jest.fn()
  }

  const enzymeWrapper = shallow(<KeyboardShortcutsModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('KeyboardShortcutsModalContainer component', () => {
  test('passes its props and renders a single KeyboardShortcutsModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(KeyboardShortcutsModal).length).toBe(1)
    expect(enzymeWrapper.find(KeyboardShortcutsModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(KeyboardShortcutsModal).props().onToggleKeyboardShortcutsModal).toEqual('function')
  })
})
