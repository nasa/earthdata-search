import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { metricsRelatedCollection } from '../../middleware/metrics/actions'

import OrderStatus from '../../components/OrderStatus/OrderStatus'

export const mapDispatchToProps = (dispatch) => ({
  onMetricsRelatedCollection:
    (data) => dispatch(metricsRelatedCollection(data))
})

export const OrderStatusContainer = ({
  onMetricsRelatedCollection
}) => (
  <OrderStatus
    onMetricsRelatedCollection={onMetricsRelatedCollection}
  />
)

OrderStatusContainer.propTypes = {
  onMetricsRelatedCollection: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(OrderStatusContainer)
