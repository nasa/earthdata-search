import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { AboutCwicModalContainer } from '../AboutCwicModalContainer'
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

describe('AboutCwicModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AboutCwicModal).length).toBe(1)
    expect(enzymeWrapper.find(AboutCwicModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(AboutCwicModal).props().onToggleAboutCwicModal).toEqual('function')
  })
})
