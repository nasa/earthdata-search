import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  SecondaryToolbarContainer
} from '../SecondaryToolbarContainer'
import SecondaryToolbar from '../../../components/SecondaryToolbar/SecondaryToolbar'

beforeEach(() => {
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    disableDatabaseComponents: 'false'
  }))
})

jest.mock('../../../components/SecondaryToolbar/SecondaryToolbar', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: SecondaryToolbarContainer,
  defaultProps: {
    authToken: 'mock-token',
    retrieval: {},
    onLogout: jest.fn(),
    ursProfile: {}
  },
  withRouter: true
})

describe('mapDispatchToProps', () => {
  test('onLogout calls actions.logout', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'logout')

    mapDispatchToProps(dispatch).onLogout()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      authToken: 'mock-token',
      contactInfo: {
        ursProfile: {}
      },
      retrieval: {}
    }

    const expectedState = {
      authToken: 'mock-token',
      retrieval: {},
      ursProfile: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SecondaryToolbarContainer component', () => {
  test('passes its props and renders a single SearchForm component', async () => {
    setup()

    expect(SecondaryToolbar).toHaveBeenCalledTimes(1)
    expect(SecondaryToolbar).toHaveBeenCalledWith({
      authToken: 'mock-token',
      location: {
        hash: '',
        key: 'default',
        pathname: '/',
        search: '',
        state: null
      },
      onLogout: expect.any(Function),
      projectCollectionIds: [],
      retrieval: {},
      ursProfile: {}
    }, {})
  })
})

describe('if the secondaryToolbar should be disabled', () => {
  test('passes the `secondaryToolbarEnabled` prop and to the Secondary toolbar as false', () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      disableDatabaseComponents: 'true'
    }))

    setup()

    expect(SecondaryToolbar).toHaveBeenCalledTimes(0)
  })
})
