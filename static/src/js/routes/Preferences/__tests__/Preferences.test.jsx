import React from 'react'
import Helmet from 'react-helmet'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import Preferences from '../Preferences'
import * as AppConfig from '../../../../../../sharedUtils/config'
import PreferencesForm from '../../../components/Preferences/PreferencesForm'

vi.mock('../../../components/Preferences/PreferencesForm', () => ({ default: vi.fn(() => <div />) }))

beforeEach(() => {
  vi.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
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

    expect(PreferencesForm).toHaveBeenCalledTimes(1)
    expect(PreferencesForm).toHaveBeenCalledWith({}, {})
  })
})
