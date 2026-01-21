import React from 'react'
import { waitFor } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

import Spinner from '../../Spinner/Spinner'

import SubscriptionsList from '../SubscriptionsList'
import SubscriptionsListTable from '../SubscriptionsListTable'
import SUBSCRIPTIONS from '../../../operations/queries/subscriptions'

vi.mock('../../Spinner/Spinner', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../SubscriptionsListTable', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: SubscriptionsList,
  defaultZustandState: {
    user: {
      username: 'testuser'
    }
  },
  defaultApolloClientMocks: [{
    request: {
      query: SUBSCRIPTIONS,
      variables: {
        params: {
          subscriberId: 'testuser'
        }
      }
    },
    result: {
      data: {
        subscriptions: {
          items: []
        }
      }
    }
  }],
  withApolloClient: true
})

beforeEach(() => {
  vi.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('SubscriptionsList component', () => {
  describe('when passed the correct props', () => {
    test('renders a spinner when retrievals are loading', () => {
      setup()

      expect(Spinner).toHaveBeenCalledTimes(1)
    })

    test('renders a SubscriptionsListTable when subscriptions exist', async () => {
      const subscriptionsById = {
        'SUB100000-EDSC': {
          collection: {
            conceptId: 'C100000-EDSC',
            title: 'Mattis Justo Vulputate Ullamcorper Amet.'
          },
          collectionConceptId: 'C100000-EDSC',
          conceptId: 'SUB100000-EDSC',
          creationDate: '2023-10-10T12:00:00.000Z',
          name: 'Test Granule Subscription',
          nativeId: 'native-sub-100000',
          query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78',
          revisionDate: '2023-10-10T12:00:00.000Z',
          type: 'granule'
        },
        'SUB100001-EDSC': {
          collection: null,
          collectionConceptId: null,
          conceptId: 'SUB100001-EDSC',
          creationDate: '2023-10-10T12:00:00.000Z',
          name: 'Test Collection Subscription',
          nativeId: 'native-sub-100001',
          query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78',
          revisionDate: '2023-10-10T12:00:00.000Z',
          type: 'collection'
        }
      }

      setup({
        overrideApolloClientMocks: [{
          request: {
            query: SUBSCRIPTIONS,
            variables: {
              params: {
                subscriberId: 'testuser'
              }
            }
          },
          result: {
            data: {
              subscriptions: {
                items: Object.values(subscriptionsById)
              }
            }
          }
        }]
      })

      await waitFor(() => {
        expect(SubscriptionsListTable).toHaveBeenCalledTimes(2)
      })

      expect(SubscriptionsListTable).toHaveBeenNthCalledWith(1, {
        subscriptionsMetadata: [subscriptionsById['SUB100001-EDSC']],
        subscriptionType: 'collection'
      }, {})

      expect(SubscriptionsListTable).toHaveBeenNthCalledWith(2, {
        subscriptionsMetadata: [subscriptionsById['SUB100000-EDSC']],
        subscriptionType: 'granule'
      }, {})
    })
  })
})
