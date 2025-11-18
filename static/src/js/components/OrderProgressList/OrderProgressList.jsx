import React from 'react'
import PropTypes from 'prop-types'

import OrderProgressItem from './OrderProgressItem'

import './OrderProgressList.scss'

export const OrderProgressList = ({
  retrievalOrders
}) => (
  <ul className="order-progress-list">
    {
      retrievalOrders.map((retrievalOrder) => {
        const { orderNumber } = retrievalOrder

        if (orderNumber == null) return null

        return (
          <OrderProgressItem
            key={orderNumber}
            retrievalOrder={retrievalOrder}
          />
        )
      })
    }
  </ul>
)

OrderProgressList.propTypes = {
  retrievalOrders: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired
}

export default OrderProgressList
