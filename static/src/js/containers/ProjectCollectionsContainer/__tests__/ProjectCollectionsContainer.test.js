import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { ProjectCollectionsContainer } from '../ProjectCollectionsContainer'
import ProjectCollections from '../../../components/ProjectCollections/ProjectCollections'
import projections from '../../../util/map/projections'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          mock: 'data'
        }
      }
    },
    collectionSearch: {},
    mapProjection: projections.geographic,
    project: {
      collectionIds: ['collectionId']
    },
    panels: {
      activePanel: '0.0.0',
      isOpen: false
    },
    savedProject: {},
    onMetricsDataAccess: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onTogglePanels: jest.fn(),
    onToggleCollectionVisibility: jest.fn(),
    onUpdateProjectName: jest.fn(),
    onUpdateFocusedCollection: jest.fn(),
    onSetActivePanel: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    onViewCollectionGranules: jest.fn()
  }

  const enzymeWrapper = shallow(<ProjectCollectionsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectCollectionsContainer component', () => {
  test('passes its props and renders a single ProjectCollections component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(ProjectCollections).length).toBe(1)
    expect(enzymeWrapper.find(ProjectCollections).props().collections).toEqual({
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          mock: 'data'
        }
      }
    })
    expect(enzymeWrapper.find(ProjectCollections).props().project).toEqual({
      collectionIds: ['collectionId']
    })
    expect(typeof enzymeWrapper.find(ProjectCollections).props().onRemoveCollectionFromProject).toEqual('function')
  })
})
