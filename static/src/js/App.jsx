import React, {
  lazy,
  Suspense,
  useEffect
} from 'react'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'
import { Helmet } from 'react-helmet'

import ogImage from '../assets/images/earthdata-search-og-image.jpg?format=webp'
import configureStore from './store/configureStore'
import { getApplicationConfig, getEnvironmentConfig } from '../../../sharedUtils/config'

import routerHelper from './router/router'

// Routes
import Home from './routes/Home/Home'

// Components
import ErrorBoundary from './components/Errors/ErrorBoundary'
import NotFound from './components/Errors/NotFound'
import Spinner from './components/Spinner/Spinner'

// Containers
import AuthCallbackContainer from './containers/AuthCallbackContainer/AuthCallbackContainer'
import AuthRequiredContainer from './containers/AuthRequiredContainer/AuthRequiredContainer'
import PortalContainer from './containers/PortalContainer/PortalContainer'

import AppLayout from './layouts/AppLayout/AppLayout'

import GraphQlProvider from './providers/GraphQlProvider'
import EmergencyNotification from './components/EmergencyNotification/EmergencyNotification'

import { routes } from './constants/routes'

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
const Projects = lazy(() => import('./routes/Projects/Projects'))
const Search = lazy(() => import('./routes/Search/Search'))
const SearchTour = lazy(() => import('./components/SearchTour/SearchTour'))
const ShapefileDropzoneContainer = lazy(() => import('./containers/ShapefileDropzoneContainer/ShapefileDropzoneContainer'))
const ShapefileUploadModalContainer = lazy(() => import('./containers/ShapefileUploadModalContainer/ShapefileUploadModalContainer'))
const Subscriptions = lazy(() => import('./routes/Subscriptions/Subscriptions'))
const TooManyPointsModalContainer = lazy(() => import('./containers/TooManyPointsModalContainer/TooManyPointsModalContainer'))

const AdminLayout = lazy(() => import('./layouts/AdminLayout/AdminLayout'))
const DownloadsLayout = lazy(() => import('./layouts/DownloadsLayout/DownloadsLayout'))

const store = configureStore()

const browserRouter = createBrowserRouter([
  {
    path: routes.HOME,
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
        path: `${routes.SEARCH}/*`,
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
        path: routes.PROJECT,
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
        path: routes.PROJECTS,
        element: (
          <AuthRequiredContainer>
            <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
              <Projects />
            </Suspense>
          </AuthRequiredContainer>
        )
      },
      {
        path: routes.DOWNLOADS,
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
            path: `${routes.DOWNLOADS}/:id`,
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
        path: routes.CONTACT_INFO,
        element: (
          <AuthRequiredContainer>
            <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
              <ContactInfo />
            </Suspense>
          </AuthRequiredContainer>
        )
      },
      {
        path: routes.PREFERENCES,
        element: (
          <AuthRequiredContainer>
            <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
              <Preferences />
            </Suspense>
          </AuthRequiredContainer>
        )
      },
      {
        path: routes.SUBSCRIPTIONS,
        element: (
          <AuthRequiredContainer>
            <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
              <Subscriptions />
            </Suspense>
          </AuthRequiredContainer>
        )
      },
      {
        path: routes.EARTHDATA_DOWNLOAD_CALLBACK,
        element: (
          <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
            <EarthdataDownloadRedirect />
          </Suspense>
        )
      },
      {
        path: routes.ADMIN,
        element: (
          <AuthRequiredContainer>
            <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
              <AdminLayout />
            </Suspense>
          </AuthRequiredContainer>
        ),
        children: [
          {
            index: true,
            async lazy() {
              const Admin = await import('./components/AdminIndex/AdminIndex')

              return {
                Component: Admin.default
              }
            }
          },
          {
            path: routes.ADMIN_RETRIEVALS,
            async lazy() {
              const AdminRetrievals = await import('./components/AdminRetrievals/AdminRetrievals')

              return {
                Component: AdminRetrievals.default
              }
            }
          },
          {
            path: `${routes.ADMIN_RETRIEVALS}/:obfuscatedId`,
            async lazy() {
              const AdminRetrieval = await import('./components/AdminRetrieval/AdminRetrieval')

              return {
                Component: AdminRetrieval.default
              }
            }
          },
          {
            path: routes.ADMIN_PROJECTS,
            async lazy() {
              const AdminProjects = await import('./components/AdminProjects/AdminProjects')

              return {
                Component: AdminProjects.default
              }
            }
          },
          {
            path: `${routes.ADMIN_PROJECTS}/:obfuscatedId`,
            async lazy() {
              const AdminProject = await import('./components/AdminProject/AdminProject')

              return {
                Component: AdminProject.default
              }
            }
          },
          {
            path: routes.ADMIN_RETRIEVAL_METRICS,
            async lazy() {
              const AdminRetrievalsMetrics = await import('./components/AdminRetrievalsMetrics/AdminRetrievalsMetrics')

              return {
                Component: AdminRetrievalsMetrics.default
              }
            }
          },
          {
            path: routes.ADMIN_PREFERENCES_METRICS,
            async lazy() {
              const AdminPreferencesMetrics = await import('./components/AdminPreferencesMetrics/AdminPreferencesMetrics')

              return {
                Component: AdminPreferencesMetrics.default
              }
            }
          }
        ]
      }
    ]
  },
  {
    path: routes.AUTH_CALLBACK,
    element: (
      <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--small" />}>
        <AuthCallbackContainer />
      </Suspense>
    )
  },
  {
    path: '*',
    element: <NotFound />
  }
])

routerHelper.router = browserRouter

// Create the root App component
const App = () => {
  const { edscHost } = getEnvironmentConfig()
  const { env } = getApplicationConfig()
  const title = 'Earthdata Search'
  const description = 'Search, discover, visualize, refine, and access NASA Earth Observation data in your browser with Earthdata Search'
  const url = `${edscHost}/search`
  const titleEnv = env.toUpperCase() === 'PROD' ? '' : `[${env.toUpperCase()}]`

  useEffect(() => {
    // Remove the loading class from the root element once the app has loaded
    document.getElementById('root').classList.remove('root--loading')
  }, [])

  return (
    <ErrorBoundary>
      <EmergencyNotification />
      <Provider store={store}>
        <GraphQlProvider>
          <ToastProvider ref={window.reactToastProvider}>
            <Helmet
              defaultTitle="Earthdata Search"
              titleTemplate={`${titleEnv} %s - Earthdata Search`}
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
            <RouterProvider router={browserRouter} />
          </ToastProvider>
        </GraphQlProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
