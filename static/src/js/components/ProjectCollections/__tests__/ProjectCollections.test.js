import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ProjectCollections from '../ProjectCollections'
import ProjectCollectionsList from '../ProjectCollectionsList'
import ProjectHeader from '../ProjectHeader'
import projections from '../../../util/map/projections'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionSearch: {},
    collectionsQuery: {
      pageNum: 1
    },
    mapProjection: projections.geographic,
    project: {
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            isValid: false,
            granules: {
              hits: 1
            }
          },
          collectionId2: {
            isValid: false,
            granules: {
              hits: 1
            }
          }
        }
      }
    },
    projectCollectionsMetadata: {
      collectionId1: {
        mock: 'data 1'
      },
      collectionId2: {
        mock: 'data 2'
      }
    },
    projectCollectionsIds: [],
    panels: {
      activePanel: '0.0.0',
      isOpen: false
    },
    savedProject: {
      projectId: 1,
      name: 'test name'
    },
    onMetricsDataAccess: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onTogglePanels: jest.fn(),
    onSetActivePanel: jest.fn(),
    onToggleCollectionVisibility: jest.fn(),
    onUpdateProjectName: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onUpdateFocusedCollection: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    onViewCollectionGranules: jest.fn()
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
    expect(enzymeWrapper.find(ProjectHeader).props().collectionsQuery).toEqual({ pageNum: 1 })
    expect(enzymeWrapper.find(ProjectHeader).props().project).toEqual({
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            isValid: false,
            granules: {
              hits: 1
            }
          },
          collectionId2: {
            isValid: false,
            granules: {
              hits: 1
            }
          }
        }
      }
    })
    expect(enzymeWrapper.find(ProjectHeader).props().savedProject).toEqual({
      projectId: 1,
      name: 'test name'
    })

    expect(enzymeWrapper.find(ProjectCollectionsList).length).toBe(1)
    expect(enzymeWrapper.find(ProjectCollectionsList).props().collectionsMetadata).toEqual({
      collectionId1: {
        mock: 'data 1'
      },
      collectionId2: {
        mock: 'data 2'
      }
    })
    expect(enzymeWrapper.find(ProjectCollectionsList).props().project).toEqual({
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            isValid: false,
            granules: {
              hits: 1
            }
          },
          collectionId2: {
            isValid: false,
            granules: {
              hits: 1
            }
          }
        }
      }
    })

    expect(enzymeWrapper.find(ProjectCollectionsList).props().onMetricsDataAccess)
      .toEqual(props.onMetricsDataAccess)

    expect(enzymeWrapper.find('.project-collections__footer').length).toBe(1)
  })
})
