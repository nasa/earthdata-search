import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import actions from '../../actions/index'

import OrderStatusContainer from '../../containers/OrderStatusContainer/OrderStatusContainer'
import CollectionContainer from '../../containers/CollectionContainer/CollectionContainer'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import DownloadHistoryContainer from '../../containers/DownloadHistoryContainer/DownloadHistoryContainer'


const mapStateToProps = state => ({
  retrieval: state.retrieval
})

const mapDispatchToProps = dispatch => ({
  onChangePath:
    path => dispatch(actions.changePath(path))
})

export const Downloads = ({
  match,
  retrieval = {},
  onChangePath
}) => {
  const { jsondata = {} } = retrieval
  const { source } = jsondata

  const { path } = match

  return (
    <Switch>
      <Route path={`${path}/:retrieval_id/collections/:id`}>
        <div className="route-wrapper route-wrapper--collections route-wrapper--light route-wrapper--content-page">
          <div className="route-wrapper__content">
            <CollectionContainer />
          </div>
        </div>
      </Route>

      <Route path={`${path}`}>
        <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
          <div className="route-wrapper__content">
            <header className="route-wrapper__header">
              <div className="route-wrapper__header-secondary">
                <Switch>
                  <Route exact path={`${path}/:id`}>
                    <nav className="route-wrapper__content-nav">
                      <PortalLinkContainer
                        className="route-wrapper__content-nav-link"
                        to={{
                          pathname: '/projects',
                          search: source
                        }}
                        onClick={() => { onChangePath(`/projects/${source}`) }}
                      >
                        <i className="fa fa-arrow-circle-o-left" />
                        {' Back to Project'}
                      </PortalLinkContainer>
                    </nav>
                  </Route>
                </Switch>
              </div>
            </header>
            <div className="route-wrapper__content-inner">
              <Switch>
                <Route exact path={`${path}`} component={DownloadHistoryContainer} />
                <Route exact path={`${path}/:id`} component={OrderStatusContainer} />
              </Switch>
            </div>
          </div>
        </div>
      </Route>
    </Switch>
  )
}

Downloads.propTypes = {
  match: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  retrieval: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Downloads)
)
