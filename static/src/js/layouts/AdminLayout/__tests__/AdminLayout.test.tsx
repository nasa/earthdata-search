import React from 'react'
import { Outlet } from 'react-router-dom'
import { waitFor } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdminLayout from '../AdminLayout'

// @ts-expect-error The file does not have types
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

import ADMIN_IS_AUTHORIZED from '../../../operations/queries/adminIsAuthorized'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: jest.fn(() => <div>Outlet</div>)
}))

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => jest.fn(({ children }) => <div>{children}</div>))

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
  test('does not render anything when not authorized', () => {
    setup({
      overrideApolloClientMocks: [{
        request: {
          query: ADMIN_IS_AUTHORIZED
        },
        error: new Error('Not authorized')
      }]
    })

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
