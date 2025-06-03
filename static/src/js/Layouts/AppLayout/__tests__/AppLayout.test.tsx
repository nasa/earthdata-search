import React from 'react'
import { Outlet } from 'react-router-dom'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AppLayout from '../AppLayout'

// @ts-expect-error The file does not have types
import AuthTokenContainer from '../../../containers/AuthTokenContainer/AuthTokenContainer'
// @ts-expect-error The file does not have types
import ErrorBannerContainer from '../../../containers/ErrorBannerContainer/ErrorBannerContainer'
// @ts-expect-error The file does not have types
import FooterContainer from '../../../containers/FooterContainer/FooterContainer'
// @ts-expect-error The file does not have types
import HistoryContainer from '../../../containers/HistoryContainer/HistoryContainer'
import LocationUpdater from '../../../components/LocationUpdater/LocationUpdater'
// @ts-expect-error The file does not have types
import MetricsEventsContainer from '../../../containers/MetricsEventsContainer/MetricsEventsContainer'
// @ts-expect-error The file does not have types
import SecondaryToolbarContainer from '../../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
// @ts-expect-error The file does not have types
import UrlQueryContainer from '../../../containers/UrlQueryContainer/UrlQueryContainer'
// @ts-expect-error The file does not have types
import WrappingContainer from '../../../containers/WrappingContainer/WrappingContainer'

jest.mock('../../../containers/AuthTokenContainer/AuthTokenContainer', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../containers/ErrorBannerContainer/ErrorBannerContainer', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../containers/FooterContainer/FooterContainer', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../containers/HistoryContainer/HistoryContainer', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../components/LocationUpdater/LocationUpdater', () => jest.fn(({ children }) => <div>{children}</div>))
jest.mock('../../../containers/MetricsEventsContainer/MetricsEventsContainer', () => jest.fn(({ children }) => <div>{children}</div>))
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

    expect(LocationUpdater).toHaveBeenCalledTimes(1)
    expect(LocationUpdater).toHaveBeenCalledWith({}, {})

    expect(HistoryContainer).toHaveBeenCalledTimes(1)
    expect(HistoryContainer).toHaveBeenCalledWith({}, {})

    expect(MetricsEventsContainer).toHaveBeenCalledTimes(1)
    expect(MetricsEventsContainer).toHaveBeenCalledWith({}, {})

    expect(ErrorBannerContainer).toHaveBeenCalledTimes(1)
    expect(ErrorBannerContainer).toHaveBeenCalledWith({}, {})

    expect(AuthTokenContainer).toHaveBeenCalledTimes(1)
    expect(AuthTokenContainer).toHaveBeenCalledWith(
      {
        children: expect.anything()
      },
      {}
    )

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

    expect(FooterContainer).toHaveBeenCalledTimes(1)
    expect(FooterContainer).toHaveBeenCalledWith({}, {})

    expect(Outlet).toHaveBeenCalledTimes(1)
    expect(Outlet).toHaveBeenCalledWith({}, {})
  })
})
