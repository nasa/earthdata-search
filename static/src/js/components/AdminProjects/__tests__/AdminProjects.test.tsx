import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdminProjects from '../AdminProjects'
import AdminProjectsList from '../AdminProjectsList'

jest.mock('../AdminProjectsList', () => jest.fn(() => <div />))

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
