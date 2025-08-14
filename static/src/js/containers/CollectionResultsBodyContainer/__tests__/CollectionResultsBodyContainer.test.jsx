import React from 'react'
import { act } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as metricsActions from '../../../middleware/metrics/actions'

import {
  CollectionResultsBodyContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../CollectionResultsBodyContainer'
import CollectionResultsBody from '../../../components/CollectionResults/CollectionResultsBody'

jest.mock('../../../components/CollectionResults/CollectionResultsBody', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: CollectionResultsBodyContainer,
  defaultProps: {
    collectionsMetadata: {
      id1: {
        title: 'collection 1 title'
      },
      id2: {
        title: 'collection 2 title'
      }
    },
    collectionsSearch: {},
    projectCollectionsIds: [],
    onMetricsAddCollectionProject: jest.fn(),
    onChangeCollectionPageNum: jest.fn(),
    panelView: 'list'
  },
  defaultZustandState: {
    query: {
      changeQuery: jest.fn()
    }
  }
})

describe('mapDispatchToProps', () => {
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
      metadata: {
        collections: {}
      },
      searchResults: {
        collections: {}
      }
    }

    const expectedState = {
      collectionsSearch: {},
      collectionsMetadata: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('CollectionResultsBodyContainer component', () => {
  test('passes its props and renders a single CollectionResultsBody component', () => {
    setup()

    expect(CollectionResultsBody).toHaveBeenCalledTimes(1)
    expect(CollectionResultsBody).toHaveBeenCalledWith({
      collectionsMetadata: {
        id1: { title: 'collection 1 title' },
        id2: { title: 'collection 2 title' }
      },
      collectionsSearch: {},
      loadNextPage: expect.any(Function),
      onMetricsAddCollectionProject: expect.any(Function),
      panelView: 'list'
    }, {})
  })

  test('loadNextPage calls changeQuery', async () => {
    const { zustandState } = setup()

    await act(async () => {
      CollectionResultsBody.mock.calls[0][0].loadNextPage()
    })

    expect(zustandState.query.changeQuery).toHaveBeenCalledTimes(1)
    expect(zustandState.query.changeQuery).toHaveBeenCalledWith({
      collection: {
        pageNum: 2
      }
    })
  })
})
