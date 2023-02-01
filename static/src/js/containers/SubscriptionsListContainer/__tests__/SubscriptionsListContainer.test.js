import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, SubscriptionsListContainer } from '../SubscriptionsListContainer'
import SubscriptionsList from '../../../components/SubscriptionsList/SubscriptionsList'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
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
    onFetchSubscriptions: jest.fn(),
    onFocusedCollectionChange: jest.fn()
  }

  const enzymeWrapper = shallow(<SubscriptionsListContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onDeleteSubscription calls actions.deleteSubscription', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'deleteSubscription')

    mapDispatchToProps(dispatch).onDeleteSubscription('conceptId', 'nativeId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('conceptId', 'nativeId')
  })

  test('onFocusedCollectionChange calls actions.changeFocusedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFocusedCollection')

    mapDispatchToProps(dispatch).onFocusedCollectionChange('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onFetchSubscriptions calls actions.getSubscriptions', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'getSubscriptions')

    mapDispatchToProps(dispatch).onFetchSubscriptions()

    expect(spy).toBeCalledTimes(1)
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
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(SubscriptionsList).length).toBe(1)
    expect(enzymeWrapper.find(SubscriptionsList).props().subscriptions).toEqual({
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
    })
    expect(typeof props.onFetchSubscriptions).toEqual('function')
  })
})
