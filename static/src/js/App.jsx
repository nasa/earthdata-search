import React, { lazy, Suspense } from 'react'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'

import ogImage from '../assets/images/earthdata-search-og-image.jpg?format=webp'
import configureStore from './store/configureStore'
import { getApplicationConfig, getEnvironmentConfig } from '../../../sharedUtils/config'

// Routes
import Home from './routes/Home/Home'

// Components
import ErrorBoundary from './components/Errors/ErrorBoundary'
import NotFound from './components/Errors/NotFound'
import Spinner from './components/Spinner/Spinner'

// Containers
import AuthCallbackContainer from './containers/AuthCallbackContainer/AuthCallbackContainer'
import AuthRequiredContainer from './containers/AuthRequiredContainer/AuthRequiredContainer'
import AppLayout from './Layouts/AppLayout/AppLayout'
import DownloadsLayout from './Layouts/DownloadsLayout/DownloadsLayout'
import PortalContainer from './containers/PortalContainer/PortalContainer'

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
const AboutCSDAModalContainer = lazy(() => import('./containers/AboutCSDAModalContainer/AboutCSDAModalContainer'))
const AboutCwicModalContainer = lazy(() => import('./containers/AboutCwicModalContainer/AboutCwicModalContainer'))
const ChunkedOrderModalContainer = lazy(() => import('./containers/ChunkedOrderModalContainer/ChunkedOrderModalContainer'))
const ContactInfo = lazy(() => import('./routes/ContactInfo/ContactInfo'))
const DeprecatedParameterModalContainer = lazy(() => import('./containers/DeprecatedParameterModalContainer/DeprecatedParameterModalContainer'))
const EarthdataDownloadRedirect = lazy(() => import('./routes/EarthdataDownloadRedirect/EarthdataDownloadRedirect'))
const EditSubscriptionModalContainer = lazy(() => import('./containers/EditSubscriptionModalContainer/EditSubscriptionModalContainer'))
const KeyboardShortcutsModalContainer = lazy(() => import('./containers/KeyboardShortcutsModalContainer/KeyboardShortcutsModalContainer'))
const Preferences = lazy(() => import('./routes/Preferences/Preferences'))
const Project = lazy(() => import('./routes/Project/Project'))
const Search = lazy(() => import('./routes/Search/Search'))
const SearchTour = lazy(() => import('./components/SearchTour/SearchTour'))
const ShapefileDropzoneContainer = lazy(() => import('./containers/ShapefileDropzoneContainer/ShapefileDropzoneContainer'))
const ShapefileUploadModalContainer = lazy(() => import('./containers/ShapefileUploadModalContainer/ShapefileUploadModalContainer'))
const Subscriptions = lazy(() => import('./routes/Subscriptions/Subscriptions'))
const TooManyPointsModalContainer = lazy(() => import('./containers/TooManyPointsModalContainer/TooManyPointsModalContainer'))

const AdminLayout = lazy(() => import('./Layouts/AdminLayout/AdminLayout'))

const { edscHost } = getEnvironmentConfig()
const { env } = getApplicationConfig()

const store = configureStore()

// Create the root App component
const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: '/portal/:portalId/*',
          element: <PortalContainer />
        },
        {
          path: '/search/*',
          element: (
            <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
              <SearchTour />
              <Search />
              <AboutCSDAModalContainer />
              <AboutCwicModalContainer />
              <EditSubscriptionModalContainer />
              <DeprecatedParameterModalContainer />
              <KeyboardShortcutsModalContainer />
              <ShapefileDropzoneContainer />
              <ShapefileUploadModalContainer />
              <TooManyPointsModalContainer />
            </Suspense>
          )
        },
        {
          path: '/projects',
          element: (
            <AuthRequiredContainer>
              <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                <Project />
                <AboutCSDAModalContainer />
                <ChunkedOrderModalContainer />
              </Suspense>
            </AuthRequiredContainer>
          )
        },
        {
          path: '/downloads',
          element: (
            <AuthRequiredContainer>
              <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                <DownloadsLayout />
              </Suspense>
            </AuthRequiredContainer>
          ),
          children: [
            {
              index: true,
              async lazy() {
                const DownloadHistoryContainer = await import('./containers/DownloadHistoryContainer/DownloadHistoryContainer')

                return {
                  Component: DownloadHistoryContainer.default
                }
              }
            },
            {
              path: '/downloads/:id',
              async lazy() {
                const OrderStatusContainer = await import('./containers/OrderStatusContainer/OrderStatusContainer')

                return {
                  Component: OrderStatusContainer.default
                }
              }
            }
          ]
        },
        {
          path: '/contact-info',
          element: (
            <AuthRequiredContainer>
              <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                <ContactInfo />
              </Suspense>
            </AuthRequiredContainer>
          )
        },
        {
          path: '/preferences',
          element: (
            <AuthRequiredContainer>
              <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                <Preferences />
              </Suspense>
            </AuthRequiredContainer>
          )
        },
        {
          path: '/subscriptions',
          element: (
            <AuthRequiredContainer>
              <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                <Subscriptions />
              </Suspense>
            </AuthRequiredContainer>
          )
        },
        {
          path: '/earthdata-download-callback',
          element: (
            <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
              <EarthdataDownloadRedirect />
            </Suspense>
          )
        },
        {
          path: '/auth_callback',
          element: (
            <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
              <AuthCallbackContainer />
            </Suspense>
          )
        },
        {
          path: '/admin',
          element: (
            <AuthRequiredContainer>
              <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
                <AdminLayout />
              </Suspense>
            </AuthRequiredContainer>
          ),
          children: [
            {
              path: '/admin/retrievals',
              async lazy() {
                const AdminRetrievalsContainer = await import('./containers/AdminRetrievalsContainer/AdminRetrievalsContainer')

                return {
                  Component: AdminRetrievalsContainer.default
                }
              }
            },
            {
              path: '/admin/retrievals/:id',
              async lazy() {
                const AdminRetrievalContainer = await import('./containers/AdminRetrievalContainer/AdminRetrievalContainer')

                return {
                  Component: AdminRetrievalContainer.default
                }
              }
            },
            {
              path: '/admin/projects',
              async lazy() {
                const AdminProjectsContainer = await import('./containers/AdminProjectsContainer/AdminProjectsContainer')

                return {
                  Component: AdminProjectsContainer.default
                }
              }
            },
            {
              path: '/admin/projects/:id',
              async lazy() {
                const AdminProjectContainer = await import('./containers/AdminProjectContainer/AdminProjectContainer')

                return {
                  Component: AdminProjectContainer.default
                }
              }
            },
            {
              path: '/admin/retrievals-metrics',
              async lazy() {
                const AdminRetrievalsMetricsContainer = await import('./containers/AdminRetrievalsMetricsContainer/AdminRetrievalsMetricsContainer')

                return {
                  Component: AdminRetrievalsMetricsContainer.default
                }
              }
            },
            {
              path: '/admin/preferences-metrics',
              async lazy() {
                const AdminPreferencesMetricsContainer = await import('./containers/AdminPreferencesMetricsContainer/AdminPreferencesMetricsContainer')

                return {
                  Component: AdminPreferencesMetricsContainer.default
                }
              }
            }
          ]
        }
      ]
    },
    {
      path: '*',
      element: (
        <ErrorBoundary>
          <NotFound />
        </ErrorBoundary>
      )
    }
  ])

  const title = 'Earthdata Search'
  const description = 'Search, discover, visualize, refine, and access NASA Earth Observation data in your browser with Earthdata Search'
  const url = `${edscHost}/search`
  const titleEnv = env.toUpperCase() === 'PROD' ? '' : `[${env.toUpperCase()}]`

  return (
    <ErrorBoundary>
      <Provider store={store}>
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
          <RouterProvider router={router} />
        </ToastProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
