import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

import Spinner from '../../Spinner/Spinner'

import SubscriptionsList from '../SubscriptionsList'
import SubscriptionsListTable from '../SubscriptionsListTable'

jest.mock('../../Spinner/Spinner', () => jest.fn(() => <div />))
jest.mock('../SubscriptionsListTable', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SubscriptionsList,
  defaultProps: {
    subscriptions: {
      byId: {},
      isLoading: false,
      isLoaded: false,
      error: null,
      timerStart: null,
      loadTime: null
    },
    onDeleteSubscription: jest.fn()
  }
})

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('SubscriptionsList component', () => {
  describe('when passed the correct props', () => {
    test('renders a spinner when retrievals are loading', () => {
      setup({
        overrideProps: {
          subscriptions: {
            byId: {},
            isLoading: true,
            isLoaded: false,
            error: null,
            timerStart: null,
            loadTime: null
          }
        }
      })

      expect(Spinner).toHaveBeenCalledTimes(1)
    })

    test('renders a SubscriptionsListTable when subscriptions exist', () => {
      const subscriptionsById = {
        'SUB100000-EDSC': {
          collection: {
            conceptId: 'C100000-EDSC',
            title: 'Mattis Justo Vulputate Ullamcorper Amet.'
          },
          collectionConceptId: 'C100000-EDSC',
          conceptId: 'SUB100000-EDSC',
          name: 'Test Granule Subscription',
          query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78',
          type: 'granule'
        },
        'SUB100001-EDSC': {
          collection: null,
          collectionConceptId: null,
          conceptId: 'SUB100001-EDSC',
          name: 'Test Collection Subscription',
          query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78',
          type: 'collection'
        }
      }

      setup({
        overrideProps: {
          subscriptions: {
            byId: subscriptionsById,
            isLoading: false,
            isLoaded: true,
            error: null,
            timerStart: null,
            loadTime: 1265
          },
          onDeleteSubscription: jest.fn()
        }
      })

      expect(SubscriptionsListTable).toHaveBeenCalledTimes(2)
      expect(SubscriptionsListTable).toHaveBeenNthCalledWith(1, {
        subscriptionsMetadata: [subscriptionsById['SUB100001-EDSC']],
        subscriptionType: 'collection',
        onDeleteSubscription: expect.any(Function)
      }, {})

      expect(SubscriptionsListTable).toHaveBeenNthCalledWith(2, {
        subscriptionsMetadata: [subscriptionsById['SUB100000-EDSC']],
        subscriptionType: 'granule',
        onDeleteSubscription: expect.any(Function)
      }, {})
    })
  })
})
