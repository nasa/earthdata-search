import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import { metricsRelatedCollection } from '../../middleware/metrics/actions'

import OrderStatus from '../../components/OrderStatus/OrderStatus'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path)),
  onMetricsRelatedCollection:
    (data) => dispatch(metricsRelatedCollection(data))
})

export const OrderStatusContainer = ({
  onChangePath,
  onMetricsRelatedCollection
}) => (
  <OrderStatus
    onChangePath={onChangePath}
    onMetricsRelatedCollection={onMetricsRelatedCollection}
  />
)

OrderStatusContainer.propTypes = {
  onChangePath: PropTypes.func.isRequired,
  onMetricsRelatedCollection: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(OrderStatusContainer)
