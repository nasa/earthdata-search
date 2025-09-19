import React from 'react'
import { Outlet } from 'react-router-dom'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AppLayout from '../AppLayout'

// @ts-expect-error The file does not have types
import AuthTokenContainer from '../../../containers/AuthTokenContainer/AuthTokenContainer'
// @ts-expect-error The file does not have types
import ErrorBannerContainer from '../../../containers/ErrorBannerContainer/ErrorBannerContainer'
// @ts-expect-error The file does not have types
import Footer from '../../../components/Footer/Footer'
// @ts-expect-error The file does not have types
import HistoryContainer from '../../../containers/HistoryContainer/HistoryContainer'
// @ts-expect-error The file does not have types
import MetricsContainer from '../../../containers/MetricsContainer/MetricsContainer'
// @ts-expect-error The file does not have types
import PortalContainer from '../../../containers/PortalContainer/PortalContainer'
// @ts-expect-error The file does not have types
import SecondaryToolbarContainer from '../../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
// @ts-expect-error The file does not have types
import UrlQueryContainer from '../../../containers/UrlQueryContainer/UrlQueryContainer'
// @ts-expect-error The file does not have types
import WrappingContainer from '../../../containers/WrappingContainer/WrappingContainer'

jest.mock('../../../containers/AuthTokenContainer/AuthTokenContainer', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../containers/ErrorBannerContainer/ErrorBannerContainer', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../components/Footer/Footer', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../containers/HistoryContainer/HistoryContainer', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../containers/MetricsContainer/MetricsContainer', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../containers/PortalContainer/PortalContainer', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../containers/UrlQueryContainer/UrlQueryContainer', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../containers/WrappingContainer/WrappingContainer', () => jest.fn(({ children }) => <div>{children}</div>))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: jest.fn(() => <div>Outlet</div>)
}))

const setup = setupTest({
  Component: AppLayout
})

describe('AppLayout', () => {
  it('renders the app layout', () => {
    setup()

    expect(HistoryContainer).toHaveBeenCalledTimes(1)
    expect(HistoryContainer).toHaveBeenCalledWith({}, {})

    expect(MetricsContainer).toHaveBeenCalledTimes(1)
    expect(MetricsContainer).toHaveBeenCalledWith({}, {})

    expect(ErrorBannerContainer).toHaveBeenCalledTimes(1)
    expect(ErrorBannerContainer).toHaveBeenCalledWith({}, {})

    expect(AuthTokenContainer).toHaveBeenCalledTimes(1)
    expect(AuthTokenContainer).toHaveBeenCalledWith(
      {
        children: expect.anything()
      },
      {}
    )

    expect(PortalContainer).toHaveBeenCalledTimes(1)
    expect(PortalContainer).toHaveBeenCalledWith({}, {})

    expect(UrlQueryContainer).toHaveBeenCalledTimes(1)
    expect(UrlQueryContainer).toHaveBeenCalledWith(
      {
        children: expect.anything()
      },
      {}
    )

    expect(WrappingContainer).toHaveBeenCalledTimes(1)
    expect(WrappingContainer).toHaveBeenCalledWith(
      {
        children: expect.anything()
      },
      {}
    )

    expect(SecondaryToolbarContainer).toHaveBeenCalledTimes(1)
    expect(SecondaryToolbarContainer).toHaveBeenCalledWith({}, {})

    expect(Footer).toHaveBeenCalledTimes(1)
    expect(Footer).toHaveBeenCalledWith({}, {})

    expect(Outlet).toHaveBeenCalledTimes(1)
    expect(Outlet).toHaveBeenCalledWith({}, {})
  })
})
