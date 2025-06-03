import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  PreferencesContainer
} from '../PreferencesContainer'
import Preferences from '../../../components/Preferences/Preferences'

jest.mock('../../../components/Preferences/Preferences', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: PreferencesContainer,
  defaultProps: {
    preferences: {
      panelState: 'default'
    },
    onUpdatePreferences: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onUpdatePreferences calls actions.updatePreferences', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updatePreferences')

    mapDispatchToProps(dispatch).onUpdatePreferences({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
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
    setup()

    expect(Preferences).toHaveBeenCalledTimes(1)
    expect(Preferences).toHaveBeenCalledWith(
      expect.objectContaining({
        preferences: {
          panelState: 'default'
        },
        onUpdatePreferences: expect.any(Function)
      }),
      {}
    )
  })
})
