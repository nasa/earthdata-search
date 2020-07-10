import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { CollectionDetailsHeaderContainer } from '../CollectionDetailsHeaderContainer'
import CollectionDetailsHeader from '../../../components/CollectionDetails/CollectionDetailsHeader'
import projections from '../../../util/map/projections'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: {
      allIds: ['focusedCollection'],
      byId: {
        focusedCollection: {
          excludedGranuleIds: [],
          metadata: {
            some: 'metadata'
          }
        }
      }
    },
    focusedCollection: 'focusedCollection',
    location: { search: '' },
    collectionSearch: {},
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
    expect(enzymeWrapper.find(CollectionDetailsHeader).props('focusedCollectionMetadata')).toEqual({
      collectionSearch: {},
      focusedCollectionMetadata: { some: 'metadata' },
      location: { search: '' },
      mapProjection: projections.geographic
    })
  })
})
