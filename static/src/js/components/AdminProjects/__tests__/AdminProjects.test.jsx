import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdminProjects from '../AdminProjects'
import AdminProjectsList from '../AdminProjectsList'
import AdminProjectsForm from '../AdminProjectsForm'

jest.mock('../AdminProjectsList', () => jest.fn(() => <div />))
jest.mock('../AdminProjectsForm', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdminProjects,
  defaultProps: {
    onAdminViewProject: jest.fn(),
    onUpdateAdminProjectsSortKey: jest.fn(),
    onUpdateAdminProjectsPageNum: jest.fn(),
    projects: {
      allIds: [],
      byId: {},
      pagination: {},
      sortKey: ''
    }
  },
  withRouter: true
})

describe('AdminProjects component', () => {
  test('renders itself correctly', () => {
    const { props } = setup()

    expect(AdminProjectsForm).toHaveBeenCalledTimes(1)
    expect(AdminProjectsForm).toHaveBeenCalledWith({
      onAdminViewProject: props.onAdminViewProject
    }, {})

    expect(AdminProjectsList).toHaveBeenCalledTimes(1)
    expect(AdminProjectsList).toHaveBeenCalledWith({
      onUpdateAdminProjectsSortKey: props.onUpdateAdminProjectsSortKey,
      onUpdateAdminProjectsPageNum: props.onUpdateAdminProjectsPageNum,
      projects: props.projects
    }, {})
  })
})
