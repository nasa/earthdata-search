import React from 'react'
import PropTypes from 'prop-types'
import { partition } from 'lodash'

import Spinner from '../Spinner/Spinner'
import SubscriptionsListTable from './SubscriptionsListTable'

import './SubscriptionsList.scss'

/**
 * Renders the logged in users' subscription list
 */
export const SubscriptionsList = ({
  subscriptions = {},
  onDeleteSubscription,
  onFocusedCollectionChange
}) => {
  const {
    byId: subscriptionsById,
    isLoading,
    isLoaded
  } = subscriptions

  const subscriptionsMetadata = Object.values(subscriptionsById)
  const [collectionSubsciptions, granuleSubscriptions] = partition(subscriptionsMetadata, (metadata) => metadata.type === 'collection')

  return (
    <>
      <h2 className="route-wrapper__page-heading">Subscriptions</h2>
      {
        (isLoading && !isLoaded) && (
          <Spinner
            className="subscriptions-list__spinner"
            type="dots"
            color="gray"
            size="small"
          />
        )
      }

      {
        isLoaded && (
          <>
            <div className="subscriptions-list__subscription-group">
              <h3 className="h4">Dataset Search Subscription</h3>
              <p>Receive notifications when new datasets are added that match your search query.</p>
              <SubscriptionsListTable
                subscriptionsMetadata={collectionSubsciptions}
                subscriptionType="collection"
                onDeleteSubscription={onDeleteSubscription}
                onFocusedCollectionChange={onFocusedCollectionChange}
              />
            </div>
            <div className="subscriptions-list__subscription-group">
              <h3 className="h4">Granule Subscription</h3>
              <p>Receive notifications when new data are added to a dataset.</p>
              <SubscriptionsListTable
                subscriptionsMetadata={granuleSubscriptions}
                subscriptionType="granule"
                onDeleteSubscription={onDeleteSubscription}
                onFocusedCollectionChange={onFocusedCollectionChange}
              />
            </div>
          </>
        )
      }
    </>
  )
}

SubscriptionsList.propTypes = {
  subscriptions: PropTypes.shape({}).isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default SubscriptionsList
