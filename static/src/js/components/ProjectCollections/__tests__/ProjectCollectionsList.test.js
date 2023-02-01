import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { ProjectCollectionsList } from '../ProjectCollectionsList'
import ProjectCollectionItem from '../ProjectCollectionItem'
import projections from '../../../util/map/projections'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionsMetadata: {
      collectionId1: {
        mock: 'data 1'
      },
      collectionId2: {
        mock: 'data 2'
      }
    },
    collectionsQuery: {},
    location: {},
    map: {
      projection: projections.geographic
    },
    onRemoveCollectionFromProject: jest.fn(),
    onToggleCollectionVisibility: jest.fn(),
    onTogglePanels: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    onSetActivePanel: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onUpdateFocusedCollection: jest.fn(),
    project: {
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            isValid: false
          },
          collectionId2: {
            isValid: false
          }
        }
      }
    },
    panels: {
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
    expect(enzymeWrapper.find(ProjectCollectionItem).length).toBe(2)
    expect(enzymeWrapper.find(ProjectCollectionItem).first().props().collectionId).toEqual('collectionId1')
    expect(enzymeWrapper.find(ProjectCollectionItem).first().props().collectionMetadata).toEqual({
      mock: 'data 1'
    })
    expect(typeof enzymeWrapper.find(ProjectCollectionItem).first().props().onRemoveCollectionFromProject).toEqual('function')

    expect(enzymeWrapper.find(ProjectCollectionItem).last().props().collectionId).toEqual('collectionId2')
    expect(enzymeWrapper.find(ProjectCollectionItem).last().props().collectionMetadata).toEqual({
      mock: 'data 2'
    })
    expect(typeof enzymeWrapper.find(ProjectCollectionItem).last().props().onRemoveCollectionFromProject).toEqual('function')
  })
})
