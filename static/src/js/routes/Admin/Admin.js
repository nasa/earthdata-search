import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
import AppLogoContainer from '../../containers/AppLogoContainer/AppLogoContainer'
import AdminRetrievalsContainer from '../../containers/AdminRetrievalsContainer/AdminRetrievalsContainer'
import AdminRetrievalContainer from '../../containers/AdminRetrievalContainer/AdminRetrievalContainer'

export const Admin = ({
  match
}) => {
  const { path } = match

  return (
    <Route path="admin">
      <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
        <div className="route-wrapper__content">
          <header className="route-wrapper__header">
            <div className="route-wrapper__header-primary">
              <AppLogoContainer />
              <SecondaryToolbarContainer />
            </div>
          </header>
          <div className="route-wrapper__content-inner">
            <h1>Admin</h1>
            <Switch>
              <Route exact path={`${path}/retrievals`} component={AdminRetrievalsContainer} />
              <Route exact path={`${path}/retrievals/:id`} component={AdminRetrievalContainer} />
            </Switch>
          </div>
        </div>
      </div>
    </Route>
  )
}

Admin.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(null, null)(Admin)
)
