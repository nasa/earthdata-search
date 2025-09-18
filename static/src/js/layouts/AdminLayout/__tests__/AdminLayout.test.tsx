import React from 'react'
import { Outlet } from 'react-router-dom'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { AdminLayout } from '../AdminLayout'

// @ts-expect-error The file does not have types
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: jest.fn(() => <div>Outlet</div>)
}))

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => jest.fn(({ children }) => <div>{children}</div>))

const setup = setupTest({
  Component: AdminLayout,
  defaultProps: {
    isAuthorized: true,
    onAdminIsAuthorized: jest.fn()
  },
  withRedux: true,
  withRouter: true
})

describe('AdminLayout', () => {
  it('calls onAdminIsAuthorized on mount', () => {
    const { props } = setup()

    expect(props.onAdminIsAuthorized).toHaveBeenCalledTimes(1)
    expect(props.onAdminIsAuthorized).toHaveBeenCalledWith()
  })

  it('does not render anything when not authorized', () => {
    setup({
      overrideProps: {
        isAuthorized: false
      }
    })

    expect(PortalLinkContainer).toHaveBeenCalledTimes(0)
  })

  it('renders the admin layout when authorized', () => {
    setup()

    expect(Outlet).toHaveBeenCalledTimes(1)
    expect(Outlet).toHaveBeenCalledWith({}, {})
  })
})
