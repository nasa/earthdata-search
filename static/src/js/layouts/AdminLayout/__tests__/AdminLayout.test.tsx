import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { waitFor } from '@testing-library/react'
import { ApolloError } from '@apollo/client'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import AdminLayout from '../AdminLayout'

// @ts-expect-error The file does not have types
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

import ADMIN_IS_AUTHORIZED from '../../../operations/queries/adminIsAuthorized'

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  Outlet: vi.fn(() => <div>Outlet</div>),
  Navigate: vi.fn(() => <div>Navigate</div>)
}))

vi.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => ({
  default: vi.fn(({ children }) => <div>{children}</div>)
}))

const setup = setupTest({
  Component: AdminLayout,
  defaultApolloClientMocks: [
    {
      request: {
        query: ADMIN_IS_AUTHORIZED
      },
      result: {
        data: {
          adminIsAuthorized: true
        }
      }
    }
  ],
  withApolloClient: true,
  withRouter: true
})

describe('AdminLayout', () => {
  test('does not render anything when not authorized', async () => {
    setup({
      overrideApolloClientMocks: [{
        request: {
          query: ADMIN_IS_AUTHORIZED
        },
        error: new ApolloError({ errorMessage: 'Not authorized' })
      }]
    })

    await waitFor(() => {
      expect(Navigate).toHaveBeenCalledTimes(1)
    })

    expect(Navigate).toHaveBeenCalledWith({
      replace: true,
      to: '/'
    }, {})

    expect(PortalLinkContainer).toHaveBeenCalledTimes(0)
  })

  test('renders the admin layout when authorized', async () => {
    setup()

    await waitFor(() => {
      expect(Outlet).toHaveBeenCalledTimes(1)
    })

    expect(Outlet).toHaveBeenCalledWith({}, {})
  })
})
