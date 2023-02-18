import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route, Redirect } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'

import ogImage from '../assets/images/earthdata-search-og-image.jpg'
import configureStore from './store/configureStore'
import history from './util/history'
import { getApplicationConfig, getEnvironmentConfig } from '../../../sharedUtils/config'

import Admin from './routes/Admin/Admin'
import ContactInfo from './routes/ContactInfo/ContactInfo'
import Downloads from './routes/Downloads/Downloads'
import FooterContainer from './containers/FooterContainer/FooterContainer'
import Preferences from './routes/Preferences/Preferences'
import Project from './routes/Project/Project'
import Search from './routes/Search/Search'
import Subscriptions from './routes/Subscriptions/Subscriptions'

import AboutCSDAModalContainer from './containers/AboutCSDAModalContainer/AboutCSDAModalContainer'
import AboutCwicModalContainer from './containers/AboutCwicModalContainer/AboutCwicModalContainer'
import AppHeader from './components/AppHeader/AppHeader'
import AuthCallbackContainer from './containers/AuthCallbackContainer/AuthCallbackContainer'
import AuthRequiredContainer from './containers/AuthRequiredContainer/AuthRequiredContainer'
import AuthTokenContainer from './containers/AuthTokenContainer/AuthTokenContainer'
import ChunkedOrderModalContainer from './containers/ChunkedOrderModalContainer/ChunkedOrderModalContainer'
import DeprecatedParameterModalContainer from './containers/DeprecatedParameterModalContainer/DeprecatedParameterModalContainer'
import EdscMapContainer from './containers/MapContainer/MapContainer'
import ErrorBannerContainer from './containers/ErrorBannerContainer/ErrorBannerContainer'
import ErrorBoundary from './components/Errors/ErrorBoundary'
import KeyboardShortcutsModalContainer from './containers/KeyboardShortcutsModalContainer/KeyboardShortcutsModalContainer'
import MetricsEventsContainer from './containers/MetricsEventsContainer/MetricsEventsContainer'
import NotFound from './components/Errors/NotFound'
import PortalContainer from './containers/PortalContainer/PortalContainer'
import ShapefileDropzoneContainer from './containers/ShapefileDropzoneContainer/ShapefileDropzoneContainer'
import ShapefileUploadModalContainer from './containers/ShapefileUploadModalContainer/ShapefileUploadModalContainer'
import TooManyPointsModalContainer from './containers/TooManyPointsModalContainer/TooManyPointsModalContainer'
import UrlQueryContainer from './containers/UrlQueryContainer/UrlQueryContainer'
import EditSubscriptionModalContainer from './containers/EditSubscriptionModalContainer/EditSubscriptionModalContainer'

// Required for toast notification system
window.reactToastProvider = React.createRef()

// if (process.env.NODE_ENV !== 'production') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render') // eslint-disable-line global-require

//   whyDidYouRender(React)

//   const { whyDidYouUpdate } = require('why-did-you-update') // eslint-disable-line global-require
//   whyDidYouUpdate(React, { include: [/Search/] })
// }

// Create the root App component
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.store = configureStore()
    const { edscHost } = getEnvironmentConfig()
    const { env } = getApplicationConfig()
    this.edscHost = edscHost
    this.env = env
  }

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
              <MetricsEventsContainer />
              <Switch>
                <Route path={this.portalPaths('/')} component={PortalContainer} />
              </Switch>
              <ErrorBannerContainer />
              <AuthTokenContainer>
                <UrlQueryContainer>
                  <AppHeader />
                  <Switch>
                    <Route
                      path="/admin"
                      render={() => (
                        <AuthRequiredContainer>
                          <Admin />
                        </AuthRequiredContainer>
                      )}
                    />
                    <Route
                      path={this.portalPaths('/contact-info')}
                      render={() => (
                        <AuthRequiredContainer>
                          <ContactInfo />
                        </AuthRequiredContainer>
                      )}
                    />
                    <Route
                      path={this.portalPaths('/preferences')}
                      render={() => (
                        <AuthRequiredContainer>
                          <Preferences />
                        </AuthRequiredContainer>
                      )}
                    />
                    <Route
                      path={this.portalPaths('/subscriptions')}
                      render={() => (
                        <AuthRequiredContainer>
                          <Subscriptions />
                        </AuthRequiredContainer>
                      )}
                    />
                    <Redirect exact from="/data/retrieve/:retrieval_id" to="/downloads/:retrieval_id" />
                    <Redirect exact from="/data/status" to="/downloads" />
                    <Route
                      path={this.portalPaths('/downloads')}
                      render={() => (
                        <AuthRequiredContainer>
                          <Downloads />
                        </AuthRequiredContainer>
                      )}
                    />
                    <Route path={this.portalPaths('/projects')} component={Project} />
                    <Redirect exact from="/portal/:portalId/" to="/portal/:portalId/search" />
                    <Redirect exact from="/" to="/search" />
                    <Route
                      path={this.portalPaths('/search')}
                      render={() => (
                        <>
                          <Search />
                          <EdscMapContainer />
                        </>
                      )}
                    />
                    <Route
                      exact
                      path="/auth_callback"
                      render={() => (
                        <AuthCallbackContainer />
                      )}
                    />
                    <Route component={NotFound} />
                  </Switch>
                  <FooterContainer />
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
                </UrlQueryContainer>
              </AuthTokenContainer>
            </ConnectedRouter>
          </ToastProvider>
        </Provider>
      </ErrorBoundary>
    )
  }
}

export default App
