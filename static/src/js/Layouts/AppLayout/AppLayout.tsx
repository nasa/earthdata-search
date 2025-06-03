import React from 'react'
import { Outlet } from 'react-router-dom'

// @ts-expect-error The file does not have types
import AuthTokenContainer from '../../containers/AuthTokenContainer/AuthTokenContainer'
// @ts-expect-error The file does not have types
import ErrorBannerContainer from '../../containers/ErrorBannerContainer/ErrorBannerContainer'
// @ts-expect-error The file does not have types
import FooterContainer from '../../containers/FooterContainer/FooterContainer'
// @ts-expect-error The file does not have types
import HistoryContainer from '../../containers/HistoryContainer/HistoryContainer'
import LocationUpdater from '../../components/LocationUpdater/LocationUpdater'
// @ts-expect-error The file does not have types
import MetricsEventsContainer from '../../containers/MetricsEventsContainer/MetricsEventsContainer'
// @ts-expect-error The file does not have types
import SecondaryToolbarContainer from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
// @ts-expect-error The file does not have types
import UrlQueryContainer from '../../containers/UrlQueryContainer/UrlQueryContainer'
// @ts-expect-error The file does not have types
import WrappingContainer from '../../containers/WrappingContainer/WrappingContainer'

// eslint-disable-next-line arrow-body-style
const AppLayout = () => {
  return (
    <>
      <LocationUpdater />
      <HistoryContainer />
      <MetricsEventsContainer />
      <ErrorBannerContainer />
      <AuthTokenContainer>
        <UrlQueryContainer>
          <WrappingContainer>
            <SecondaryToolbarContainer />
            <Outlet />
          </WrappingContainer>
          <FooterContainer />
        </UrlQueryContainer>
      </AuthTokenContainer>
    </>
  )
}

export default AppLayout
