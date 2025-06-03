import React from 'react'

import { waitFor } from '@testing-library/react'
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
    earthdataEnvironment: 'prod',
    projectCollectionIds: [],
    savedProject: {},
    retrieval: {},
    onLogout: jest.fn(),
    onUpdateProjectName: jest.fn(),
    onFetchContactInfo: jest.fn(),
    ursProfile: {},
    onStartTour: jest.fn()
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
      project: {
        collections: {
          allIds: []
        }
      },
      savedProject: {},
      retrieval: {}
    }

    const expectedState = {
      authToken: 'mock-token',
      earthdataEnvironment: 'prod',
      projectCollectionIds: [],
      savedProject: {},
      retrieval: {},
      ursProfile: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SecondaryToolbarContainer component', () => {
  test('passes its props and renders a single SearchForm component', async () => {
    const { props } = setup()

    await waitFor(() => {
      expect(props.onFetchContactInfo).toHaveBeenCalledTimes(1)
    })

    expect(props.onFetchContactInfo).toHaveBeenCalledWith()

    expect(SecondaryToolbar).toHaveBeenCalledTimes(1)
    expect(SecondaryToolbar).toHaveBeenCalledWith({
      authToken: 'mock-token',
      earthdataEnvironment: 'prod',
      location: {
        pathname: '/',
        search: ''
      },
      onLogout: expect.any(Function),
      onUpdateProjectName: expect.any(Function),
      projectCollectionIds: [],
      retrieval: {},
      savedProject: {},
      ursProfile: {}
    }, {})
  })
})

describe('if the secondaryToolbar should be disabled', () => {
  test('passes the `secondaryToolbarEnabled` prop and to the Secondary toolbar as false', () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      disableDatabaseComponents: 'true'
    }))

    const { props } = setup()

    expect(props.onFetchContactInfo).toHaveBeenCalledTimes(0)
    expect(SecondaryToolbar).toHaveBeenCalledTimes(0)
  })
})
