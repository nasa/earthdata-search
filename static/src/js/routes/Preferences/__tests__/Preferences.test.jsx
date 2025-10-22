import React from 'react'
import Helmet from 'react-helmet'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { mapDispatchToProps, Preferences } from '../Preferences'
import * as AppConfig from '../../../../../../sharedUtils/config'
import PreferencesForm from '../../../components/Preferences/PreferencesForm'

import actions from '../../../actions'

jest.mock('../../../components/Preferences/PreferencesForm', () => jest.fn(() => <div />))

beforeEach(() => {
  jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

const setup = setupTest({
  Component: Preferences,
  defaultProps: {
    onHandleError: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onHandleError calls actions.handleError', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'handleError')

    mapDispatchToProps(dispatch).onHandleError({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('Preferences component', () => {
  test('sets the correct Helmet meta information', () => {
    setup()

    const helmet = Helmet.peek()
    expect(helmet.title).toEqual('Preferences')
    expect(helmet.metaTags).toEqual([
      {
        name: 'title',
        content: 'Preferences'
      },
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ])

    expect(helmet.linkTags).toEqual([
      {
        rel: 'canonical',
        href: 'https://search.earthdata.nasa.gov/preferences'
      }
    ])

    expect(PreferencesForm).toHaveBeenCalledTimes(1)
    expect(PreferencesForm).toHaveBeenCalledWith({
      onHandleError: expect.any(Function)
    }, {})
  })
})
