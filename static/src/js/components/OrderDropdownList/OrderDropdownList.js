import React from 'react'
import PropTypes from 'prop-types'

import OrderDropdownItem from './OrderDropdownItem'

import './OrderDropdownList.scss'

export const OrderDropdownList = ({
  orders,
  totalOrders
}) => (
  <ul className="order-dropdown-list">
    {
      orders.map((order, index) => {
        const { order_number: orderNumber } = order

        return (
          <OrderDropdownItem
            key={orderNumber}
            index={index}
            order={order}
            totalOrders={totalOrders}
          />
        )
      })
    }
  </ul>
)

OrderDropdownList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  totalOrders: PropTypes.number.isRequired
}

export default OrderDropdownList
