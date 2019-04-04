import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route, Redirect } from 'react-router-dom'

import store from './store/configureStore'
import history from './util/history'

import FooterContainer from './containers/FooterContainer/FooterContainer'

import Search from './routes/Search/Search'
import Project from './routes/Project/Project'
import ConnectedUrlQueryContainer from './containers/UrlQueryContainer/UrlQueryContainer'

// Create the root App component
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ConnectedUrlQueryContainer>
            <Helmet>
              <meta charSet="utf-8" />
              <title>Earthdata Search</title>
            </Helmet>
            <Switch>
              <Route exact path="/">
                <Redirect to="/search" />
              </Route>
              <Route path="/search">
                <Search />
              </Route>
              <Route path="/project">
                <Project />
              </Route>
            </Switch>
            <FooterContainer />
          </ConnectedUrlQueryContainer>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App
