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
    panels: {
      activePanel: '0.0.0',
      isOpen: false
    },
    collectionSearch: {},
    savedProject: {
      projectId: 1,
      name: 'test name'
    },
    onUpdateProjectName: jest.fn(),
    onMetricsDataAccess: jest.fn()
  }

  const enzymeWrapper = shallow(<ProjectCollections {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ProjectCollectionsList component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper, props } = setup()

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
      byId: {
        collectionId1: {
          isValid: false
        },
        collectionId2: {
          isValid: false
        }
      },
      collectionIds: ['collectionId1', 'collectionId2']
    })
    expect(enzymeWrapper.find(ProjectHeader).props().savedProject).toEqual({
      projectId: 1,
      name: 'test name'
    })

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
      byId: {
        collectionId1: {
          isValid: false
        },
        collectionId2: {
          isValid: false
        }
      },
      collectionIds: ['collectionId1', 'collectionId2']
    })

    expect(enzymeWrapper.find(ProjectCollectionsList).props().onMetricsDataAccess)
      .toEqual(props.onMetricsDataAccess)

    expect(enzymeWrapper.find('.project-collections__footer').length).toBe(1)
  })
})
