import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ProjectCollections from '../ProjectCollections'
import ProjectCollectionsList from '../ProjectCollectionsList'
import ProjectHeader from '../ProjectHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: {
      allIds: ['collectionId1', 'collectionId2'],
      byId: {
        collectionId1: {
          mock: 'data 1'
        },
        collectionId2: {
          mock: 'data 2'
        }
      }
    },
    collectionsSearch: {
      allIds: ['collectionId1', 'collectionId2'],
      byId: {
        collectionId1: {
          mock: 'data 1'
        },
        collectionId2: {
          mock: 'data 2'
        }
      },
      isLoading: false
    },
    onRemoveCollectionFromProject: jest.fn(),
    onToggleCollectionVisibility: jest.fn(),
    onSetActivePanel: jest.fn(),
    project: {
      collectionIds: ['collectionId1', 'collectionId2']
    },
    projectPanels: {
      activePanel: '0.0.0',
      isOpen: false
    }
  }

  const enzymeWrapper = shallow(<ProjectCollections {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectCollectionsList component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(ProjectHeader).length).toBe(1)
    expect(enzymeWrapper.find(ProjectHeader).props().collections).toEqual({
      allIds: ['collectionId1', 'collectionId2'],
      byId: {
        collectionId1: {
          mock: 'data 1'
        },
        collectionId2: {
          mock: 'data 2'
        }
      }
    })
    expect(enzymeWrapper.find(ProjectHeader).props().project).toEqual({
      collectionIds: ['collectionId1', 'collectionId2']
    })
    expect(enzymeWrapper.find(ProjectHeader).props().loading).toEqual(false)

    expect(enzymeWrapper.find(ProjectCollectionsList).length).toBe(1)
    expect(enzymeWrapper.find(ProjectCollectionsList).props().collections).toEqual({
      allIds: ['collectionId1', 'collectionId2'],
      byId: {
        collectionId1: {
          mock: 'data 1'
        },
        collectionId2: {
          mock: 'data 2'
        }
      }
    })
    expect(enzymeWrapper.find(ProjectCollectionsList).props().project).toEqual({
      collectionIds: ['collectionId1', 'collectionId2']
    })

    expect(enzymeWrapper.find('.project-collections__footer').length).toBe(1)
  })
})
