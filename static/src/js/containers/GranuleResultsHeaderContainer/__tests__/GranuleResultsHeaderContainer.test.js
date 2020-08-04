import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import projections from '../../../util/map/projections'

import { GranuleResultsHeaderContainer } from '../GranuleResultsHeaderContainer'
import GranuleResultsHeader from '../../../components/GranuleResults/GranuleResultsHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionMetadata: {
      mock: 'here'
    },
    collectionQuery: {},
    collectionsSearch: {},
    focusedCollectionId: 'collectionId',
    granules: {
      hits: 1
    },
    granuleSearchResults: {},
    granuleQuery: {
      pageNum: 1
    },
    location: { value: 'location' },
    mapProjection: projections.geographic,
    secondaryOverlayPanel: {},
    onApplyGranuleFilters: jest.fn(),
    onChangePanelView: jest.fn(),
    onUndoExcludeGranule: jest.fn(),
    onToggleAboutCwicModal: jest.fn(),
    onToggleSecondaryOverlayPanel: jest.fn(),
    panelView: 'list'
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
    expect(enzymeWrapper.find(GranuleResultsHeader).props().location).toEqual({ value: 'location' })

    expect(typeof enzymeWrapper.find(GranuleResultsHeader).props().onApplyGranuleFilters).toEqual('function')
    expect(typeof enzymeWrapper.find(GranuleResultsHeader).props().onChangePanelView).toEqual('function')
    expect(typeof enzymeWrapper.find(GranuleResultsHeader).props().onApplyGranuleFilters).toEqual('function')
  })
})
