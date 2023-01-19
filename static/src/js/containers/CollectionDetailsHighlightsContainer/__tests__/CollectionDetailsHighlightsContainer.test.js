import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { CollectionDetailsHighlightsContainer, mapDispatchToProps, mapStateToProps } from '../CollectionDetailsHighlightsContainer'
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

describe('mapDispatchToProps', () => {
  test('onToggleRelatedUrlsModal calls actions.toggleRelatedUrlsModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleRelatedUrlsModal')

    mapDispatchToProps(dispatch).onToggleRelatedUrlsModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      metadata: {
        collections: {}
      },
      focusedCollection: 'collectionId',
      searchResults: {
        collections: {}
      }
    }

    const expectedState = {
      collectionMetadata: {},
      collectionsSearch: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

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
