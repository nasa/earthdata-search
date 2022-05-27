import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { withHooks } from 'jest-react-hooks-shallow'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, SubscriptionsBodyContainer } from '../SubscriptionsBodyContainer'
import SubscriptionsBody from '../../../components/Subscriptions/SubscriptionsBody'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collectionQueryString: 'collection-mock-string',
    collectionSubscriptions: [],
    granuleQueryString: 'granule-mock-string',
    granuleSubscriptions: [],
    subscriptionType: 'granule',
    onCreateSubscription: jest.fn(),
    onDeleteSubscription: jest.fn(),
    onFetchCollectionSubscriptions: jest.fn(),
    onUpdateSubscription: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<SubscriptionsBodyContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onCreateSubscription calls actions.createSubscription', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'createSubscription')

    mapDispatchToProps(dispatch).onCreateSubscription()

    expect(spy).toBeCalledTimes(1)
  })

  test('onCreateSubscription calls actions.updateSubscription', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateSubscription')

    mapDispatchToProps(dispatch).onUpdateSubscription()

    expect(spy).toBeCalledTimes(1)
  })

  test('onCreateSubscription calls actions.deleteSubscription', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'deleteSubscription')

    mapDispatchToProps(dispatch).onDeleteSubscription()

    expect(spy).toBeCalledTimes(1)
  })

  test('onFetchCollectionSubscriptions calls actions.getSubscriptions', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'getSubscriptions')

    mapDispatchToProps(dispatch).onFetchCollectionSubscriptions()

    expect(spy).toBeCalledTimes(1)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      query: {
        collection: {}
      },
      subscriptions: {}
    }

    const expectedState = {
      collectionQueryString: '',
      collectionSubscriptions: [],
      granuleQueryString: '',
      granuleSubscriptions: []
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SubscriptionsBodyContainer component', () => {
  test('passes its props and renders a single SubscriptionsBody component for granule subscriptions', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(SubscriptionsBody).length).toBe(1)
    expect(enzymeWrapper.find(SubscriptionsBody).props().queryString)
      .toEqual(props.granuleQueryString)
    expect(enzymeWrapper.find(SubscriptionsBody).props().subscriptions)
      .toEqual(props.granuleSubscriptions)
    expect(enzymeWrapper.find(SubscriptionsBody).props().onCreateSubscription)
      .toEqual(props.onCreateSubscription)
    expect(enzymeWrapper.find(SubscriptionsBody).props().onUpdateSubscription)
      .toEqual(props.onUpdateSubscription)
    expect(enzymeWrapper.find(SubscriptionsBody).props().onDeleteSubscription)
      .toEqual(props.onDeleteSubscription)
  })

  test('passes its props and renders a single SubscriptionsBody component for collection subscriptions', () => {
    withHooks(() => {
      const { enzymeWrapper, props } = setup({
        subscriptionType: 'collection'
      })

      expect(enzymeWrapper.find(SubscriptionsBody).length).toBe(1)
      expect(enzymeWrapper.find(SubscriptionsBody).props().queryString)
        .toEqual(props.collectionQueryString)
      expect(enzymeWrapper.find(SubscriptionsBody).props().subscriptions)
        .toEqual(props.collectionSubscriptions)
      expect(enzymeWrapper.find(SubscriptionsBody).props().onCreateSubscription)
        .toEqual(props.onCreateSubscription)
      expect(enzymeWrapper.find(SubscriptionsBody).props().onUpdateSubscription)
        .toEqual(props.onUpdateSubscription)
      expect(enzymeWrapper.find(SubscriptionsBody).props().onDeleteSubscription)
        .toEqual(props.onDeleteSubscription)

      expect(props.onFetchCollectionSubscriptions).toHaveBeenCalledTimes(1)
    })
  })
})
