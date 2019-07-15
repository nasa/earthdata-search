import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import OrderStatus from '../../components/OrderStatus/OrderStatus'

const mapStateToProps = state => ({
  authToken: state.authToken,
  order: state.order
})

const mapDispatchToProps = dispatch => ({
  onFetchOrder:
    (orderId, authToken) => dispatch(actions.fetchOrder(orderId, authToken)),
  onChangePath:
    path => dispatch(actions.changePath(path))
})

export const OrderStatusContainer = ({
  authToken,
  match,
  onChangePath,
  onFetchOrder,
  order
}) => (
  <OrderStatus
    authToken={authToken}
    match={match}
    onChangePath={onChangePath}
    onFetchOrder={onFetchOrder}
    order={order}
  />
)

OrderStatusContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  onFetchOrder: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  order: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OrderStatusContainer)
)
