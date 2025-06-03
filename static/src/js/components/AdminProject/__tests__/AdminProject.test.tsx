import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdminProject from '../AdminProject'
import AdminPage from '../../AdminPage/AdminPage'
// @ts-expect-error: This file does not have types
import AdminProjectDetails from '../../AdminProjectDetails/AdminProjectDetails'

jest.mock('../../AdminPage/AdminPage', () => jest.fn().mockImplementation(
  jest.requireActual('../../AdminPage/AdminPage').default
))

jest.mock('../../AdminProjectDetails/AdminProjectDetails', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdminProject,
  defaultProps: {
    project: {
      id: 1
    }
  },
  withRouter: true
})

describe('AdminProject component', () => {
  test('renders its components correctly', () => {
    setup()

    expect(AdminPage).toHaveBeenCalledTimes(1)
    expect(AdminPage).toHaveBeenCalledWith({
      breadcrumbs: [{
        href: '/admin',
        name: 'Admin'
      }, {
        href: '/admin/projects',
        name: 'Projects'
      }, {
        active: true,
        name: 'Project Details'
      }],
      children: expect.anything(),
      pageTitle: 'Project Details'
    }, {})

    expect(AdminProjectDetails).toHaveBeenCalledTimes(1)
    expect(AdminProjectDetails).toHaveBeenCalledWith({
      project: {
        id: 1
      }
    }, {})
  })
})
