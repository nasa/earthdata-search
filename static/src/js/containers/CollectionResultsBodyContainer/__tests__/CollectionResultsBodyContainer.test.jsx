import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'

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
    onAddProjectCollection: jest.fn(),
    onMetricsAddCollectionProject: jest.fn(),
    onRemoveCollectionFromProject: jest.fn(),
    onChangeCollectionPageNum: jest.fn(),
    onViewCollectionGranules: jest.fn(),
    onViewCollectionDetails: jest.fn(),
    panelView: 'list',
    query: {
      pageNum: 1
    }
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

  test('onViewCollectionGranules calls actions.viewCollectionGranules', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'viewCollectionGranules')

    mapDispatchToProps(dispatch).onViewCollectionGranules('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
  })

  test('onViewCollectionDetails calls actions.viewCollectionDetails', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'viewCollectionDetails')

    mapDispatchToProps(dispatch).onViewCollectionDetails('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
  })

  test('onChangeCollectionPageNum calls actions.changeCollectionPageNum', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeCollectionPageNum')

    mapDispatchToProps(dispatch).onChangeCollectionPageNum({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
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
      metadata: {
        collections: {}
      },
      query: {
        collection: {}
      },
      searchResults: {
        collections: {}
      }
    }

    const expectedState = {
      collectionsSearch: {},
      collectionsMetadata: {},
      projectCollectionsIds: [],
      query: {}
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
      onAddProjectCollection: expect.any(Function),
      onMetricsAddCollectionProject: expect.any(Function),
      onRemoveCollectionFromProject: expect.any(Function),
      onViewCollectionDetails: expect.any(Function),
      onViewCollectionGranules: expect.any(Function),
      panelView: 'list',
      projectCollectionsIds: []
    }, {})
  })

  test('loadNextPage calls onChangeCollectionPageNum', () => {
    const { props } = setup()

    CollectionResultsBody.mock.calls[0][0].loadNextPage()

    expect(props.onChangeCollectionPageNum).toHaveBeenCalledTimes(1)
    expect(props.onChangeCollectionPageNum).toHaveBeenCalledWith(2)
  })
})
