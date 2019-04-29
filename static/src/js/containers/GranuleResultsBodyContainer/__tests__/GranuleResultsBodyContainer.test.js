import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { GranuleResultsBodyContainer } from '../GranuleResultsBodyContainer'
import GranuleResultsBody from '../../../components/GranuleResults/GranuleResultsBody'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    focusedCollection: { value: 'focusedCollection' },
    granules: { value: 'granules' },
    onFocusedCollectionChange: jest.fn()
  }

  const enzymeWrapper = shallow(<GranuleResultsBodyContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsBodyContainer component', () => {
  test('passes its props and renders a single GranuleResultsBody component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleResultsBody).length).toBe(1)
    expect(enzymeWrapper.find(GranuleResultsBody).props().focusedCollection).toEqual({ value: 'focusedCollection' })
    expect(enzymeWrapper.find(GranuleResultsBody).props().granules).toEqual({ value: 'granules' })
    expect(typeof enzymeWrapper.find(GranuleResultsBody).props().onFocusedCollectionChange).toEqual('function')
  })
})
