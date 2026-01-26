import React from 'react'
import { Helmet } from 'react-helmet'
import { waitFor } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import * as AppConfig from '../../../../../../sharedUtils/config'

import Subscriptions from '../Subscriptions'
import SubscriptionsList from '../../../components/SubscriptionsList/SubscriptionsList'

vi.mock('../../../components/SubscriptionsList/SubscriptionsList', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: Subscriptions
})

beforeEach(() => {
  vi.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

describe('Subscriptions component', () => {
  test('sets the correct Helmet meta information', async () => {
    setup()

    await waitFor(() => expect(document.title).toEqual('Subscriptions'))

    const helmet = Helmet.peek()

    const title = helmet.metaTags.find((tag) => tag.name === 'title')
    expect(title).toBeDefined()
    expect(title.content).toBe('Subscriptions')

    const robots = helmet.metaTags.find((tag) => tag.name === 'robots')
    expect(robots).toBeDefined()
    expect(robots.content).toBe('noindex, nofollow')

    const canonicalLink = helmet.linkTags.find((tag) => tag.rel === 'canonical')
    expect(canonicalLink).toBeDefined()
    expect(canonicalLink.href).toBe('https://search.earthdata.nasa.gov')
  })

  test('displays the subscription list', () => {
    setup()

    expect(SubscriptionsList).toHaveBeenCalledTimes(1)
    expect(SubscriptionsList).toHaveBeenCalledWith({}, {})
  })
})
