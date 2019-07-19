import React from 'react'
import PropTypes from 'prop-types'

import OrderProgressItem from './OrderProgressItem'

import './OrderProgressList.scss'

export const OrderProgressList = ({
  orders
}) => (
  <ul className="order-progress-list">
    {
      orders.map(order => (
        <OrderProgressItem
          key={order.order_id}
          order={order}
        />
      ))
    }
  </ul>
)

OrderProgressList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired
}

export default OrderProgressList
