import React from 'react'
import { Route, Switch } from 'react-router-dom'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './AppLogo.scss'

const AppLogo = () => (
  <nav className="app-logo">
    <span className="app-logo__site-logo">
      <h1 className="mb-0">
        <PortalLinkContainer
          className="app-logo__site-meatball"
          title="Earthdata Search Home"
          to={
            {
              pathname: '/search'
            }
          }
          updatePath
        >
          <span className="visually-hidden">
            Earthdata Search
          </span>
        </PortalLinkContainer>
      </h1>
      <PortalLinkContainer
        className="app-logo__site-name"
        to={
          {
            pathname: '/search'
          }
        }
        updatePath
      >
        <span className="app-logo__site-name-ent app-logo__site-name-ent--e">Earthdata</span>
        <span className="app-logo__site-name-ent app-logo__site-name-ent--s">Search</span>
      </PortalLinkContainer>
    </span>
    {/* {TODO: this is always getting rendered by the app.ks} */}
    <Switch>
      <Route path="/admin">
        <PortalLinkContainer
          className="app-logo__header-site-area-link"
          to="/admin"
        >
          <h2 className="app-logo__header-site-area-title">Admin</h2>
        </PortalLinkContainer>
      </Route>
    </Switch>
  </nav>
)

export default AppLogo
