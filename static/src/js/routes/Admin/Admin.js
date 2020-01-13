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

const mapStateToProps = state => ({
  isAuthorized: state.admin.isAuthorized
})

export class Admin extends Component {
  componentDidMount() {
    const { onAdminIsAuthorized } = this.props
    onAdminIsAuthorized()
  }

  render() {
    const { isAuthorized, match } = this.props

    if (!isAuthorized) return null

    const { path } = match

    return (
      <Route path={`${path}`}>
        <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
          <div className="route-wrapper__content">
            <header className="route-wrapper__header">
              <div className="route-wrapper__header-primary">
                <AppLogoContainer />
                <PortalLinkContainer
                  className="route-wrapper__header-site-area-link"
                  to="/admin"
                >
                  <h2 className="route-wrapper__header-site-area-title">Admin</h2>
                </PortalLinkContainer>
                <SecondaryToolbarContainer />
              </div>
            </header>
            <div className="route-wrapper__content-inner">
              <Switch>
                <Route exact path={`${path}`}>
                  <PortalLinkContainer
                    to="/admin/retrievals"
                  >
                    View Retrievals
                  </PortalLinkContainer>
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
  isAuthorized: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  onAdminIsAuthorized: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Admin)
)
