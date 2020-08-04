import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import projections from '../../../util/map/projections'

import { CollectionDetailsHeaderContainer } from '../CollectionDetailsHeaderContainer'
import CollectionDetailsHeader from '../../../components/CollectionDetails/CollectionDetailsHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionQuery: {},
    collectionsSearch: {},
    collectionMetadata: {
      some: 'metadata'
    },
    location: {
      search: ''
    },
    mapProjection: projections.geographic
  }

  const enzymeWrapper = shallow(<CollectionDetailsHeaderContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionDetailsHeaderContainer component', () => {
  test('passes its props and renders a single CollectionDetailsHeader component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(CollectionDetailsHeader).length).toBe(1)
    expect(enzymeWrapper.find(CollectionDetailsHeader).props().collectionMetadata).toEqual({
      some: 'metadata'
    })
  })
})
