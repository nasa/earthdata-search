import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  SubscriptionsListContainer
} from '../SubscriptionsListContainer'
import SubscriptionsList from '../../../components/SubscriptionsList/SubscriptionsList'

jest.mock('../../../components/SubscriptionsList/SubscriptionsList', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SubscriptionsListContainer,
  defaultProps: {
    subscriptions: {
      byId: {
        'SUB100000-EDSC': {
          collection: {
            conceptId: 'C100000-EDSC',
            title: 'Mattis Justo Vulputate Ullamcorper Amet.'
          },
          collectionConceptId: 'C100000-EDSC',
          conceptId: 'SUB100000-EDSC',
          name: 'Test Subscription',
          query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
        }
      },
      isLoading: false,
      isLoaded: true,
      error: null,
      timerStart: null,
      loadTime: 1265
    },
    onDeleteSubscription: jest.fn(),
    onFetchSubscriptions: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onDeleteSubscription calls actions.deleteSubscription', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'deleteSubscription')

    mapDispatchToProps(dispatch).onDeleteSubscription('conceptId', 'nativeId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('conceptId', 'nativeId')
  })

  test('onFetchSubscriptions calls actions.getSubscriptions', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'getSubscriptions')

    mapDispatchToProps(dispatch).onFetchSubscriptions()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      subscriptions: {}
    }

    const expectedState = {
      subscriptions: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SubscriptionsListContainer component', () => {
  test('passes its props and renders SubscriptionsList component', () => {
    const { props } = setup()

    expect(props.onFetchSubscriptions).toHaveBeenCalledTimes(1)
    expect(props.onFetchSubscriptions).toHaveBeenCalledWith()

    expect(SubscriptionsList).toHaveBeenCalledTimes(1)
    expect(SubscriptionsList).toHaveBeenCalledWith(
      {
        subscriptions: {
          byId: {
            'SUB100000-EDSC': {
              collection: {
                conceptId: 'C100000-EDSC',
                title: 'Mattis Justo Vulputate Ullamcorper Amet.'
              },
              collectionConceptId: 'C100000-EDSC',
              conceptId: 'SUB100000-EDSC',
              name: 'Test Subscription',
              query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
            }
          },
          isLoading: false,
          isLoaded: true,
          error: null,
          timerStart: null,
          loadTime: 1265
        },
        onDeleteSubscription: expect.any(Function)
      },
      {}
    )
  })
})
