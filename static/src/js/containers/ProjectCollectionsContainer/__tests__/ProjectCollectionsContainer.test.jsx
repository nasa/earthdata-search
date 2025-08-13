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
    onSetActivePanel: jest.fn(),
    onSetActivePanelSection: jest.fn()
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
      onUpdateProjectName: expect.any(Function),
      savedProject: {}
    }, {})
  })
})
