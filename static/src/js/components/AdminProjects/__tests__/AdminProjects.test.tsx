import React from 'react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import AdminProjects from '../AdminProjects'
import AdminProjectsList from '../AdminProjectsList'

vi.mock('../AdminProjectsList', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: AdminProjects,
  withRouter: true
})

describe('AdminProjects component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(AdminProjectsList).toHaveBeenCalledTimes(1)
    expect(AdminProjectsList).toHaveBeenCalledWith({}, {})
  })
})
