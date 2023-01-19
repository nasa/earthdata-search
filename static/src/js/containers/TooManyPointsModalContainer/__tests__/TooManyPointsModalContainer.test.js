import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, TooManyPointsModalContainer } from '../TooManyPointsModalContainer'
import { TooManyPointsModal } from '../../../components/TooManyPointsModal/TooManyPointsModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: true,
    onToggleTooManyPointsModal: jest.fn()
  }

  const enzymeWrapper = shallow(<TooManyPointsModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onToggleTooManyPointsModal calls actions.toggleTooManyPointsModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleTooManyPointsModal')

    mapDispatchToProps(dispatch).onToggleTooManyPointsModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      ui: {
        tooManyPointsModal: {
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

describe('TooManyPointsModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(TooManyPointsModal).length).toBe(1)
    expect(enzymeWrapper.find(TooManyPointsModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(TooManyPointsModal).props().onToggleTooManyPointsModal).toEqual('function')
  })
})
