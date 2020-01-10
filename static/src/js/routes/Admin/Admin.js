import React, { Component } from 'react'
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
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import actions from '../../actions'

const mapDispatchToProps = dispatch => ({
  onAdminIsAuthorized: () => dispatch(actions.adminIsAuthorized())
})

export class Admin extends Component {
  componentDidMount() {
    const { onAdminIsAuthorized } = this.props
    onAdminIsAuthorized()
  }

  render() {
    // TODO adminIsAuthorized needs to update the store when it is successful, then we need to conditionally render this route based on the state

    const { match } = this.props

    const { path } = match

    return (
      <Route path="admin">
        <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
          <div className="route-wrapper__content">
            <header className="route-wrapper__header">
              <div className="route-wrapper__header-primary">
                <AppLogoContainer />
                <h2 className="route-wrapper__header-site-area">Admin</h2>
                <SecondaryToolbarContainer />
              </div>
            </header>
            <div className="route-wrapper__content-inner">
              <Switch>
                <Route exact path={`${path}`}>
                  <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
                    <div className="route-wrapper__content">
                      <div className="route-wrapper__header-primary">
                        <PortalLinkContainer
                          to="/admin/retrievals"
                        >
                          View Retrievals
                        </PortalLinkContainer>
                      </div>
                    </div>
                  </div>
                </Route>
                <Route exact path={`${path}/retrievals`} component={AdminRetrievalsContainer} />
                <Route exact path={`${path}/retrievals/:id`} component={AdminRetrievalContainer} />
              </Switch>
            </div>
          </div>
        </div>
      </Route>
    )
  }
}

Admin.propTypes = {
  match: PropTypes.shape({}).isRequired,
  onAdminIsAuthorized: PropTypes.func.isRequired
}

export default withRouter(
  connect(null, mapDispatchToProps)(Admin)
)
