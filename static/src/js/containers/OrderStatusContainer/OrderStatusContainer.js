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
  fetchOrder:
    (orderId, authToken) => dispatch(actions.fetchOrder(orderId, authToken)),
  onChangePath:
    path => dispatch(actions.changePath(path)),
  onUpdateGranuleDownloadParams:
    params => dispatch(actions.setGranuleDownloadParams(params))
})

export const OrderStatusContainer = ({
  authToken,
  fetchOrder,
  match,
  onChangePath,
  onUpdateGranuleDownloadParams,
  order
}) => (
  <OrderStatus
    authToken={authToken}
    fetchOrder={fetchOrder}
    match={match}
    onChangePath={onChangePath}
    onUpdateGranuleDownloadParams={onUpdateGranuleDownloadParams}
    order={order}
  />
)

OrderStatusContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  fetchOrder: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onUpdateGranuleDownloadParams: PropTypes.func.isRequired,
  order: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OrderStatusContainer)
)
