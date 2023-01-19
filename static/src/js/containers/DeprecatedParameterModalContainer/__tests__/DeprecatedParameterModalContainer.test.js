import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, DeprecatedParameterModalContainer } from '../DeprecatedParameterModalContainer'
import { DeprecatedParameterModal } from '../../../components/DeprecatedParameterModal/DeprecatedParameterModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    deprecatedUrlParams: [],
    isOpen: true,
    onToggleDeprecatedParameterModal: jest.fn()
  }

  const enzymeWrapper = shallow(<DeprecatedParameterModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onToggleDeprecatedParameterModal calls actions.toggleDeprecatedParameterModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleDeprecatedParameterModal')

    mapDispatchToProps(dispatch).onToggleDeprecatedParameterModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      ui: {
        deprecatedParameterModal: {
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

describe('DeprecatedParameterModalContainer component', () => {
  test('passes its props and renders a single DeprecatedParameterModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(DeprecatedParameterModal).length).toBe(1)
    expect(enzymeWrapper.find(DeprecatedParameterModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(DeprecatedParameterModal).props().onToggleDeprecatedParameterModal).toEqual('function')
  })
})
