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

jest.mock('../../../store/configureStore', () => jest.fn())

jest.mock('../../../components/GranuleResults/GranuleResultsActions', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleResultsActionsContainer,
  defaultProps: {
    authToken: 'token',
    onChangePath: jest.fn(),
    onMetricsAddCollectionProject: jest.fn()
  },
  defaultZustandState: {
    collection: {
      collectionId: 'collectionId'
    },
    granules: {
      granules: {
        count: 100,
        isLoaded: true,
        isLoading: false,
        items: []
      }
    },
    project: {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            accessMethods: {},
            granules: {
              addedIds: [],
              allIds: [],
              count: 100,
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
      authToken: 'token'
    }

    const expectedState = {
      authToken: 'token'
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
      focusedCollectionId: 'collectionId',
      focusedProjectCollection: {
        accessMethods: {},
        granules: {
          addedIds: [],
          allIds: [],
          count: 100,
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
      onChangePath: expect.any(Function),
      onMetricsAddCollectionProject: expect.any(Function),
      projectCollectionIds: ['collectionId'],
      projectGranuleCount: 100,
      removedGranuleIds: [],
      searchGranuleCount: 100
    }, {})
  })
})
