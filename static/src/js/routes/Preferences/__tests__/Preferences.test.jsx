import React from 'react'
import Helmet from 'react-helmet'

import setupTest from '../../../../../../jestConfigs/setupTest'

import Preferences from '../Preferences'
import * as AppConfig from '../../../../../../sharedUtils/config'
import PreferencesContainer from '../../../containers/PreferencesContainer/PreferencesContainer'

jest.mock('../../../containers/PreferencesContainer/PreferencesContainer', () => jest.fn(() => <div />))

beforeEach(() => {
  jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

const setup = setupTest({
  Component: Preferences
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

    expect(PreferencesContainer).toHaveBeenCalledTimes(1)
    expect(PreferencesContainer).toHaveBeenCalledWith({}, {})
  })
})
