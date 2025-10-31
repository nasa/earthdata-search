import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import { mapStateToProps, SecondaryToolbarContainer } from '../SecondaryToolbarContainer'
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
    retrieval: {},
    onLogout: jest.fn()
  },
  withRouter: true
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      retrieval: {}
    }

    const expectedState = {
      retrieval: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SecondaryToolbarContainer component', () => {
  test('passes its props and renders a single SearchForm component', async () => {
    setup()

    expect(SecondaryToolbar).toHaveBeenCalledTimes(1)
    expect(SecondaryToolbar).toHaveBeenCalledWith({
      location: {
        hash: '',
        key: 'default',
        pathname: '/',
        search: '',
        state: null
      },
      projectCollectionIds: [],
      retrieval: {}
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
