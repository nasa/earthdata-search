import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import { isEqual } from 'lodash'
import { FaBell, FaPlus } from 'react-icons/fa'

import Button from '../Button/Button'
import SubscriptionsListItem from './SubscriptionsListItem'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import EmptyListItem from '../EmptyListItem/EmptyListItem'

import { humanizedGranuleQueryMap } from '../../util/humanizedGranuleQueryMap'

import './SubscriptionsBody.scss'

/**
 * Renders SubscriptionsBody.
 * @param {Node} granuleQueryString - String representing the current granule query string.
 * @param {String} onCreateSubscription - Callback to create a subscription.
 * @param {String} onDeleteSubscription - Callback to delete a subscription.
 * @param {String} onUpdateSubscription - Callback to update a subscription.
 * @param {Array} subscriptions - An array of subscriptions.
 */
export const SubscriptionsBody = ({
  granuleQueryString,
  onCreateSubscription,
  onDeleteSubscription,
  onUpdateSubscription,
  subscriptions
}) => {
  const currentQuery = parse(granuleQueryString)

  const [submittingNewSubscription, setSubmittingNewSubscription] = useState(false)

  // TODO: Needs tests - EDSC-2923
  const exactlyMatchingGranuleQueries = subscriptions.filter((subscription) => {
    const { query } = subscription
    const parsedGranuleQuery = parse(query)

    return isEqual(currentQuery, parsedGranuleQuery)
  })

  const hasExactlyMatchingGranuleQuery = exactlyMatchingGranuleQueries.length > 0

  return (
    <div className="subscriptions-body">
      <div className="subscriptions-body__content">
        <div className="row subscriptions-body__row subscriptions-body__row--intro">
          <div className="col col-12">
            <p className="subscriptions-body__intro-text">
              Subscribe to be notified by email when new data matching your search query becomes available for this collection.
            </p>
            <div className="subscriptions-body__query">
              <div className="subscriptions-body__query-primary">
                <h4 className="subscriptions-body__query-list-heading">Current Query Parameters</h4>
                <ul className="subscriptions-body__query-list">
                  {
                    Object.keys(currentQuery).map((key) => {
                      const humanizedKey = humanizedGranuleQueryMap[key]

                      return (
                        <li key={key} className="subscriptions-body__query-list-item">
                          <span className="subscriptions-body__query-list-item-heading">
                            {humanizedKey}
                            {': '}
                          </span>
                          <span
                            title={JSON.stringify(currentQuery[key])}
                            className="subscriptions-body__query-list-item-value"
                          >
                            {JSON.stringify(currentQuery[key])}
                          </span>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
              {
                exactlyMatchingGranuleQueries.length > 0 && (
                  <p className="subscriptions-body__query-exists-warning">
                    <EDSCIcon className="subscriptions-body__query-exists-warning-icon" icon={FaBell} />
                    {' You’re subscribed to be notified when data matching the current search query becomes available.'}
                  </p>
                )
              }
            </div>
            <Button
              className="subscriptions-body__create-button"
              disabled={exactlyMatchingGranuleQueries.length > 0}
              bootstrapVariant="primary"
              label="Create New Subscription"
              icon={FaPlus}
              spinner={submittingNewSubscription}
              onClick={async () => {
                setSubmittingNewSubscription(true)
                await onCreateSubscription()
                setSubmittingNewSubscription(false)
              }}
            >
              Create New Subscription
            </Button>
          </div>
        </div>
        <div className="subscriptions-body__row  subscriptions-body__row--list">
          <ul className="subscriptions-body__list">
            {
              subscriptions.map((subscription) => {
                const {
                  conceptId
                } = subscription

                return (
                  <SubscriptionsListItem
                    key={conceptId}
                    subscription={subscription}
                    onUpdateSubscription={onUpdateSubscription}
                    onDeleteSubscription={onDeleteSubscription}
                    hasExactlyMatchingGranuleQuery={hasExactlyMatchingGranuleQuery}
                  />
                )
              })
            }
            {
              subscriptions.length === 0 && (
                <EmptyListItem>
                  {'No subscriptions exist for this collection. Use filters to define your query and '}
                  <Button
                    className="subscriptions-body__empty-list-item"
                    bootstrapVariant="link"
                    label="Create New Subscription"
                    variant="link"
                    onClick={() => onCreateSubscription()}
                  >
                    create a new subscription
                  </Button>
                  {' to be notified when new data becomes available.'}
                </EmptyListItem>
              )
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
SubscriptionsBody.propTypes = {
  granuleQueryString: PropTypes.string.isRequired,
  onCreateSubscription: PropTypes.func.isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onUpdateSubscription: PropTypes.func.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default SubscriptionsBody
