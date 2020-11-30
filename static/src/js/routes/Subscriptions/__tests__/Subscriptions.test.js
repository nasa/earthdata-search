import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Subscriptions from '../Subscriptions'
import AppLogoContainer from '../../../containers/AppLogoContainer/AppLogoContainer'
import SubscriptionsContainer from '../../../containers/SubscriptionsContainer/SubscriptionsContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const enzymeWrapper = shallow(<Subscriptions.WrappedComponent />)

  return {
    enzymeWrapper
  }
}

describe('Subscriptions component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  test('displays a header', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AppLogoContainer).length).toBe(1)
  })

  test('displays the subscription list', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(SubscriptionsContainer).length).toBe(1)
  })
})
