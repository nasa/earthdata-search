import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { CollectionResultsTabContainer } from '../CollectionResultsTabContainer'
import CollectionResultsTab from '../../../components/CollectionResults/CollectionResultsTab'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionHits: '1'
  }

  const enzymeWrapper = shallow(<CollectionResultsTabContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsTabContainer component', () => {
  test('passes its props and renders a single CollectionResultsTab component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(CollectionResultsTab).length).toBe(1)
    expect(enzymeWrapper.find(CollectionResultsTab).props().collectionHits).toEqual('1')
  })
})
