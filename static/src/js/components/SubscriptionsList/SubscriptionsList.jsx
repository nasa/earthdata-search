import React from 'react'
import { partition } from 'lodash-es'
import { useQuery } from '@apollo/client'

import Spinner from '../Spinner/Spinner'
import SubscriptionsListTable from './SubscriptionsListTable'

import SUBSCRIPTIONS from '../../operations/queries/subscriptions'

import useEdscStore from '../../zustand/useEdscStore'
import { getUsername } from '../../zustand/selectors/user'

import { apolloClientNames } from '../../constants/apolloClientNames'

import './SubscriptionsList.scss'

/**
 * Renders the logged in users' subscription list
 */
const SubscriptionsList = () => {
  const username = useEdscStore(getUsername)

  const { data, loading } = useQuery(SUBSCRIPTIONS, {
    variables: {
      params: {
        subscriberId: username
      }
    },
    context: {
      clientName: apolloClientNames.CMR_GRAPHQL
    }
  })

  const { subscriptions } = data || {}
  const { items = [] } = subscriptions || {}
  const [collectionSubsciptions, granuleSubscriptions] = partition(items, (metadata) => metadata.type === 'collection')

  return (
    <>
      <h2 className="route-wrapper__page-heading">Subscriptions</h2>
      {
        (loading) && (
          <Spinner
            className="subscriptions-list__spinner"
            type="dots"
            color="gray"
            size="small"
          />
        )
      }

      {
        data && (
          <>
            <div className="subscriptions-list__subscription-group">
              <h3 className="h4">Dataset Search Subscription</h3>
              <p>Receive notifications when new datasets are added that match your search query.</p>
              <SubscriptionsListTable
                subscriptionsMetadata={collectionSubsciptions}
                subscriptionType="collection"
              />
            </div>
            <div className="subscriptions-list__subscription-group">
              <h3 className="h4">Granule Subscription</h3>
              <p>Receive notifications when new data are added to a dataset.</p>
              <SubscriptionsListTable
                subscriptionsMetadata={granuleSubscriptions}
                subscriptionType="granule"
              />
            </div>
          </>
        )
      }
    </>
  )
}

export default SubscriptionsList
