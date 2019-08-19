import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { GranuleResultsHeaderContainer } from '../GranuleResultsHeaderContainer'
import GranuleResultsHeader from '../../../components/GranuleResults/GranuleResultsHeader'

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
    focusedCollection: 'collectionId',
    granules: {
      hits: 1
    },
    location: { value: 'location' },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onUndoExcludeGranule: jest.fn(),
    onUpdateSearchValue: jest.fn(),
    onUpdateSortOrder: jest.fn(),
    searchValue: 'searchValue',
    sortOrder: 'sortOrder',
    collectionSearch: {},
    onToggleSecondaryOverlayPanel: jest.fn(),
    secondaryOverlayPanel: {}
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
    expect(enzymeWrapper.find(GranuleResultsHeader).props().focusedCollectionMetadata).toEqual({
      collectionId: {
        excludedGranuleIds: [],
        metadata: { mock: 'here' }
      }
    })
    expect(enzymeWrapper.find(GranuleResultsHeader).props().location).toEqual({ value: 'location' })
    expect(typeof enzymeWrapper.find(GranuleResultsHeader).props().onUpdateSortOrder).toEqual('function')
    expect(typeof enzymeWrapper.find(GranuleResultsHeader).props().onUpdateSearchValue).toEqual('function')
    expect(enzymeWrapper.find(GranuleResultsHeader).props().searchValue).toEqual('searchValue')
    expect(enzymeWrapper.find(GranuleResultsHeader).props().sortOrder).toEqual('sortOrder')
  })
})
