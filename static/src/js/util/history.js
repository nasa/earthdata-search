import { createBrowserHistory } from 'history'

// Get the browser history
const history = createBrowserHistory()

history.listen((location, action) => {
  // Log the location and action to the console
  console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
  console.log(`The last navigation action was: ${action}`)
})

export default history
