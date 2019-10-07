import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { TooManyPointsModalContainer } from '../TooManyPointsModalContainer'
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

describe('TooManyPointsModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(TooManyPointsModal).length).toBe(1)
    expect(enzymeWrapper.find(TooManyPointsModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(TooManyPointsModal).props().onToggleTooManyPointsModal).toEqual('function')
  })
})
