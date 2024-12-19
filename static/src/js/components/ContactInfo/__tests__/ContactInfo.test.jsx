import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Spinner from '../../Spinner/Spinner'

import ContactInfo from '../ContactInfo'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    contactInfo: {
      cmrPreferences: { mock: 'cmr' },
      ursProfile: { mock: 'urs' }
    },
    earthdataEnvironment: 'prod',
    onUpdateNotificationLevel: jest.fn(),
    ...overrideProps
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

  test('should render contact info form correctly before preferences are retrieved', () => {
    const { enzymeWrapper } = setup({
      contactInfo: {
        ursProfile: { mock: 'urs' }
      }
    })

    const spinner = enzymeWrapper.find(Spinner)
    expect(spinner.prop('size')).toEqual('x-tiny')
    expect(spinner.prop('inline')).toEqual(true)
    expect(spinner.length).toEqual(1)
    expect(enzymeWrapper.state()).toEqual({ notificationLevel: 'VERBOSE' })
  })

  test('should render user notification level after preferences are retrieved', () => {
    const { enzymeWrapper } = setup({
      contactInfo: {
        ursProfile: { mock: 'urs' }
      }
    })

    let spinner = enzymeWrapper.find(Spinner)
    let notificationLevel = enzymeWrapper.find('#notificationLevel')

    expect(spinner.length).toEqual(1)
    expect(notificationLevel.exists()).toBeFalsy()
    expect(enzymeWrapper.state()).toEqual({ notificationLevel: 'VERBOSE' })

    enzymeWrapper.setProps({
      contactInfo: {
        cmrPreferences: { notificationLevel: 'INFO' }
      }
    })

    spinner = enzymeWrapper.find(Spinner)
    notificationLevel = enzymeWrapper.find('#notificationLevel')

    expect(spinner.length).toEqual(0)
    expect(notificationLevel.exists()).toBeTruthy()
    expect(enzymeWrapper.state()).toEqual({ notificationLevel: 'INFO' })
  })

  test('should not update user notification level if retrieved preferences are VERBOSE already', () => {
    const { enzymeWrapper } = setup({
      contactInfo: {
        ursProfile: { mock: 'urs' }
      }
    })
    expect(enzymeWrapper.exists()).toBeTruthy()

    let spinner = enzymeWrapper.find(Spinner)
    let notificationLevel = enzymeWrapper.find('#notificationLevel')

    expect(spinner.length).toEqual(1)
    expect(notificationLevel.exists()).toBeFalsy()
    expect(enzymeWrapper.state()).toEqual({ notificationLevel: 'VERBOSE' })

    enzymeWrapper.setProps({
      contactInfo: {
        cmrPreferences: { notificationLevel: 'VERBOSE' }
      }
    })

    spinner = enzymeWrapper.find(Spinner)
    notificationLevel = enzymeWrapper.find('#notificationLevel')

    expect(spinner.length).toEqual(0)
    expect(notificationLevel.exists()).toBeTruthy()
    expect(enzymeWrapper.state()).toEqual({ notificationLevel: 'VERBOSE' })
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
