import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import {
  ContactInfoContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../ContactInfoContainer'
import ContactInfo from '../../../components/ContactInfo/ContactInfo'

jest.mock('../../../components/ContactInfo/ContactInfo', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: ContactInfoContainer,
  defaultProps: {
    contactInfo: {
      cmrPreferences: { mock: 'cmr' },
      ursProfile: { mock: 'urs' }
    },
    earthdataEnvironment: 'prod',
    onFetchContactInfo: jest.fn(),
    onUpdateNotificationLevel: jest.fn()
  }
})

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
    setup()

    expect(ContactInfo).toHaveBeenCalledTimes(1)
    expect(ContactInfo).toHaveBeenCalledWith({
      contactInfo: {
        cmrPreferences: { mock: 'cmr' },
        ursProfile: { mock: 'urs' }
      },
      earthdataEnvironment: 'prod',
      onUpdateNotificationLevel: expect.any(Function)
    }, {})
  })
})
