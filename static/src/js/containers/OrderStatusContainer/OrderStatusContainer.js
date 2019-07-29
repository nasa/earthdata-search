import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import OrderStatus from '../../components/OrderStatus/OrderStatus'

const mapStateToProps = state => ({
  authToken: state.authToken,
  retrieval: state.retrieval
})

const mapDispatchToProps = dispatch => ({
  onFetchRetrieval:
    (orderId, authToken) => dispatch(actions.fetchRetrieval(orderId, authToken)),
  onChangePath:
    path => dispatch(actions.changePath(path))
})

export const OrderStatusContainer = ({
  authToken,
  match,
  onChangePath,
  onFetchRetrieval,
  retrieval
}) => (
  <OrderStatus
    authToken={authToken}
    match={match}
    onChangePath={onChangePath}
    onFetchRetrieval={onFetchRetrieval}
    retrieval={retrieval}
  />
)

OrderStatusContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  onFetchRetrieval: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  retrieval: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OrderStatusContainer)
)
