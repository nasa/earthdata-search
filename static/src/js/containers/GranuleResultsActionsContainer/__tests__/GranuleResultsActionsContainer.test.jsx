import React from 'react'

import actions from '../../../actions'

import * as metricsActions from '../../../middleware/metrics/actions'

import {
  mapDispatchToProps,
  mapStateToProps,
  GranuleResultsActionsContainer
} from '../GranuleResultsActionsContainer'
import GranuleResultsActions from '../../../components/GranuleResults/GranuleResultsActions'

import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/GranuleResults/GranuleResultsActions', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleResultsActionsContainer,
  defaultProps: {
    authToken: 'token',
    collectionMetadata: {
      mock: 'data'
    },
    collectionQuery: {},
    earthdataEnvironment: 'prod',
    focusedCollectionId: 'focusedCollection',
    focusedProjectCollection: {
      accessMethods: {},
      granules: {
        addedIds: [],
        allIds: [],
        hits: 100,
        isLoaded: true,
        isLoading: false,
        params: {
          pageNum: 1
        },
        removedIds: [],
        totalSize: ''
      },
      selectedAccessMethod: ''
    },
    granuleQuery: {
      pageNum: 1
    },
    granuleSearchResults: {
      allIds: [],
      excludledGranuleIds: [],
      hits: 100,
      isLoaded: true,
      isLoading: false
    },
    onAddProjectCollection: jest.fn(),
    onChangePath: jest.fn(),
    onMetricsAddCollectionProject: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onSetActivePanelSection: jest.fn(),
    project: {
      collections: {
        allIds: ['focusedCollection'],
        byId: {
          focusedCollection: {
            accessMethods: {},
            granules: {
              addedIds: [],
              allIds: [],
              hits: 100,
              isLoaded: true,
              isLoading: false,
              params: {
                pageNum: 1
              },
              removedIds: [],
              totalSize: ''
            },
            selectedAccessMethod: ''
          }
        }
      }
    },
    subscriptions: []
  }
})

describe('mapDispatchToProps', () => {
  test('onAddProjectCollection calls actions.addProjectCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'addProjectCollection')

    mapDispatchToProps(dispatch).onAddProjectCollection('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
  })

  test('onRemoveCollectionFromProject calls actions.removeCollectionFromProject', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeCollectionFromProject')

    mapDispatchToProps(dispatch).onRemoveCollectionFromProject('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
  })

  test('onSetActivePanelSection calls actions.setActivePanelSection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setActivePanelSection')

    mapDispatchToProps(dispatch).onSetActivePanelSection('panelId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('panelId')
  })

  test('onUpdateFocusedCollection calls actions.updateFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateFocusedCollection')

    mapDispatchToProps(dispatch).onUpdateFocusedCollection('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
  })

  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('path')
  })

  test('onMetricsAddCollectionProject calls metricsActions.metricsAddCollectionProject', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsActions, 'metricsAddCollectionProject')

    mapDispatchToProps(dispatch).onMetricsAddCollectionProject({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      authToken: 'token',
      metadata: {
        collections: {
          collectionId: {
            subscriptions: []
          }
        }
      },
      earthdataEnvironment: 'prod',
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleId',
      query: {
        collection: {}
      },
      project: {},
      shapefile: {}
    }

    const expectedState = {
      authToken: 'token',
      collectionMetadata: {
        subscriptions: []
      },
      collectionQuery: {},
      earthdataEnvironment: 'prod',
      focusedCollectionId: 'collectionId',
      focusedProjectCollection: {},
      granuleQuery: {},
      granuleSearchResults: {},
      project: {},
      subscriptions: []
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('GranuleResultsActionsContainer component', () => {
  test('passes its props and renders a single GranuleResultsActions component', () => {
    setup()

    expect(GranuleResultsActions).toHaveBeenCalledTimes(1)
    expect(GranuleResultsActions).toHaveBeenCalledWith({
      addedGranuleIds: [],
      authToken: 'token',
      earthdataEnvironment: 'prod',
      focusedCollectionId: 'focusedCollection',
      focusedProjectCollection: {
        accessMethods: {},
        granules: {
          addedIds: [],
          allIds: [],
          hits: 100,
          isLoaded: true,
          isLoading: false,
          params: { pageNum: 1 },
          removedIds: [],
          totalSize: ''
        },
        selectedAccessMethod: ''
      },
      granuleLimit: 1000000,
      handoffLinks: [],
      initialLoading: false,
      isCollectionInProject: true,
      onAddProjectCollection: expect.any(Function),
      onChangePath: expect.any(Function),
      onMetricsAddCollectionProject: expect.any(Function),
      onRemoveCollectionFromProject: expect.any(Function),
      onSetActivePanelSection: expect.any(Function),
      projectCollectionIds: ['focusedCollection'],
      projectGranuleCount: 100,
      removedGranuleIds: [],
      searchGranuleCount: 100,
      subscriptions: []
    }, {})
  })
})
