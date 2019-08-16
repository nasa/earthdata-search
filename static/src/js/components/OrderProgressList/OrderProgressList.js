import React from 'react'
import PropTypes from 'prop-types'

import OrderProgressItem from './OrderProgressItem'

import './OrderProgressList.scss'

export const OrderProgressList = ({
  orders,
  totalNumber,
  totalProcessed
}) => (
  <ul className="order-progress-list">
    {
      orders.map(order => (
        <OrderProgressItem
          key={order.order_number}
          order={order}
          totalNumber={totalNumber}
          totalProcessed={totalProcessed}
        />
      ))
    }
  </ul>
)

OrderProgressList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  totalNumber: PropTypes.number.isRequired,
  totalProcessed: PropTypes.number.isRequired
}

export default OrderProgressList
