import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, PreferencesContainer } from '../PreferencesContainer'
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

describe('mapDispatchToProps', () => {
  test('onUpdatePreferences calls actions.updatePreferences', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updatePreferences')

    mapDispatchToProps(dispatch).onUpdatePreferences({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      preferences: {}
    }

    const expectedState = {
      preferences: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

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
