import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

import Spinner from '../../Spinner/Spinner'

import { SubscriptionsList } from '../SubscriptionsList'
import { SubscriptionsListTable } from '../SubscriptionsListTable'

Enzyme.configure({ adapter: new Adapter() })

function setup(props) {
  const enzymeWrapper = shallow(<SubscriptionsList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('SubscriptionsList component', () => {
  describe('when passed the correct props', () => {
    test('renders a spinner when retrievals are loading', () => {
      const { enzymeWrapper } = setup({
        subscriptions: {
          byId: {},
          isLoading: true,
          isLoaded: false,
          error: null,
          timerStart: Date.now(),
          loadTime: null
        },
        onDeleteSubscription: jest.fn(),
        onFocusedCollectionChange: jest.fn()
      })

      expect(enzymeWrapper.find(Spinner).length).toBe(1)
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

      const { enzymeWrapper } = setup({
        subscriptions: {
          byId: subscriptionsById,
          isLoading: false,
          isLoaded: true,
          error: null,
          timerStart: null,
          loadTime: 1265
        },
        onDeleteSubscription: jest.fn(),
        onFocusedCollectionChange: jest.fn()
      })

      const tables = enzymeWrapper.find(SubscriptionsListTable)
      expect(tables.length).toBe(2)

      expect(tables.at(0).props().subscriptionType).toEqual('collection')
      expect(tables.at(0).props().subscriptionsMetadata).toEqual([subscriptionsById['SUB100001-EDSC']])

      expect(tables.at(1).props().subscriptionType).toEqual('granule')
      expect(tables.at(1).props().subscriptionsMetadata).toEqual([subscriptionsById['SUB100000-EDSC']])
    })
  })
})
