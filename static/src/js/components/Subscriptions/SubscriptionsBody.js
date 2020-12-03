import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'

import { SubscriptionsListItem } from './SubscriptionsListItem'

import './SubscriptionsBody.scss'

export const SubscriptionsBody = ({
  onCreateSubscription,
  subscriptions
}) => (
  <div className="subscriptions-body">
    <div className="subscriptions-body__content">
      <div className="row subscriptions-body__row subscriptions-body__row--intro">
        <div className="col col-12">
          <p className="subscriptions-body__intro-text">
            Subscribe to be notified by email when new data matching your search query becomes available for this collection.
          </p>
          <p className="subscriptions-body__query">
            Query: Spatial - SW: 21.21828,-12.21875 NE: 41.72986,27.42188
          </p>
          <Button
            className="subscriptions-body__create-button"
            bootstrapVariant="primary"
            label="Create Subscription"
            icon="plus"
            onClick={() => onCreateSubscription()}
          >
            Create Subscription
          </Button>
        </div>
      </div>
      <div className="row subscriptions-body__row">
        <ul className="col col-12 subscriptions-body__list">
          {
            subscriptions.map((subscription) => {
              const { conceptId } = subscription

              return (
                <SubscriptionsListItem key={conceptId} subscription={subscription} />
              )
            })
          }
        </ul>
      </div>
    </div>
  </div>
)

SubscriptionsBody.propTypes = {
  onCreateSubscription: PropTypes.func.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default SubscriptionsBody
