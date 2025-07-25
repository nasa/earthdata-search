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
    onFetchContactInfo: jest.fn(),
    onUpdateNotificationLevel: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onFetchContactInfo calls actions.fetchContactInfo', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchContactInfo')

    mapDispatchToProps(dispatch).onFetchContactInfo()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
  })

  test('onUpdateNotificationLevel calls actions.updateNotificationLevel', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateNotificationLevel')

    mapDispatchToProps(dispatch).onUpdateNotificationLevel('level')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('level')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      contactInfo: {}
    }

    const expectedState = {
      contactInfo: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('ContactInfoContainer component', () => {
  test('passes its props and renders ContactInfo component', () => {
    const { props } = setup()

    expect(props.onFetchContactInfo).toHaveBeenCalledTimes(1)
    expect(props.onFetchContactInfo).toHaveBeenCalledWith()

    expect(ContactInfo).toHaveBeenCalledTimes(1)
    expect(ContactInfo).toHaveBeenCalledWith({
      contactInfo: {
        cmrPreferences: { mock: 'cmr' },
        ursProfile: { mock: 'urs' }
      },
      onUpdateNotificationLevel: expect.any(Function)
    }, {})
  })
})
