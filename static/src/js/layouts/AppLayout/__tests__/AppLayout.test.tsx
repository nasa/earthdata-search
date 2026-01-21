import React from 'react'
import { Outlet } from 'react-router-dom'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import AppLayout from '../AppLayout'

// @ts-expect-error The file does not have types
import EdlTokenLoader from '../../../components/EdlTokenLoader/EdlTokenLoader'
// @ts-expect-error The file does not have types
import ErrorBanner from '../../../components/ErrorBanner/ErrorBanner'
// @ts-expect-error The file does not have types
import Footer from '../../../components/Footer/Footer'
// @ts-expect-error The file does not have types
import HistoryContainer from '../../../containers/HistoryContainer/HistoryContainer'
// @ts-expect-error The file does not have types
import MetricsContainer from '../../../containers/MetricsContainer/MetricsContainer'
// @ts-expect-error The file does not have types
import PortalContainer from '../../../containers/PortalContainer/PortalContainer'
// @ts-expect-error The file does not have types
import SecondaryToolbar from '../../../components/SecondaryToolbar/SecondaryToolbar'
// @ts-expect-error The file does not have types
import UrlQueryContainer from '../../../containers/UrlQueryContainer/UrlQueryContainer'
// @ts-expect-error The file does not have types
import WrappingContainer from '../../../containers/WrappingContainer/WrappingContainer'
import UserLoader from '../../../components/UserLoader/UserLoader'

vi.mock('../../../components/EdlTokenLoader/EdlTokenLoader', () => ({ default: vi.fn(({ children }) => <div>{children}</div>) }))
vi.mock('../../../components/ErrorBanner/ErrorBanner', () => ({ default: vi.fn(({ children }) => <div>{children}</div>) }))
vi.mock('../../../components/Footer/Footer', () => ({ default: vi.fn(({ children }) => <div>{children}</div>) }))
vi.mock('../../../containers/HistoryContainer/HistoryContainer', () => ({ default: vi.fn(({ children }) => <div>{children}</div>) }))
vi.mock('../../../containers/MetricsContainer/MetricsContainer', () => ({ default: vi.fn(({ children }) => <div>{children}</div>) }))
vi.mock('../../../containers/PortalContainer/PortalContainer', () => ({ default: vi.fn(({ children }) => <div>{children}</div>) }))
vi.mock('../../../components/SecondaryToolbar/SecondaryToolbar', () => ({ default: vi.fn(({ children }) => <div>{children}</div>) }))
vi.mock('../../../containers/UrlQueryContainer/UrlQueryContainer', () => ({ default: vi.fn(({ children }) => <div>{children}</div>) }))
vi.mock('../../../containers/WrappingContainer/WrappingContainer', () => ({ default: vi.fn(({ children }) => <div>{children}</div>) }))
vi.mock('../../../components/UserLoader/UserLoader', () => ({ default: vi.fn(({ children }) => <div>{children}</div>) }))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  Outlet: vi.fn(() => <div>Outlet</div>)
}))

const setup = setupTest({
  Component: AppLayout
})

describe('AppLayout', () => {
  test('renders the app layout', () => {
    setup()

    expect(HistoryContainer).toHaveBeenCalledTimes(1)
    expect(HistoryContainer).toHaveBeenCalledWith({}, {})

    expect(MetricsContainer).toHaveBeenCalledTimes(1)
    expect(MetricsContainer).toHaveBeenCalledWith({}, {})

    expect(ErrorBanner).toHaveBeenCalledTimes(1)
    expect(ErrorBanner).toHaveBeenCalledWith({}, {})

    expect(EdlTokenLoader).toHaveBeenCalledTimes(1)
    expect(EdlTokenLoader).toHaveBeenCalledWith(
      {
        children: expect.anything()
      },
      {}
    )

    expect(UserLoader).toHaveBeenCalledTimes(1)
    expect(UserLoader).toHaveBeenCalledWith(
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

    expect(SecondaryToolbar).toHaveBeenCalledTimes(1)
    expect(SecondaryToolbar).toHaveBeenCalledWith({}, {})

    expect(Footer).toHaveBeenCalledTimes(1)
    expect(Footer).toHaveBeenCalledWith({}, {})

    expect(Outlet).toHaveBeenCalledTimes(1)
    expect(Outlet).toHaveBeenCalledWith({}, {})
  })
})
