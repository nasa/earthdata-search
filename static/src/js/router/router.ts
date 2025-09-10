export type Router = {
  /** Function to navigate to a new path */
  navigate: (path: string) => void
  /** Current state of the router */
  state: {
    /** Current page location */
    location: {
      /** A URL pathname, beginning with a /. */
      pathname: string
      /** A URL query string, beginning with a ?. */
      search: string
    }
  },
  /** Subscribe to router.state updates */
  subscribe: (callback: (location: Location) => void) => () => void
}

/**
 * This helper object will hold the React Router instance. This is set in App.jsx after
 * the router is initialized. We need this saved outside of React scope because we need
 * access to the current location and navigation functions outside of `useLocation` and
 * `useNavigation` hooks (like within Zustand or util functions).
 */
const routerHelper = {
  router: null
} as { router: Router | null }

export default routerHelper
