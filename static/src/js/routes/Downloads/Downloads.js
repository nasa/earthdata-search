import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Link,
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import actions from '../../actions/index'

import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
import OrderStatusContainer from '../../containers/OrderStatusContainer/OrderStatusContainer'
import CollectionContainer from '../../containers/CollectionContainer/CollectionContainer'


const mapStateToProps = state => ({
  retrieval: state.retrieval
})

const mapDispatchToProps = dispatch => ({
  onChangePath:
    path => dispatch(actions.changePath(path))
})

export const Downloads = ({
  retrieval = {},
  onChangePath
}) => {
  const { jsondata = {} } = retrieval
  const { source } = jsondata
  return (
    <Switch>
      <Route exact path="/downloads/:retrieval_id">
        <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
          <div className="route-wrapper__content">
            <header className="route-wrapper__header">
              <SecondaryToolbarContainer />
            </header>
            <nav className="route-wrapper__content-nav">
              <Link
                className="route-wrapper__content-nav-link"
                to={{
                  pathname: '/projects',
                  search: source
                }}
                onClick={() => { onChangePath(`/projects/${source}`) }}
              >
                <i className="fa fa-arrow-circle-o-left" />
                {' Back to Project'}
              </Link>
            </nav>
            <div className="route-wrapper__content-inner">
              <OrderStatusContainer />
            </div>
          </div>
        </div>
      </Route>

      <Route path="/downloads/:retrieval_id/collections/:id">
        <div className="route-wrapper route-wrapper--collections route-wrapper--light route-wrapper--content-page">
          <div className="route-wrapper__content">
            <CollectionContainer />
          </div>
        </div>
      </Route>
    </Switch>
  )
}

Downloads.propTypes = {
  onChangePath: PropTypes.func.isRequired,
  retrieval: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Downloads)
)
