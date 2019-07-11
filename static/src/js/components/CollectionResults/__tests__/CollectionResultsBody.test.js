import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import CollectionResultsBody from '../CollectionResultsBody'
import CollectionResultsList from '../CollectionResultsList'

// TODO: Write more tests

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: {
      allIds: ['collectionId1', 'collectionId2'],
      byId: {
        collectionId1: {
          id: 'collectionId1'
        },
        collectionId2: {
          id: 'collectionId2'
        }
      },
      hits: '181',
      isLoaded: true,
      isLoading: false,
      loadTime: 1150,
      timerStart: null
    },
    projectIds: [],
    location: {
      pathname: '/test'
    },
    onAddProjectCollection: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    waypointEnter: jest.fn()
  }

  const enzymeWrapper = shallow(<CollectionResultsBody {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('CollectionResultsBody component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.type()).toEqual('div')
    expect(enzymeWrapper.props().className).toEqual('collection-results-body')
    expect(enzymeWrapper.find(CollectionResultsList).length).toEqual(1)
  })

  test('passes the correct props to CollectionResultsList', () => {
    const { enzymeWrapper, props } = setup()
    const collectionResultsList = enzymeWrapper.find(CollectionResultsList)
    expect(collectionResultsList.props().collections)
      .toEqual(props.collections)
    expect(collectionResultsList.props().onViewCollectionGranules)
      .toEqual(props.onViewCollectionGranules)
    expect(collectionResultsList.props().onViewCollectionDetails)
      .toEqual(props.onViewCollectionDetails)
    expect(collectionResultsList.props().waypointEnter)
      .toEqual(props.waypointEnter)
  })
})
