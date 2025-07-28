import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import AdminProjectContainer from '../../containers/AdminProjectContainer/AdminProjectContainer'
import AdminProjectsContainer from '../../containers/AdminProjectsContainer/AdminProjectsContainer'
import AdminRetrievalContainer from '../../containers/AdminRetrievalContainer/AdminRetrievalContainer'
import AdminRetrievalsContainer from '../../containers/AdminRetrievalsContainer/AdminRetrievalsContainer'
import AdminRetrievalsMetricsContainer from '../../containers/AdminRetrievalsMetricsContainer/AdminRetrievalsMetricsContainer'
import AdminPreferencesMetrics from '../../components/AdminPreferencesMetrics/AdminPreferencesMetrics'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import actions from '../../actions'

const mapDispatchToProps = (dispatch) => ({
  onAdminIsAuthorized: () => dispatch(actions.adminIsAuthorized())
})

const mapStateToProps = (state) => ({
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
            <div className="route-wrapper__content-inner">
              <Switch>
                <Route exact path={`${path}`}>
                  <PortalLinkContainer
                    to="/admin/retrievals"
                  >
                    View Retrievals
                  </PortalLinkContainer>
                  {' '}
                  |
                  {' '}
                  <PortalLinkContainer
                    to="/admin/projects"
                  >
                    View Projects
                  </PortalLinkContainer>
                  |
                  {' '}
                  <PortalLinkContainer
                    to="/admin/retrievals-metrics"
                  >
                    View Retrieval Metrics
                  </PortalLinkContainer>
                  |
                  {' '}
                  <PortalLinkContainer
                    to="/admin/preferences-metrics"
                  >
                    View Preferences Metrics
                  </PortalLinkContainer>
                </Route>
                <Route exact path={`${path}/retrievals`} component={AdminRetrievalsContainer} />
                <Route exact path={`${path}/retrievals/:id`} component={AdminRetrievalContainer} />
                <Route exact path={`${path}/projects`} component={AdminProjectsContainer} />
                <Route exact path={`${path}/projects/:id`} component={AdminProjectContainer} />
                <Route exact path={`${path}/retrievals-metrics`} component={AdminRetrievalsMetricsContainer} />
                <Route exact path={`${path}/preferences-metrics`} component={AdminPreferencesMetrics} />
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
  match: PropTypes.shape({
    path: PropTypes.string
  }).isRequired,
  onAdminIsAuthorized: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Admin)
)
