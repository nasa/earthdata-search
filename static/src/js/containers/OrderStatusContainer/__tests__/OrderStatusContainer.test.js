import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, OrderStatusContainer } from '../OrderStatusContainer'
import OrderStatus from '../../../components/OrderStatus/OrderStatus'
import * as metricsActions from '../../../middleware/metrics/actions'

Enzyme.configure({ adapter: new Adapter() })

function setup(props) {
  const enzymeWrapper = shallow(<OrderStatusContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onFetchRetrieval calls actions.fetchRetrieval', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchRetrieval')

    mapDispatchToProps(dispatch).onFetchRetrieval('retrievalId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('retrievalId')
  })

  test('onFetchRetrievalCollection calls actions.fetchRetrievalCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchRetrievalCollection')

    mapDispatchToProps(dispatch).onFetchRetrievalCollection('retrievalCollectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('retrievalCollectionId')
  })

  test('onFetchRetrievalCollectionGranuleLinks calls actions.fetchRetrievalCollectionGranuleLinks', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchRetrievalCollectionGranuleLinks')

    mapDispatchToProps(dispatch).onFetchRetrievalCollectionGranuleLinks({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onFetchRetrievalCollectionGranuleBrowseLinks calls actions.fetchRetrievalCollectionGranuleBrowseLinks', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchRetrievalCollectionGranuleBrowseLinks')

    mapDispatchToProps(dispatch).onFetchRetrievalCollectionGranuleBrowseLinks({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onFocusedCollectionChange calls actions.changeFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedCollection')

    mapDispatchToProps(dispatch).onFocusedCollectionChange('mock-id')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('mock-id')
  })

  test('onMetricsRelatedCollection calls metricsRelatedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsActions, 'metricsRelatedCollection')

    mapDispatchToProps(dispatch).onMetricsRelatedCollection({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })

  test('onToggleAboutCSDAModal calls actions.onToggleAboutCSDAModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCSDAModal')

    mapDispatchToProps(dispatch).onToggleAboutCSDAModal(true)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(true)
  })

  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('path')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      authToken: 'mock-token',
      earthdataEnvironment: 'prod',
      granuleDownload: {},
      portal: {
        portalId: 'edsc'
      },
      retrieval: {}
    }

    const expectedState = {
      authToken: 'mock-token',
      earthdataEnvironment: 'prod',
      granuleDownload: {},
      portal: {
        portalId: 'edsc'
      },
      retrieval: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('OrderStatusContainer component', () => {
  describe('when passed the correct props', () => {
    test('passes its props and renders a single OrderStatus component', () => {
      const { enzymeWrapper, props } = setup({
        authToken: 'testToken',
        earthdataEnvironment: 'prod',
        granuleDownload: {},
        match: {
          search: {
            id: 7
          }
        },
        portal: {},
        onChangePath: jest.fn(),
        onFetchRetrieval: jest.fn(),
        onFetchRetrievalCollection: jest.fn(),
        onFetchRetrievalCollectionGranuleLinks: jest.fn(),
        onFetchRetrievalCollectionGranuleBrowseLinks: jest.fn(),
        onFocusedCollectionChange: jest.fn(),
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
        },
        location: {
          search: ''
        }
      })

      expect(enzymeWrapper.find(OrderStatus).length).toBe(1)
      expect(enzymeWrapper.find(OrderStatus).props().authToken).toEqual(props.authToken)
      expect(enzymeWrapper.find(OrderStatus).props().onFetchRetrieval)
        .toEqual(props.onFetchRetrieval)
      expect(enzymeWrapper.find(OrderStatus).props().onFetchRetrievalCollection)
        .toEqual(props.onFetchRetrievalCollection)
      expect(enzymeWrapper.find(OrderStatus).props().onChangePath).toEqual(props.onChangePath)
      expect(enzymeWrapper.find(OrderStatus).props().retrieval).toEqual(props.retrieval)
    })
  })
})
