import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { GranuleResultsHeaderContainer } from '../GranuleResultsHeaderContainer'
import GranuleResultsHeader from '../../../components/GranuleResults/GranuleResultsHeader'
import projections from '../../../util/map/projections'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: [],
          metadata: {
            mock: 'here'
          }
        }
      },
      projectIds: []
    },
    collectionSearch: {},
    focusedCollection: 'collectionId',
    granules: {
      hits: 1
    },
    granuleSearch: {
      pageNum: 1
    },
    location: { value: 'location' },
    mapProjection: projections.geographic,
    secondaryOverlayPanel: {},
    onApplyGranuleFilters: jest.fn(),
    onUndoExcludeGranule: jest.fn(),
    onToggleAboutCwicModal: jest.fn(),
    onToggleSecondaryOverlayPanel: jest.fn()
  }

  const enzymeWrapper = shallow(<GranuleResultsHeaderContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsHeaderContainer component', () => {
  test('passes its props and renders a single GranuleResultsHeader component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleResultsHeader).length).toBe(1)
    expect(enzymeWrapper.find(GranuleResultsHeader).props().focusedCollectionObject).toEqual({
      excludedGranuleIds: [],
      metadata: { mock: 'here' }
    })
    expect(enzymeWrapper.find(GranuleResultsHeader).props().location).toEqual({ value: 'location' })
    expect(typeof enzymeWrapper.find(GranuleResultsHeader).props().onApplyGranuleFilters).toEqual('function')
  })
})
