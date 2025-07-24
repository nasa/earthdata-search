import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { AdminPreferencesMetrics } from '../AdminPreferencesMetrics'
import { AdminPreferencesMetricsList } from '../AdminPreferencesMetricsList'

jest.mock('../AdminPreferencesMetricsList', () => ({
  AdminPreferencesMetricsList: jest.fn(() => <div />)
}))

const setup = setupTest({
  Component: AdminPreferencesMetrics,
  withRouter: true
})

describe('AdminPreferencesMetrics component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders a page heading', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Preferences Metrics' })).toBeInTheDocument()
  })

  test('renders the AdminPreferencesMetricsList component', () => {
    setup()
    expect(AdminPreferencesMetricsList).toHaveBeenCalledTimes(1)
  })
})
