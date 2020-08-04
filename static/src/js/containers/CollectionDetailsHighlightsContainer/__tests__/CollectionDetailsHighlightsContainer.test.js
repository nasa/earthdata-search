import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { CollectionDetailsHighlightsContainer } from '../CollectionDetailsHighlightsContainer'
import CollectionDetailsHighlights from '../../../components/CollectionDetailsHighlights/CollectionDetailsHighlights'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collectionMetadata: {},
    collectionsSearch: {
      isLoaded: true,
      isLoading: false
    },
    location: {
      search: ''
    },
    onToggleRelatedUrlsModal: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<CollectionDetailsHighlightsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionDetailsHighlightsContainer component', () => {
  test('passes its props and renders a single CollectionDetailsHighlights component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(CollectionDetailsHighlights).length).toBe(1)
    expect(enzymeWrapper.find(CollectionDetailsHighlights).props().collectionMetadata).toEqual({})
    expect(enzymeWrapper.find(CollectionDetailsHighlights).props().collectionsSearch).toEqual({
      isLoaded: true,
      isLoading: false
    })
    expect(enzymeWrapper.find(CollectionDetailsHighlights).props().location).toEqual({
      search: ''
    })
    expect(typeof enzymeWrapper.find(CollectionDetailsHighlights).props().onToggleRelatedUrlsModal)
      .toEqual('function')
  })
})
