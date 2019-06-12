import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { GranuleDetailsTabContainer } from '../GranuleDetailsTabContainer'
import GranuleDetailsTab from '../../../components/GranuleDetails/GranuleDetailsTab'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    location: {
      search: '?some=test-params'
    },
    onFocusedGranuleChange: jest.fn()
  }

  const enzymeWrapper = shallow(<GranuleDetailsTabContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleDetailsTabContainer component', () => {
  test('passes its props and renders a single GranuleDetailsTab component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(GranuleDetailsTab).length).toBe(1)
    expect(typeof enzymeWrapper.find(GranuleDetailsTab).props().onFocusedGranuleChange).toEqual('function')
    expect(enzymeWrapper.find(GranuleDetailsTab).props().location).toEqual({
      search: '?some=test-params'
    })
    enzymeWrapper.find(GranuleDetailsTab).dive().find('Link').simulate('click')
    expect(props.onFocusedGranuleChange).toHaveBeenCalledTimes(1)
  })
})
