import React, {
  Component,
  lazy,
  Suspense
} from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'

import ogImage from '../assets/images/earthdata-search-og-image.jpg'
import configureStore from './store/configureStore'
import history from './util/history'
import { getApplicationConfig, getEnvironmentConfig } from '../../../sharedUtils/config'
import WithProviders from './providers/WithProviders/WithProviders'

// Routes
import Search from './routes/Search/Search'

// Components and Containers
import SecondaryToolbarContainer from './containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
import AboutCSDAModalContainer from './containers/AboutCSDAModalContainer/AboutCSDAModalContainer'
import AboutCwicModalContainer from './containers/AboutCwicModalContainer/AboutCwicModalContainer'
import AuthCallbackContainer from './containers/AuthCallbackContainer/AuthCallbackContainer'
import AuthRequiredContainer from './containers/AuthRequiredContainer/AuthRequiredContainer'
import AuthTokenContainer from './containers/AuthTokenContainer/AuthTokenContainer'
import ChunkedOrderModalContainer from './containers/ChunkedOrderModalContainer/ChunkedOrderModalContainer'
import DeprecatedParameterModalContainer from './containers/DeprecatedParameterModalContainer/DeprecatedParameterModalContainer'
import EditSubscriptionModalContainer from './containers/EditSubscriptionModalContainer/EditSubscriptionModalContainer'
import ErrorBannerContainer from './containers/ErrorBannerContainer/ErrorBannerContainer'
import ErrorBoundary from './components/Errors/ErrorBoundary'
import FooterContainer from './containers/FooterContainer/FooterContainer'
import HistoryContainer from './containers/HistoryContainer/HistoryContainer'
import KeyboardShortcutsModalContainer from './containers/KeyboardShortcutsModalContainer/KeyboardShortcutsModalContainer'
import MetricsEventsContainer from './containers/MetricsEventsContainer/MetricsEventsContainer'
import NotFound from './components/Errors/NotFound'
import PortalContainer from './containers/PortalContainer/PortalContainer'
import SearchTour from './components/Tour/SearchTour'
import ShapefileDropzoneContainer from './containers/ShapefileDropzoneContainer/ShapefileDropzoneContainer'
import ShapefileUploadModalContainer from './containers/ShapefileUploadModalContainer/ShapefileUploadModalContainer'
import Spinner from './components/Spinner/Spinner'
import TooManyPointsModalContainer from './containers/TooManyPointsModalContainer/TooManyPointsModalContainer'
import UrlQueryContainer from './containers/UrlQueryContainer/UrlQueryContainer'
import WrappingContainer from './containers/WrappingContainer/WrappingContainer'

// Required for toast notification system
window.reactToastProvider = React.createRef()

// For using why-did-you-render
// if (process.env.NODE_ENV !== 'production') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render') // eslint-disable-line global-require

//   whyDidYouRender(React)

//   const { whyDidYouUpdate } = require('why-did-you-update') // eslint-disable-line global-require
//   whyDidYouUpdate(React, { include: [/Search/] })
// }

// Lazy loaded routes
const Admin = lazy(() => import('./routes/Admin/Admin'))
const ContactInfo = lazy(() => import('./routes/ContactInfo/ContactInfo'))
const Downloads = lazy(() => import('./routes/Downloads/Downloads'))
const EarthdataDownloadRedirect = lazy(() => import('./routes/EarthdataDownloadRedirect/EarthdataDownloadRedirect'))
const Preferences = lazy(() => import('./routes/Preferences/Preferences'))
const Project = lazy(() => import('./routes/Project/Project'))
const Subscriptions = lazy(() => import('./routes/Subscriptions/Subscriptions'))

// Create the root App component
class App extends Component {
  constructor(props) {
    super(props)

    this.store = configureStore()
    const { edscHost } = getEnvironmentConfig()
    const { env } = getApplicationConfig()
    this.edscHost = edscHost
    this.env = env
  }

  // Portal paths have been removed, but this needs to stay in order to redirect users using
  // a path to the param based portal
  portalPaths(path) {
    return [`/portal/:portalId${path}`, path]
  }

  render() {
    const { edscHost, env } = this
    const title = 'Earthdata Search'
    const description = 'Search, discover, visualize, refine, and access NASA Earth Observation data in your browser with Earthdata Search'
    const url = `${edscHost}/search`
    const titleEnv = env.toUpperCase() === 'PROD' ? '' : `[${env.toUpperCase()}]`

    return (
      <ErrorBoundary>
        <Provider store={this.store}>
          <ToastProvider ref={window.reactToastProvider}>
            <Helmet
              defaultTitle="Earthdata Search"
              titleTemplate={`${titleEnv} %s | Earthdata Search`}
            >
              <meta name="description" content={description} />
              <meta property="og:type" content="website" />
              <meta property="og:title" content={title} />
              <meta property="og:description" content={description} />
              <meta property="og:url" content={url} />
              <meta property="og:image" content={ogImage} />
              <meta name="theme-color" content="#191a1b" />
              <link rel="canonical" href={url} />
            </Helmet>
            <ConnectedRouter history={history}>
              <HistoryContainer />
              <MetricsEventsContainer />
              <Switch>
                <Route path={this.portalPaths('/')} component={PortalContainer} />
              </Switch>
              <ErrorBannerContainer />
              <AuthTokenContainer>
                <UrlQueryContainer>
                  <WrappingContainer>
                    <SecondaryToolbarContainer />
                    <Switch>
                      <Route
                        path="/admin"
                        render={
                          () => (
                            <AuthRequiredContainer>
                              <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                                <Admin />
                              </Suspense>
                            </AuthRequiredContainer>
                          )
                        }
                      />
                      <Route
                        path={this.portalPaths('/contact-info')}
                        render={
                          () => (
                            <AuthRequiredContainer>
                              <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                                <ContactInfo />
                              </Suspense>
                            </AuthRequiredContainer>
                          )
                        }
                      />
                      <Route
                        path={this.portalPaths('/preferences')}
                        render={
                          () => (
                            <AuthRequiredContainer>
                              <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                                <Preferences />
                              </Suspense>
                            </AuthRequiredContainer>
                          )
                        }
                      />
                      <Route
                        path={this.portalPaths('/earthdata-download-callback')}
                        render={
                          () => (
                            <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                              <EarthdataDownloadRedirect />
                            </Suspense>
                          )
                        }
                      />
                      <Route
                        path={this.portalPaths('/subscriptions')}
                        render={
                          () => (
                            <AuthRequiredContainer>
                              <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                                <Subscriptions />
                              </Suspense>
                            </AuthRequiredContainer>
                          )
                        }
                      />
                      <Redirect exact from="/data/retrieve/:retrieval_id" to="/downloads/:retrieval_id" />
                      <Redirect exact from="/data/status" to="/downloads" />
                      <Route
                        path={this.portalPaths('/downloads')}
                        render={
                          () => (
                            <AuthRequiredContainer>
                              <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                                <Downloads />
                              </Suspense>
                            </AuthRequiredContainer>
                          )
                        }
                      />
                      <Route
                        path={this.portalPaths('/projects')}
                        render={
                          () => (
                            <AuthRequiredContainer>
                              <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                                <Project />
                              </Suspense>
                            </AuthRequiredContainer>
                          )
                        }
                      />
                      <Redirect exact from="/portal/:portalId/" to="/portal/:portalId/search" />
                      <Redirect exact from="/" to="/search" />
                      <Route
                        path={this.portalPaths('/search')}
                        render={
                          () => (
                            <>
                              <SearchTour />
                              <Search />
                            </>
                          )
                        }
                      />
                      <Route
                        exact
                        path="/auth_callback"
                        render={
                          () => (
                            <AuthCallbackContainer />
                          )
                        }
                      />
                      <Route component={NotFound} />
                    </Switch>
                    <Switch>
                      <Route path={this.portalPaths('/')}>
                        <AboutCSDAModalContainer />
                        <AboutCwicModalContainer />
                        <EditSubscriptionModalContainer />
                        <ChunkedOrderModalContainer />
                        <DeprecatedParameterModalContainer />
                        <KeyboardShortcutsModalContainer />
                        <ShapefileDropzoneContainer />
                        <ShapefileUploadModalContainer />
                        <TooManyPointsModalContainer />
                      </Route>
                      <Route path={this.portalPaths('/projects')}>
                        <AboutCSDAModalContainer />
                      </Route>
                      <Route path={this.portalPaths('/downloads')}>
                        <AboutCSDAModalContainer />
                      </Route>
                    </Switch>
                  </WrappingContainer>
                  <FooterContainer />
                </UrlQueryContainer>
              </AuthTokenContainer>
            </ConnectedRouter>
          </ToastProvider>
        </Provider>
      </ErrorBoundary>
    )
  }
}

export default WithProviders(App)
