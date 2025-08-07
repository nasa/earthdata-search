import React from 'react'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  SubscriptionsBodyContainer
} from '../SubscriptionsBodyContainer'
import SubscriptionsBody from '../../../components/Subscriptions/SubscriptionsBody'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/Subscriptions/SubscriptionsBody', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SubscriptionsBodyContainer,
  defaultProps: {
    collectionSubscriptions: [],
    collectionSubscriptionDisabledFields: {},
    granuleSubscriptions: [],
    granuleSubscriptionDisabledFields: {},
    subscriptionType: 'granule',
    onCreateSubscription: jest.fn(),
    onDeleteSubscription: jest.fn(),
    onFetchCollectionSubscriptions: jest.fn(),
    onToggleEditSubscriptionModal: jest.fn(),
    onUpdateSubscription: jest.fn(),
    onUpdateSubscriptionDisabledFields: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onCreateSubscription calls actions.createSubscription', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'createSubscription')

    mapDispatchToProps(dispatch).onCreateSubscription()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onUpdateSubscription calls actions.updateSubscription', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateSubscription')

    mapDispatchToProps(dispatch).onUpdateSubscription({
      subscription: {},
      shouldUpdateQuery: false
    })

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onDeleteSubscription calls actions.deleteSubscription', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'deleteSubscription')

    mapDispatchToProps(dispatch).onDeleteSubscription()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onFetchCollectionSubscriptions calls actions.getSubscriptions', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'getSubscriptions')

    mapDispatchToProps(dispatch).onFetchCollectionSubscriptions()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onUpdateSubscriptionDisabledFields calls actions.updateSubscriptionDisabledFields', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateSubscriptionDisabledFields')

    mapDispatchToProps(dispatch).onUpdateSubscriptionDisabledFields()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onToggleEditSubscriptionModal calls actions.updateSubscriptionDisabledFields', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleEditSubscriptionModal')

    mapDispatchToProps(dispatch).onToggleEditSubscriptionModal()

    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      subscriptions: {
        disabledFields: {
          collection: {},
          granule: {}
        }
      }
    }

    const expectedState = {
      collectionSubscriptions: [],
      collectionSubscriptionDisabledFields: {},
      granuleSubscriptions: [],
      granuleSubscriptionDisabledFields: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SubscriptionsBodyContainer component', () => {
  test('passes its props and renders a single SubscriptionsBody component for granule subscriptions', () => {
    setup()

    expect(SubscriptionsBody).toHaveBeenCalledTimes(1)
    expect(SubscriptionsBody).toHaveBeenCalledWith({
      disabledFields: {},
      onCreateSubscription: expect.any(Function),
      onDeleteSubscription: expect.any(Function),
      onToggleEditSubscriptionModal: expect.any(Function),
      onUpdateSubscription: expect.any(Function),
      onUpdateSubscriptionDisabledFields: expect.any(Function),
      query: {},
      subscriptionType: 'granule',
      subscriptions: []
    }, {})
  })

  test('passes its props and renders a single SubscriptionsBody component for collection subscriptions', () => {
    const { props } = setup({
      overrideProps: {
        subscriptionType: 'collection'
      }
    })

    expect(SubscriptionsBody).toHaveBeenCalledTimes(1)
    expect(SubscriptionsBody).toHaveBeenCalledWith({
      disabledFields: {},
      onCreateSubscription: expect.any(Function),
      onDeleteSubscription: expect.any(Function),
      onToggleEditSubscriptionModal: expect.any(Function),
      onUpdateSubscription: expect.any(Function),
      onUpdateSubscriptionDisabledFields: expect.any(Function),
      query: {
        consortium: [],
        hasGranulesOrCwic: true,
        serviceType: [],
        tagKey: []
      },
      subscriptionType: 'collection',
      subscriptions: []
    }, {})

    expect(props.onFetchCollectionSubscriptions).toHaveBeenCalledTimes(1)
  })
})
