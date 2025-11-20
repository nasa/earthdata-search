import React from 'react'
import PropTypes from 'prop-types'

import './OrderDropdownItem.scss'

const OrderDropdownItem = ({
  index,
  order,
  totalOrders
}) => {
  const {
    orderNumber: orderId,
    orderInformation
  } = order

  const {
    downloadUrls: currentDownloadUrlsObject = {}
  } = orderInformation
  const { downloadUrl: orderDownloadUrls = [] } = currentDownloadUrlsObject

  return (
    <li
      key={orderId}
      className="order-dropdown-item"
    >
      <h4 className="order-dropdown-item__title">
        {`Order ${index + 1}/${totalOrders} `}
        <span>{`Order ID: ${orderId}`}</span>
      </h4>
      <ul className="order-dropdown-item__list">
        {
          orderDownloadUrls.map((href) => (
            <li
              key={href}
              className="order-dropdown-item__list-item"
            >
              <a className="order-dropdown-item__link" href={href}>{href}</a>
            </li>
          ))
        }
      </ul>
    </li>
  )
}

OrderDropdownItem.propTypes = {
  index: PropTypes.number.isRequired,
  order: PropTypes.shape({
    orderNumber: PropTypes.string,
    orderInformation: PropTypes.shape({
      downloadUrls: PropTypes.shape({})
    })
  }).isRequired,
  totalOrders: PropTypes.number.isRequired
}

export default OrderDropdownItem
