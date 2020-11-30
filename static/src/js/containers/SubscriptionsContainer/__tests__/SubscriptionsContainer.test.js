import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SubscriptionsContainer } from '../SubscriptionsContainer'
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
    onFetchSubscriptions: jest.fn()
  }

  const enzymeWrapper = shallow(<SubscriptionsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SubscriptionsContainer component', () => {
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
