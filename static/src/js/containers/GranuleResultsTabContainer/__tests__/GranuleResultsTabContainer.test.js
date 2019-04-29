import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { GranuleResultsTabContainer } from '../GranuleResultsTabContainer'
import GranuleResultsTab from '../../../components/GranuleResults/GranuleResultsTab'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onFocusedCollectionChange: jest.fn()
  }

  const enzymeWrapper = shallow(<GranuleResultsTabContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsTabContainer component', () => {
  test('passes its props and renders a single GranuleResultsTab component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleResultsTab).length).toBe(1)
    expect(typeof enzymeWrapper.find(GranuleResultsTab).props().onFocusedCollectionChange).toEqual('function')
  })
})
