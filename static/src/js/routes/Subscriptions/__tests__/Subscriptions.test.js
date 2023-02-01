import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Helmet from 'react-helmet'

import * as AppConfig from '../../../../../../sharedUtils/config'

import Subscriptions from '../Subscriptions'
import SubscriptionsListContainer from '../../../containers/SubscriptionsListContainer/SubscriptionsListContainer'

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

function setup() {
  const enzymeWrapper = shallow(<Subscriptions.WrappedComponent />)

  return {
    enzymeWrapper
  }
}

describe('Subscriptions component', () => {
  test('sets the correct Helmet meta information', () => {
    const { enzymeWrapper } = setup()

    const helmet = enzymeWrapper.find(Helmet)
    expect(helmet.childAt(0).type()).toEqual('title')
    expect(helmet.childAt(0).text()).toEqual('Subscriptions')
    expect(helmet.childAt(1).props().name).toEqual('title')
    expect(helmet.childAt(1).props().content).toEqual('Subscriptions')
    expect(helmet.childAt(2).props().name).toEqual('robots')
    expect(helmet.childAt(2).props().content).toEqual('noindex, nofollow')
    expect(helmet.childAt(3).props().rel).toEqual('canonical')
    expect(helmet.childAt(3).props().href).toEqual('https://search.earthdata.nasa.gov')
  })

  test('displays the subscription list', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(SubscriptionsListContainer).length).toBe(1)
  })
})
