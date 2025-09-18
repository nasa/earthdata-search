import React from 'react'
import { screen } from '@testing-library/react'
import setupTest from '../../../../../../jestConfigs/setupTest'
import Admin from '../Admin'

// Mock the PortalLinkContainer so it renders <a> and children.
// Expects 'to' prop for href.
jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => {
  const MockPortalLinkContainer = jest.fn(({ to, children }) => (
    <a href={to}>{children}</a>
  ))
  return MockPortalLinkContainer
})

const setup = setupTest({
  Component: Admin,
  defaultProps: {},
  withRedux: false,
  withRouter: false
})

describe('Admin', () => {
  test('renders Admin header text', () => {
    setup()
    expect(screen.getByRole('heading', { level: 2, name: /Admin/ })).toBeInTheDocument()
  })

  test('renders all admin portal links', () => {
    setup()
    expect(screen.getByRole('link', { name: 'Retrievals' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Retrieval Metrics' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Preferences Metrics' })).toBeInTheDocument()
  })

  test('renders the expected number of portal links', () => {
    setup()
    const portalLinks = screen.getAllByRole('link')
    expect(portalLinks).toHaveLength(4)
  })

  test('links have correct hrefs', () => {
    setup()
    expect(screen.getByRole('link', { name: 'Retrievals' })).toHaveAttribute('href', '/admin/retrievals')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/admin/projects')
    expect(screen.getByRole('link', { name: 'Retrieval Metrics' })).toHaveAttribute('href', '/admin/retrievals-metrics')
    expect(screen.getByRole('link', { name: 'Preferences Metrics' })).toHaveAttribute('href', '/admin/preferences-metrics')
  })
})
