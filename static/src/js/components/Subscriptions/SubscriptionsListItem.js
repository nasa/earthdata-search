import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'

import './SubscriptionsListItem.scss'

export const SubscriptionsListItem = ({
  subscription
}) => {
  const { name, query } = subscription

  const decodedQuery = decodeURIComponent(query)

  return (
    <li className="subscriptions-list-item">
      <div>
        <h4 className="subscriptions-list-item__name">{name}</h4>
        <span className="subscriptions-list-item__query">{decodedQuery}</span>
      </div>
      <div className="subscriptions-list-item__actions">
        <Button
          className="subscriptions-list-item__action"
          bootstrapVariant="light"
          bootstrapSize="sm"
          disabled
          label="Edit Subscription"
          onClick={() => console.log('Edit clicked')}
        >
          Edit
        </Button>
        <Button
          className="subscriptions-list-item__action"
          bootstrapVariant="danger"
          bootstrapSize="sm"
          disabled
          label="Delete Subscription"
          onClick={() => console.log('Delete clicked')}
        >
          Delete
        </Button>
      </div>
    </li>
  )
}

SubscriptionsListItem.propTypes = {
  subscription: PropTypes.shape({}).isRequired
}

export default SubscriptionsListItem
