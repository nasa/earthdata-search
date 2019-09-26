import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { OverrideTemporalModalContainer } from '../OverrideTemporalModalContainer'
import OverrideTemporalModal
  from '../../../components/OverrideTemporalModal/OverrideTemporalModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: true,
    temporalSearch: {},
    timeline: {},
    onChangeProjectQuery: jest.fn(),
    onToggleOverrideTemporalModal: jest.fn()
  }

  const enzymeWrapper = shallow(<OverrideTemporalModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('OverrideTemporalModalContainer component', () => {
  test('passes its props and renders a single OverrideTemporalModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(OverrideTemporalModal).length).toBe(1)
    expect(enzymeWrapper.find(OverrideTemporalModal).props().isOpen).toEqual(true)
    expect(enzymeWrapper.find(OverrideTemporalModal).props().temporalSearch).toEqual({})
    expect(enzymeWrapper.find(OverrideTemporalModal).props().timeline).toEqual({})
    expect(typeof enzymeWrapper.find(OverrideTemporalModal)
      .props().onChangeQuery).toEqual('function')
    expect(typeof enzymeWrapper.find(OverrideTemporalModal)
      .props().onToggleOverrideTemporalModal).toEqual('function')
  })
})
