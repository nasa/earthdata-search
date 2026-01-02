import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import OrderStatus from '../../components/OrderStatus/OrderStatus'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path))
})

export const OrderStatusContainer = ({
  onChangePath
}) => (
  <OrderStatus
    onChangePath={onChangePath}
  />
)

OrderStatusContainer.propTypes = {
  onChangePath: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(OrderStatusContainer)
