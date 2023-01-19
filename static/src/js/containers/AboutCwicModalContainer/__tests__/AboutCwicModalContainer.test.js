import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, AboutCwicModalContainer } from '../AboutCwicModalContainer'
import { AboutCwicModal } from '../../../components/AboutCwicModal/AboutCwicModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: true,
    onToggleAboutCwicModal: jest.fn()
  }

  const enzymeWrapper = shallow(<AboutCwicModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onToggleAboutCwicModal calls actions.toggleAboutCwicModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCwicModal')

    mapDispatchToProps(dispatch).onToggleAboutCwicModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      ui: {
        aboutCwicModal: {
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

describe('AboutCwicModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AboutCwicModal).length).toBe(1)
    expect(enzymeWrapper.find(AboutCwicModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(AboutCwicModal).props().onToggleAboutCwicModal).toEqual('function')
  })
})
