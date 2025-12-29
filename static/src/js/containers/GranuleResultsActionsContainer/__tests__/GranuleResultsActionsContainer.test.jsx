import React from 'react'

import GranuleResultsActionsContainer from '../GranuleResultsActionsContainer'
import GranuleResultsActions from '../../../components/GranuleResults/GranuleResultsActions'

import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../store/configureStore', () => jest.fn())

jest.mock('../../../components/GranuleResults/GranuleResultsActions', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleResultsActionsContainer,
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

describe('GranuleResultsActionsContainer component', () => {
  test('passes its props and renders a single GranuleResultsActions component', () => {
    setup()

    expect(GranuleResultsActions).toHaveBeenCalledTimes(1)
    expect(GranuleResultsActions).toHaveBeenCalledWith({
      addedGranuleIds: [],
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
      projectCollectionIds: ['collectionId'],
      projectGranuleCount: 100,
      removedGranuleIds: [],
      searchGranuleCount: 100
    }, {})
  })
})
