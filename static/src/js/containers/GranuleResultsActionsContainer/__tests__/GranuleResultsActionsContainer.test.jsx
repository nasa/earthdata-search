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
import configureStore from '../../../store/configureStore'

jest.mock('../../../store/configureStore', () => jest.fn())

jest.mock('../../../components/GranuleResults/GranuleResultsActions', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleResultsActionsContainer,
  defaultProps: {
    authToken: 'token',
    collectionMetadata: {
      mock: 'data'
    },
    focusedCollectionId: 'focusedCollection',
    granuleSearchResults: {
      allIds: [],
      excludledGranuleIds: [],
      hits: 100,
      isLoaded: true,
      isLoading: false
    },
    location: {
      search: 'value'
    },
    onChangePath: jest.fn(),
    onMetricsAddCollectionProject: jest.fn(),
    subscriptions: []
  },
  defaultZustandState: {
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
    }
  }
})

describe('mapDispatchToProps', () => {
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
      focusedCollection: 'collectionId',
      focusedGranule: 'granuleId'
    }

    const expectedState = {
      authToken: 'token',
      collectionMetadata: {
        subscriptions: []
      },
      focusedCollectionId: 'collectionId',
      granuleSearchResults: {},
      subscriptions: []
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('GranuleResultsActionsContainer component', () => {
  test('passes its props and renders a single GranuleResultsActions component', () => {
    configureStore.mockReturnValue({
      getState: () => ({
        focusedCollection: 'focusedCollection'
      })
    })

    setup()

    expect(GranuleResultsActions).toHaveBeenCalledTimes(1)
    expect(GranuleResultsActions).toHaveBeenCalledWith({
      addedGranuleIds: [],
      authToken: 'token',
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
      location: { search: 'value' },
      onChangePath: expect.any(Function),
      onMetricsAddCollectionProject: expect.any(Function),
      projectCollectionIds: ['focusedCollection'],
      projectGranuleCount: 100,
      removedGranuleIds: [],
      searchGranuleCount: 100,
      subscriptions: []
    }, {})
  })
})
