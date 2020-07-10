import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { PreferencesContainer } from '../PreferencesContainer'
import Preferences from '../../../components/Preferences/Preferences'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    preferences: {
      panelState: 'default'
    },
    onUpdatePreferences: jest.fn()
  }

  const enzymeWrapper = shallow(<PreferencesContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('PreferencesContainer component', () => {
  test('passes its props and renders Preferences component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Preferences).length).toBe(1)
    expect(enzymeWrapper.find(Preferences).props().preferences).toEqual({
      panelState: 'default'
    })
    expect(typeof enzymeWrapper.find(Preferences).props().onUpdatePreferences).toEqual('function')
  })
})
