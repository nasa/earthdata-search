import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import ContactInfo from '../ContactInfo'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    contactInfo: {
      echoPreferences: { mock: 'echo' },
      ursProfile: { mock: 'urs' }
    },
    earthdataEnvironment: 'prod',
    onUpdateNotificationLevel: jest.fn()
  }

  const enzymeWrapper = shallow(<ContactInfo {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ContactInfo component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  test('changing the notification level should set the state', () => {
    const { enzymeWrapper } = setup()
    const notificationLevel = enzymeWrapper.find('#notificationLevel')

    notificationLevel.simulate('change', {
      target: {
        value: 'INFO'
      }
    })
    expect(enzymeWrapper.state()).toEqual({ notificationLevel: 'INFO' })
  })

  test('clicking the Update Notification Preference button should call onUpdateNotificationLevel', () => {
    const { enzymeWrapper, props } = setup()

    const button = enzymeWrapper.find('.contact-info-form__update-notification-level')
    button.simulate('click')

    expect(props.onUpdateNotificationLevel).toBeCalledTimes(1)
    expect(props.onUpdateNotificationLevel).toBeCalledWith('VERBOSE')
  })
})
