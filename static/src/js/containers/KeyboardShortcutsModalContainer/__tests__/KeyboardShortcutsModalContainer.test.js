import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { KeyboardShortcutsModalContainer, mapDispatchToProps, mapStateToProps } from '../KeyboardShortcutsModalContainer'
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

describe('mapDispatchToProps', () => {
  test('onToggleKeyboardShortcutsModal calls actions.toggleKeyboardShortcutsModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleKeyboardShortcutsModal')

    mapDispatchToProps(dispatch).onToggleKeyboardShortcutsModal('false')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('false')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      metadata: {
        collections: {}
      },
      focusedCollection: 'collectionId',
      ui: {
        keyboardShortcutsModal: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      isOpen: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('KeyboardShortcutsModalContainer component', () => {
  test('passes its props and renders a single KeyboardShortcutsModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(KeyboardShortcutsModal).length).toBe(1)
    expect(enzymeWrapper.find(KeyboardShortcutsModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(KeyboardShortcutsModal).props().onToggleKeyboardShortcutsModal).toEqual('function')
  })
})
