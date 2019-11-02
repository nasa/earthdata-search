import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { ProjectCollectionsList } from '../ProjectCollectionsList'
import ProjectCollectionsItem from '../ProjectCollectionsItem'

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
    location: {},
    onRemoveCollectionFromProject: jest.fn(),
    onToggleCollectionVisibility: jest.fn(),
    onSetActivePanel: jest.fn(),
    project: {
      byId: {
        collectionId1: {
          isValid: false
        },
        collectionId2: {
          isValid: false
        }
      },
      collectionIds: ['collectionId1', 'collectionId2']
    },
    projectPanels: {
      activePanel: '0.0.0',
      isOpen: true
    },
    collectionSearch: {}
  }

  const enzymeWrapper = shallow(<ProjectCollectionsList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectCollectionsList component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find(ProjectCollectionsItem).length).toBe(2)
    expect(enzymeWrapper.find(ProjectCollectionsItem).first().props().collectionId).toEqual('collectionId1')
    expect(enzymeWrapper.find(ProjectCollectionsItem).first().props().collection).toEqual({
      mock: 'data 1'
    })
    expect(typeof enzymeWrapper.find(ProjectCollectionsItem).first().props().onRemoveCollectionFromProject).toEqual('function')

    expect(enzymeWrapper.find(ProjectCollectionsItem).last().props().collectionId).toEqual('collectionId2')
    expect(enzymeWrapper.find(ProjectCollectionsItem).last().props().collection).toEqual({
      mock: 'data 2'
    })
    expect(typeof enzymeWrapper.find(ProjectCollectionsItem).last().props().onRemoveCollectionFromProject).toEqual('function')
  })
})
