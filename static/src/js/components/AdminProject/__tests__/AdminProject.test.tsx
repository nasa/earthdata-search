import React from 'react'
import { screen, within } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { AdminProject } from '../AdminProject'

// @ts-expect-error: This file does not have types
import AdminProjectDetails from '../../AdminProjectDetails/AdminProjectDetails'

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
  test('renders itself correctly', () => {
    setup()

    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByRole('heading')).toHaveTextContent('Project Details')
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  test('renders its breadcrumbs correctly', () => {
    setup()

    const breadcrumbs = screen.getByLabelText('Breadcrumb')

    expect(within(breadcrumbs).getAllByRole('listitem').length).toEqual(3)
    expect(within(breadcrumbs).getAllByRole('listitem')[0]).toHaveTextContent('Admin')
    expect(within(within(breadcrumbs).getAllByRole('listitem')[0]).getByRole('link')).toHaveAttribute('href', '/admin')
    expect(within(breadcrumbs).getAllByRole('listitem')[1]).toHaveTextContent('Projects')
    expect(within(within(breadcrumbs).getAllByRole('listitem')[1]).getByRole('link')).toHaveAttribute('href', '/admin/projects')
    expect(within(breadcrumbs).getByRole('listitem', { current: 'page' })).toHaveTextContent('Project Details')
  })

  test('passes the correct props to AdminProjectDetails', () => {
    const { props } = setup()

    expect(AdminProjectDetails).toHaveBeenCalledTimes(1)
    expect(AdminProjectDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        project: props.project
      }),
      {}
    )
  })
})
