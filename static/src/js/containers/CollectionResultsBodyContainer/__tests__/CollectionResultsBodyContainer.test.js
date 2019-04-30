import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { CollectionResultsBodyContainer } from '../CollectionResultsBodyContainer'
import CollectionResultsBody from '../../../components/CollectionResults/CollectionResultsBody'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: { value: 'collections' },
    location: { value: 'location' },
    onFocusedCollectionChange: jest.fn()
  }

  const enzymeWrapper = shallow(<CollectionResultsBodyContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsBodyContainer component', () => {
  test('passes its props and renders a single CollectionResultsBody component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(CollectionResultsBody).length).toBe(1)
    expect(enzymeWrapper.find(CollectionResultsBody).props().collections).toEqual({ value: 'collections' })
    expect(enzymeWrapper.find(CollectionResultsBody).props().location).toEqual({ value: 'location' })
    expect(typeof enzymeWrapper.find(CollectionResultsBody).props().onFocusedCollectionChange).toEqual('function')
  })
})
