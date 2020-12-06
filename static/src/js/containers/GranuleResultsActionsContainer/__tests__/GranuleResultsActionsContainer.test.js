import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { GranuleResultsActionsContainer } from '../GranuleResultsActionsContainer'
import GranuleResultsActions from '../../../components/GranuleResults/GranuleResultsActions'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    location: {
      search: 'value'
    },
    collectionMetadata: {
      mock: 'data'
    },
    focusedCollectionId: 'focusedCollection',
    focusedProjectCollection: {
      accessMethods: {},
      selectedAccessMethod: '',
      granules: {
        params: {
          pageNum: 1
        },
        isLoaded: true,
        isLoading: false,
        hits: 100,
        totalSize: '',
        allIds: [],
        addedIds: [],
        removedIds: []
      }
    },
    granuleQuery: {
      pageNum: 1
    },
    granuleSearchResults: {
      isLoaded: true,
      isLoading: false,
      hits: 100,
      allIds: [],
      excludledGranuleIds: []
    },
    project: {
      collections: {
        allIds: ['focusedCollection'],
        byId: {
          focusedCollection: {
            accessMethods: {},
            selectedAccessMethod: '',
            granules: {
              params: {
                pageNum: 1
              },
              isLoaded: true,
              isLoading: false,
              hits: 100,
              totalSize: '',
              allIds: [],
              addedIds: [],
              removedIds: []
            }
          }
        }
      }
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onChangePath: jest.fn(),
    subscriptions: []
  }

  const enzymeWrapper = shallow(<GranuleResultsActionsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleResultsActionsContainer component', () => {
  test('passes its props and renders a single GranuleResultsActions component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleResultsActions).length).toBe(1)
    expect(enzymeWrapper.find(GranuleResultsActions).props().focusedCollectionId).toEqual('focusedCollection')
    expect(enzymeWrapper.find(GranuleResultsActions).props().isCollectionInProject).toEqual(true)

    expect(typeof enzymeWrapper.find(GranuleResultsActions).props().onAddProjectCollection).toEqual('function')
    expect(typeof enzymeWrapper.find(GranuleResultsActions).props().onRemoveCollectionFromProject).toEqual('function')
  })
})
