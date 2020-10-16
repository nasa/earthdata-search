import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { ContactInfoContainer } from '../ContactInfoContainer'
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
