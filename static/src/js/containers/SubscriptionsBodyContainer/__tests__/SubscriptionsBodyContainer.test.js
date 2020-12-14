import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, SubscriptionsBodyContainer } from '../SubscriptionsBodyContainer'
import SubscriptionsBody from '../../../components/Subscriptions/SubscriptionsBody'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    granuleQueryString: 'mock-string',
    subscriptions: [],
    onCreateSubscription: jest.fn()
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
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      query: {
        collection: {}
      }
    }

    const expectedState = {
      granuleQueryString: 'options%5Bspatial%5D%5Bor%5D=true',
      subscriptions: []
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SpatialSelectionContainer component', () => {
  test('passes its props and renders a single SpatialSelection component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(SubscriptionsBody).length).toBe(1)
    expect(enzymeWrapper.find(SubscriptionsBody).props().granuleQueryString)
      .toEqual(props.granuleQueryString)
    expect(enzymeWrapper.find(SubscriptionsBody).props().subscriptions).toEqual(props.subscriptions)
    expect(enzymeWrapper.find(SubscriptionsBody).props().onCreateSubscription)
      .toEqual(props.onCreateSubscription)
  })
})
