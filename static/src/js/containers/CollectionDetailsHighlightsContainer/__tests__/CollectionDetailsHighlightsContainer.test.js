import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { CollectionDetailsHighlightsContainer } from '../CollectionDetailsHighlightsContainer'
import CollectionDetailsHighlights from '../../../components/CollectionDetailsHighlights/CollectionDetailsHighlights'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collections: {
      allIds: ['focusedCollection'],
      byId: {
        focusedCollection: {
          metadata: {}
        }
      }
    },
    collectionSearch: {
      isLoaded: true,
      isLoading: false
    },
    focusedCollection: 'focusedCollection',
    location: { search: '' },
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
    expect(enzymeWrapper.find(CollectionDetailsHighlights).props().collection).toEqual({
      metadata: {}
    })
    expect(enzymeWrapper.find(CollectionDetailsHighlights).props().location).toEqual({ search: '' })
    expect(enzymeWrapper.find(CollectionDetailsHighlights).props().isLoaded).toEqual(true)
    expect(enzymeWrapper.find(CollectionDetailsHighlights).props().isLoading).toEqual(false)
  })
})
