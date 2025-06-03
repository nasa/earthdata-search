import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdminProjects from '../AdminProjects'

import AdminPage from '../../AdminPage/AdminPage'
import AdminProjectsList from '../AdminProjectsList'
import AdminProjectsForm from '../AdminProjectsForm'

jest.mock('../../AdminPage/AdminPage', () => jest.fn().mockImplementation(
  jest.requireActual('../../AdminPage/AdminPage').default
))

jest.mock('../AdminProjectsForm', () => jest.fn(() => <div />))
jest.mock('../AdminProjectsList', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdminProjects,
  defaultProps: {
    onAdminViewProject: jest.fn(),
    onUpdateAdminProjectsSortKey: jest.fn(),
    onUpdateAdminProjectsPageNum: jest.fn(),
    projects: {}
  },
  withRouter: true
})

describe('AdminProjects component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(AdminPage).toHaveBeenCalledTimes(1)
    expect(AdminPage).toHaveBeenCalledWith({
      breadcrumbs: [{
        href: '/admin',
        name: 'Admin'
      }, {
        active: true,
        name: 'Projects'
      }],
      children: expect.anything(),
      pageTitle: 'Projects'
    }, {})

    expect(AdminProjectsForm).toHaveBeenCalledTimes(1)
    expect(AdminProjectsForm).toHaveBeenCalledWith({
      onAdminViewProject: expect.any(Function)
    }, {})

    expect(AdminProjectsList).toHaveBeenCalledTimes(1)
    expect(AdminProjectsList).toHaveBeenCalledWith({
      onUpdateAdminProjectsSortKey: expect.any(Function),
      onUpdateAdminProjectsPageNum: expect.any(Function),
      projects: {}
    }, {})
  })
})
