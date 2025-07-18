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

jest.mock('../../../components/SecondaryToolbar/SecondaryToolbar', () => jest.fn(() => <div />))

const locationObject = {
  pathname: '/search',
  search: '',
  hash: '',
  state: null,
  key: 'testKey'
}
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue(locationObject)
}))

const setup = setupTest({
  Component: SecondaryToolbarContainer,
  defaultProps: {
    authToken: '',
    earthdataEnvironment: 'prod',
    onFetchContactInfo: jest.fn(),
    onLogout: jest.fn(),
    onUpdateProjectName: jest.fn(),
    projectCollectionIds: [],
    retrieval: {},
    savedProject: {},
    ursProfile: {}
  }
})

beforeEach(() => {
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    disableDatabaseComponents: 'false'
  }))
})

describe('mapDispatchToProps', () => {
  test('onLogout calls actions.logout', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'logout')

    mapDispatchToProps(dispatch).onLogout()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
  })

  test('onUpdateProjectName calls actions.updateProjectName', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateProjectName')

    mapDispatchToProps(dispatch).onUpdateProjectName('name')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('name')
  })

  test('onFetchContactInfo calls actions.fetchContactInfo', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchContactInfo')

    mapDispatchToProps(dispatch).onFetchContactInfo()

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
      earthdataEnvironment: 'prod',
      savedProject: {},
      retrieval: {}
    }

    const expectedState = {
      authToken: 'mock-token',
      earthdataEnvironment: 'prod',
      savedProject: {},
      retrieval: {},
      ursProfile: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SecondaryToolbarContainer component', () => {
  test('passes its props and renders a single SearchForm component', () => {
    setup()

    expect(SecondaryToolbar).toHaveBeenCalledTimes(1)
    expect(SecondaryToolbar).toHaveBeenCalledWith({
      authToken: '',
      earthdataEnvironment: 'prod',
      location: locationObject,
      onLogout: expect.any(Function),
      onUpdateProjectName: expect.any(Function),
      projectCollectionIds: [],
      savedProject: {},
      retrieval: {},
      secondaryToolbarEnabled: true,
      ursProfile: {}
    }, {})
  })

  test('calls onFetchContactInfo if authToken is present and ursProfile is not', () => {
    const { props } = setup({
      overrideProps: {
        authToken: 'mock-token',
        ursProfile: {}
      }
    })

    expect(props.onFetchContactInfo).toHaveBeenCalledTimes(1)
    expect(props.onFetchContactInfo).toHaveBeenCalledWith()
  })
})

describe('if the secondaryToolbar should be disabled', () => {
  test('passes the `secondaryToolbarEnabled` prop and to the Secondary toolbar as false', () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      disableDatabaseComponents: 'true'
    }))

    setup()

    expect(SecondaryToolbar).toHaveBeenCalledTimes(1)
    expect(SecondaryToolbar).toHaveBeenCalledWith({
      authToken: '',
      earthdataEnvironment: 'prod',
      location: locationObject,
      onLogout: expect.any(Function),
      onUpdateProjectName: expect.any(Function),
      projectCollectionIds: [],
      savedProject: {},
      retrieval: {},
      secondaryToolbarEnabled: false,
      ursProfile: {}
    }, {})
  })
})
