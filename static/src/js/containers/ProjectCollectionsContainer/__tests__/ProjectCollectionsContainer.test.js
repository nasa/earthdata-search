import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import projections from '../../../util/map/projections'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, ProjectCollectionsContainer } from '../ProjectCollectionsContainer'
import ProjectCollections from '../../../components/ProjectCollections/ProjectCollections'
import * as metricsDataAccess from '../../../middleware/metrics/actions'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionsQuery: {},
    map: {
      projection: projections.geographic
    },
    project: {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            accessMethods: {},
            selectedAccessMethod: ''
          }
        }
      }
    },
    projectCollectionsIds: ['collectionId'],
    projectCollectionsMetadata: {
      collectionId: {
        mock: 'data'
      }
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

describe('mapDispatchToProps', () => {
  test('onRemoveCollectionFromProject calls actions.removeCollectionFromProject', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeCollectionFromProject')

    mapDispatchToProps(dispatch).onRemoveCollectionFromProject('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onToggleCollectionVisibility calls actions.toggleCollectionVisibility', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleCollectionVisibility')

    mapDispatchToProps(dispatch).onToggleCollectionVisibility('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onSetActivePanel calls actions.setActivePanel', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setActivePanel')

    mapDispatchToProps(dispatch).onSetActivePanel('panelId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('panelId')
  })

  test('onTogglePanels calls actions.togglePanels', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'togglePanels')

    mapDispatchToProps(dispatch).onTogglePanels(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })

  test('onSetActivePanelSection calls actions.setActivePanelSection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setActivePanelSection')

    mapDispatchToProps(dispatch).onSetActivePanelSection('sectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('sectionId')
  })

  test('onUpdateProjectName calls actions.updateProjectName', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateProjectName')

    mapDispatchToProps(dispatch).onUpdateProjectName('name')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('name')
  })

  test('onMetricsDataAccess calls metricsDataAccess', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsDataAccess, 'metricsDataAccess')

    mapDispatchToProps(dispatch).onMetricsDataAccess({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onUpdateFocusedCollection calls actions.updateFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateFocusedCollection')

    mapDispatchToProps(dispatch).onUpdateFocusedCollection('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onViewCollectionDetails calls viewCollectionDetails', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'viewCollectionDetails')

    mapDispatchToProps(dispatch).onViewCollectionDetails({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onViewCollectionGranules calls viewCollectionGranules', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'viewCollectionGranules')

    mapDispatchToProps(dispatch).onViewCollectionGranules({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      map: {
        projection: ''
      },
      metadata: {
        collections: {}
      },
      panels: {},
      project: {},
      query: {
        collection: {}
      },
      savedProject: {}
    }

    const expectedState = {
      collectionsQuery: {},
      map: {
        projection: ''
      },
      panels: {},
      project: {},
      projectCollectionsIds: [],
      projectCollectionsMetadata: {},
      savedProject: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('ProjectCollectionsContainer component', () => {
  test('passes its props and renders a single ProjectCollections component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(ProjectCollections).length).toBe(1)
    expect(enzymeWrapper.find(ProjectCollections).props().collectionsQuery).toEqual({})
    expect(enzymeWrapper.find(ProjectCollections).props().project).toEqual({
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            accessMethods: {},
            selectedAccessMethod: ''
          }
        }
      }
    })
    expect(enzymeWrapper.find(ProjectCollections).props().projectCollectionsMetadata).toEqual({
      collectionId: {
        mock: 'data'
      }
    })
    expect(enzymeWrapper.find(ProjectCollections).props().projectCollectionsIds).toEqual(
      ['collectionId']
    )
    expect(typeof enzymeWrapper.find(ProjectCollections).props().onRemoveCollectionFromProject).toEqual('function')
  })
})
