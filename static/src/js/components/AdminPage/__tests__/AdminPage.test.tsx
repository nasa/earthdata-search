import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import AdminPage from '../AdminPage'

const setup = (overrideProps = {}) => {
  const props = {
    children: null,
    pageTitle: 'Admin Title',
    breadcrumbs: [{
      active: false,
      name: 'Admin Title'
    }],
    ...overrideProps
  }

  render(
    <MemoryRouter>
      <AdminPage {...props} />
    </MemoryRouter>
  )

  return { props }
}

describe('AdminPage component', () => {
  test('should render the site AdminPage', () => {
    setup()

    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByRole('heading')).toHaveTextContent('Admin Title')
    expect(screen.getByRole('list')).toHaveClass('admin-page__breadcrumbs')
  })

  test('should render the admin with breadcrumbs', () => {
    setup({
      breadcrumbs: [{
        active: false,
        name: 'Admin Title',
        href: '/admin'
      }, {
        active: true,
        name: 'Retrievals'
      }]
    })

    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByRole('heading')).toHaveTextContent('Admin Title')

    const breadcrumbs = screen.getByLabelText('Breadcrumb')

    expect(within(breadcrumbs).getAllByRole('listitem').length).toEqual(2)
    expect(within(breadcrumbs).getAllByRole('listitem')[0]).toHaveTextContent('Admin')
    expect(within(breadcrumbs).getByRole('link')).toHaveAttribute('href', '/admin')
    expect(within(breadcrumbs).getByText('Admin Title')).toBeInTheDocument()
    expect(within(breadcrumbs).getByRole('listitem', { current: 'page' })).toHaveTextContent('Retrievals')
    expect(within(breadcrumbs).getByText('Retrievals')).toBeInTheDocument()
  })
})
