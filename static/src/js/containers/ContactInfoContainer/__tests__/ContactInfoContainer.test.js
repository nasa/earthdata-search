import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { ContactInfoContainer, mapDispatchToProps, mapStateToProps } from '../ContactInfoContainer'
import ContactInfo from '../../../components/ContactInfo/ContactInfo'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    contactInfo: {
      echoPreferences: { mock: 'echo' },
      ursProfile: { mock: 'urs' }
    },
    earthdataEnvironment: 'prod',
    onFetchContactInfo: jest.fn(),
    onUpdateNotificationLevel: jest.fn()
  }

  const enzymeWrapper = shallow(<ContactInfoContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onFetchContactInfo calls actions.fetchContactInfo', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchContactInfo')

    mapDispatchToProps(dispatch).onFetchContactInfo()

    expect(spy).toBeCalledTimes(1)
  })

  test('onUpdateNotificationLevel calls actions.updateNotificationLevel', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateNotificationLevel')

    mapDispatchToProps(dispatch).onUpdateNotificationLevel('level')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('level')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      contactInfo: {},
      earthdataEnvironment: 'prod'
    }

    const expectedState = {
      contactInfo: {},
      earthdataEnvironment: 'prod'
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('ContactInfoContainer component', () => {
  test('passes its props and renders ContactInfo component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(ContactInfo).length).toBe(1)
    expect(enzymeWrapper.find(ContactInfo).props().contactInfo).toEqual({
      echoPreferences: { mock: 'echo' },
      ursProfile: { mock: 'urs' }
    })
    expect(typeof enzymeWrapper.find(ContactInfo).props().onUpdateNotificationLevel).toEqual('function')
  })
})
