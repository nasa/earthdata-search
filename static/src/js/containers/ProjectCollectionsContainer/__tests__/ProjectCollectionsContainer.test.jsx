import React from 'react'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  ProjectCollectionsContainer
} from '../ProjectCollectionsContainer'
import ProjectCollections from '../../../components/ProjectCollections/ProjectCollections'
import * as metricsDataAccess from '../../../middleware/metrics/actions'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/ProjectCollections/ProjectCollections', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: ProjectCollectionsContainer,
  defaultProps: {
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
    onTogglePanels: jest.fn(),
    onUpdateProjectName: jest.fn(),
    onUpdateFocusedCollection: jest.fn(),
    onSetActivePanel: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    onViewCollectionGranules: jest.fn()
  },
  defaultZustandState: {
    project: {
      collections: {
        allIds: ['collectionId']
      }
    }
  }
})

describe('mapDispatchToProps', () => {
  test('onSetActivePanel calls actions.setActivePanel', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setActivePanel')

    mapDispatchToProps(dispatch).onSetActivePanel('panelId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('panelId')
  })

  test('onTogglePanels calls actions.togglePanels', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'togglePanels')

    mapDispatchToProps(dispatch).onTogglePanels(false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
  })

  test('onSetActivePanelSection calls actions.setActivePanelSection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setActivePanelSection')

    mapDispatchToProps(dispatch).onSetActivePanelSection('sectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('sectionId')
  })

  test('onUpdateProjectName calls actions.updateProjectName', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateProjectName')

    mapDispatchToProps(dispatch).onUpdateProjectName('name')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('name')
  })

  test('onMetricsDataAccess calls metricsDataAccess', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsDataAccess, 'metricsDataAccess')

    mapDispatchToProps(dispatch).onMetricsDataAccess({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onUpdateFocusedCollection calls actions.updateFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateFocusedCollection')

    mapDispatchToProps(dispatch).onUpdateFocusedCollection('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
  })

  test('onViewCollectionDetails calls viewCollectionDetails', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'viewCollectionDetails')

    mapDispatchToProps(dispatch).onViewCollectionDetails({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onViewCollectionGranules calls viewCollectionGranules', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'viewCollectionGranules')

    mapDispatchToProps(dispatch).onViewCollectionGranules({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      metadata: {
        collections: {}
      },
      panels: {},
      savedProject: {}
    }

    const expectedState = {
      panels: {},
      savedProject: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('ProjectCollectionsContainer component', () => {
  test('passes its props and renders a single ProjectCollections component', () => {
    setup()

    expect(ProjectCollections).toHaveBeenCalledTimes(1)
    expect(ProjectCollections).toHaveBeenCalledWith({
      onMetricsDataAccess: expect.any(Function),
      onSetActivePanel: expect.any(Function),
      onSetActivePanelSection: expect.any(Function),
      onTogglePanels: expect.any(Function),
      onUpdateFocusedCollection: expect.any(Function),
      onUpdateProjectName: expect.any(Function),
      onViewCollectionDetails: expect.any(Function),
      onViewCollectionGranules: expect.any(Function),
      panels: {
        activePanel: '0.0.0',
        isOpen: false
      },
      savedProject: {}
    }, {})
  })
})
