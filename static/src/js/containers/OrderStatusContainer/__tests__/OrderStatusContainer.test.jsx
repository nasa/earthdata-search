import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  OrderStatusContainer
} from '../OrderStatusContainer'
import OrderStatus from '../../../components/OrderStatus/OrderStatus'
import * as metricsActions from '../../../middleware/metrics/actions'

jest.mock('../../../components/OrderStatus/OrderStatus', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: OrderStatusContainer,
  defaultProps: {
    authToken: 'testToken',
    granuleDownload: {},
    onChangePath: jest.fn(),
    onFetchRetrieval: jest.fn(),
    onFetchRetrievalCollection: jest.fn(),
    onFetchRetrievalCollectionGranuleLinks: jest.fn(),
    onFetchRetrievalCollectionGranuleBrowseLinks: jest.fn(),
    onMetricsRelatedCollection: jest.fn(),
    onToggleAboutCSDAModal: jest.fn(),
    retrieval: {
      id: 7,
      collections: {
        download: [
          {
            collection_id: 'TEST_COLLECTION_111'
          }
        ],
        echoOrder: [],
        order: []
      }
    }
  }
})

describe('mapDispatchToProps', () => {
  test('onFetchRetrieval calls actions.fetchRetrieval', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchRetrieval')

    mapDispatchToProps(dispatch).onFetchRetrieval('retrievalId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('retrievalId')
  })

  test('onFetchRetrievalCollection calls actions.fetchRetrievalCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchRetrievalCollection')

    mapDispatchToProps(dispatch).onFetchRetrievalCollection('retrievalCollectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('retrievalCollectionId')
  })

  test('onFetchRetrievalCollectionGranuleLinks calls actions.fetchRetrievalCollectionGranuleLinks', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchRetrievalCollectionGranuleLinks')

    mapDispatchToProps(dispatch).onFetchRetrievalCollectionGranuleLinks({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onFetchRetrievalCollectionGranuleBrowseLinks calls actions.fetchRetrievalCollectionGranuleBrowseLinks', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchRetrievalCollectionGranuleBrowseLinks')

    mapDispatchToProps(dispatch).onFetchRetrievalCollectionGranuleBrowseLinks({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onMetricsRelatedCollection calls metricsRelatedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsActions, 'metricsRelatedCollection')

    mapDispatchToProps(dispatch).onMetricsRelatedCollection({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

  test('onToggleAboutCSDAModal calls actions.onToggleAboutCSDAModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCSDAModal')

    mapDispatchToProps(dispatch).onToggleAboutCSDAModal(true)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(true)
  })

  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('path')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      authToken: 'mock-token',
      granuleDownload: {},
      retrieval: {}
    }

    const expectedState = {
      authToken: 'mock-token',
      granuleDownload: {},
      retrieval: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('OrderStatusContainer component', () => {
  describe('when passed the correct props', () => {
    test('passes its props and renders a single OrderStatus component', () => {
      setup()

      expect(OrderStatus).toHaveBeenCalledTimes(1)
      expect(OrderStatus).toHaveBeenCalledWith(
        {
          authToken: 'testToken',
          granuleDownload: {},
          onChangePath: expect.any(Function),
          onFetchRetrieval: expect.any(Function),
          onFetchRetrievalCollection: expect.any(Function),
          onFetchRetrievalCollectionGranuleLinks: expect.any(Function),
          onFetchRetrievalCollectionGranuleBrowseLinks: expect.any(Function),
          onMetricsRelatedCollection: expect.any(Function),
          onToggleAboutCSDAModal: expect.any(Function),
          retrieval: {
            id: 7,
            collections: {
              download: [
                {
                  collection_id: 'TEST_COLLECTION_111'
                }
              ],
              echoOrder: [],
              order: []
            }
          }
        },
        {}
      )
    })
  })
})
