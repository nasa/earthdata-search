import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { SubscriptionsBodyContainer } from '../SubscriptionsBodyContainer'
import SubscriptionsBody from '../../../components/Subscriptions/SubscriptionsBody'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onCreateSubscription: jest.fn(),
    subscriptions: []
  }

  const enzymeWrapper = shallow(<SubscriptionsBodyContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SpatialSelectionContainer component', () => {
  test('passes its props and renders a single SpatialSelection component', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(SubscriptionsBody).length).toBe(1)
    expect(enzymeWrapper.find(SubscriptionsBody).props().onCreateSubscription).toEqual(props.onCreateSubscription)
    expect(enzymeWrapper.find(SubscriptionsBody).props().subscriptions).toEqual(props.subscriptions)
  })
})
