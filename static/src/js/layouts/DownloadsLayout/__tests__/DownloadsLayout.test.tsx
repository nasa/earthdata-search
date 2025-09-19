import React from 'react'
import { Outlet } from 'react-router-dom'

import setupTest from '../../../../../../jestConfigs/setupTest'

import DownloadsLayout from '../DownloadsLayout'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: jest.fn(() => <div>Outlet</div>)
}))

const setup = setupTest({
  Component: DownloadsLayout
})

describe('DownloadsLayout', () => {
  test('renders the app layout', () => {
    setup()

    expect(Outlet).toHaveBeenCalledTimes(1)
    expect(Outlet).toHaveBeenCalledWith({}, {})
  })
})
