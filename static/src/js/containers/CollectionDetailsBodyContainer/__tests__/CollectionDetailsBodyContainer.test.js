import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { CollectionDetailsBodyContainer } from '../CollectionDetailsBodyContainer'
import CollectionDetailsBody from '../../../components/CollectionDetails/CollectionDetailsBody'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionMetadata: {
      test: 'metadata'
    },
    isActive: true,
    onToggleRelatedUrlsModal: jest.fn()
  }

  const enzymeWrapper = shallow(<CollectionDetailsBodyContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionDetailsBodyContainer component', () => {
  test('passes its props and renders a single CollectionDetailsBody component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(CollectionDetailsBody).length).toBe(1)
    expect(enzymeWrapper.find(CollectionDetailsBody).props().collectionMetadata).toEqual({ test: 'metadata' })
    expect(enzymeWrapper.find(CollectionDetailsBody).props().isActive).toEqual(true)

    expect(typeof enzymeWrapper.find(CollectionDetailsBody).props().onToggleRelatedUrlsModal).toEqual('function')
  })
})
