import React from 'react'
import { Outlet } from 'react-router'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import DownloadsLayout from '../DownloadsLayout'

vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  Outlet: vi.fn(() => <div>Outlet</div>)
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
