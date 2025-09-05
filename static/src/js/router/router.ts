export type Router = {
  navigate: (path: string) => void
  state: {
    location: {
      pathname: string
      search: string
    }
  },
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
