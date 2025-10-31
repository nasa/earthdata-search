import React from 'react'
import { Outlet } from 'react-router-dom'

// @ts-expect-error The file does not have types
import EdlTokenLoader from '../../components/EdlTokenLoader/EdlTokenLoader'
// @ts-expect-error The file does not have types
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner'
// @ts-expect-error The file does not have types
import Footer from '../../components/Footer/Footer'
// @ts-expect-error The file does not have types
import HistoryContainer from '../../containers/HistoryContainer/HistoryContainer'
// @ts-expect-error The file does not have types
import MetricsContainer from '../../containers/MetricsContainer/MetricsContainer'
// @ts-expect-error The file does not have types
import PortalContainer from '../../containers/PortalContainer/PortalContainer'
// @ts-expect-error The file does not have types
import SecondaryToolbarContainer from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
// @ts-expect-error The file does not have types
import UrlQueryContainer from '../../containers/UrlQueryContainer/UrlQueryContainer'
// @ts-expect-error The file does not have types
import WrappingContainer from '../../containers/WrappingContainer/WrappingContainer'
import UserLoader from '../../components/UserLoader/UserLoader'

const AppLayout = () => (
  <>
    <PortalContainer />
    <HistoryContainer />
    <MetricsContainer />
    <ErrorBanner />
    <EdlTokenLoader>
      <UserLoader>
        <UrlQueryContainer>
          <WrappingContainer>
            <SecondaryToolbarContainer />
            <Outlet />
          </WrappingContainer>
          <Footer />
        </UrlQueryContainer>
      </UserLoader>
    </EdlTokenLoader>
  </>
)

export default AppLayout
