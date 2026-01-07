import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import {
  cloneDeep,
  merge,
  mergeWith
} from 'lodash-es'

import useEdscStore from '../static/src/js/zustand/useEdscStore'
import { EdscStore } from '../static/src/js/zustand/types'

/** Common props shared between types */
type SetupTestCommonProps = {
  /** Default Apollo Client mocks for the test */
  defaultApolloClientMocks?: MockedResponse[]
  /** Default router entries for the test */
  defaultRouterEntries?: string[]
  /** Default Zustand state for the test */
  defaultZustandState?: Record<string, unknown>
  /** Whether to include ApolloClient in the test setup */
  withApolloClient?: boolean
  /** Whether to include React Router in the test setup */
  withRouter?: boolean
}

/** For use when you need to render a single component */
export type SetupTestPropsSingleComponent = {
  /** The component to be tested */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.FC<any>
  /** The components to be tested by route path */
  ComponentsByRoute?: undefined
  /** Default props to be passed to the component */
  defaultProps?: Record<string, unknown>
  /** Default props to be passed to the component by the route path */
  defaultPropsByRoute?: undefined
} & SetupTestCommonProps

/** For use when you need to render multiple routes */
export type SetupTestPropsComponentsByRoute = {
  /** The component to be tested */
  Component?: undefined
  /** The components to be tested by route path */
  ComponentsByRoute: Record<string, unknown>
  /** Default props to be passed to the component */
  defaultProps?: undefined
  /** Default props to be passed to the component by the route path */
  defaultPropsByRoute?: Record<string, Record<string, unknown>>
} & SetupTestCommonProps

/** Type for the overrides to be applied to the test setup */
export type SetupTestOverrides = {
  /** Override Apollo Client state for the test */
  overrideApolloClientMocks?: MockedResponse[]
  /** Override router entries for the test */
  overrideRouterEntries?: string[]
  /** Override props to be passed to the component */
  overrideProps?: Record<string, unknown>
  /** Override props to be passed to the component */
  overridePropsByRoute?: Record<string, Record<string, unknown>>
  /** Override Zustand state for the test */
  overrideZustandState?: Record<string, unknown>
}

/** Type for the return value of the setupTest function */
export type SetupTestReturnType = {
  /** Props passed to the component */
  props: Record<string, unknown>
  /** Function to rerender the component */
  rerender: (ui: React.ReactElement) => void
  /** Function to unmount the component */
  unmount: () => void
  /** User event object for simulating user interactions */
  user: ReturnType<typeof userEvent.setup>
  /** Zustand state after the test setup */
  zustandState: EdscStore
}

const setupTest = ({
  Component,
  ComponentsByRoute,
  defaultApolloClientMocks = [],
  defaultProps = {},
  defaultPropsByRoute = {},
  defaultRouterEntries,
  defaultZustandState,
  withRouter = false,
  withApolloClient = false
}: SetupTestPropsSingleComponent | SetupTestPropsComponentsByRoute) => ({
  overrideApolloClientMocks = [],
  overrideRouterEntries,
  overrideProps = {},
  overridePropsByRoute = {},
  overrideZustandState
}: SetupTestOverrides = {}): SetupTestReturnType => {
  const user = userEvent.setup()

  let props = {
    ...defaultProps,
    ...overrideProps
  }

  // Get the initial Zustand state
  let zustandState = cloneDeep(useEdscStore.getInitialState())

  // Merge the Zustand state with the initial state if available
  if (defaultZustandState) {
    zustandState = merge(zustandState, defaultZustandState)
  }

  // Merge the Zustand state with the override Zustand state if available
  if (overrideZustandState) {
    // eslint-disable-next-line consistent-return
    zustandState = mergeWith(zustandState, overrideZustandState, (objValue, srcValue) => {
      // If the value is an array, only take the override array
      if (Array.isArray(objValue)) {
        return srcValue
      }
    })
  }

  // Set the Zustand state
  useEdscStore.setState(zustandState, true)

  let RenderedComponent = Component ? (<Component {...props} />) : null

  // If withRouter is true, wrap the component with the MemoryRouter
  if (withRouter) {
    const initialEntries = overrideRouterEntries || defaultRouterEntries

    // If ComponentsByRoute is provided, render the components by route
    if (ComponentsByRoute) {
      RenderedComponent = (
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            {
              Object.keys(ComponentsByRoute).map((route) => {
                const ComponentByRoute = ComponentsByRoute[route] as React.FC

                const defaultPropsForRoute = defaultPropsByRoute[route] || {}
                const overridePropsForRoute = overridePropsByRoute[route] || {}

                props = {
                  ...defaultPropsForRoute,
                  ...overridePropsForRoute
                }

                return (
                  <Route
                    key={route}
                    path={route}
                    element={typeof ComponentByRoute === 'function' ? <ComponentByRoute {...props} /> : ComponentByRoute}
                  />
                )
              })
            }
          </Routes>
        </MemoryRouter>
      )
    }

    // If Component is provided, render the component within the MemoryRouter
    if (Component) {
      // eslint-disable-next-line react/display-name
      RenderedComponent = (
        <MemoryRouter initialEntries={initialEntries}>
          {RenderedComponent}
        </MemoryRouter>
      )
    }
  }

  if (withApolloClient) {
    const apolloClientMocks = overrideApolloClientMocks.length > 0
      ? overrideApolloClientMocks
      : defaultApolloClientMocks

    RenderedComponent = (
      <MockedProvider mocks={apolloClientMocks} addTypename={false}>
        {RenderedComponent}
      </MockedProvider>
    )
  }

  const { rerender, unmount } = render(RenderedComponent as React.ReactElement)

  return {
    props,
    rerender,
    unmount,
    user,
    zustandState: useEdscStore.getState()
  }
}

export default setupTest
