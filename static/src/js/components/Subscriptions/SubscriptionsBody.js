import React from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import { isEqual } from 'lodash'

import Button from '../Button/Button'
import SubscriptionsListItem from './SubscriptionsListItem'

import { humanizedGranuleQueryMap } from '../../util/humanizedGranuleQueryMap'

import './SubscriptionsBody.scss'

export const SubscriptionsBody = ({
  granuleQueryString,
  onCreateSubscription,
  subscriptions
}) => {
  const currentQuery = parse(granuleQueryString)

  // TODO: Needs tests - EDSC-2923
  const exactlyMatchingGranuleQueries = subscriptions.filter((subscription) => {
    const { query } = subscription
    const parsedGranuleQuery = parse(query)

    return isEqual(currentQuery, parsedGranuleQuery)
  })

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
                    <i className="fa fa-bell subscriptions-body__query-exists-warning-icon" />
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
              icon="plus"
              onClick={() => onCreateSubscription()}
            >
              Create New Subscription
            </Button>
          </div>
        </div>
        <div className="subscriptions-body__row  subscriptions-body__row--list">

          <ul className="subscriptions-body__list">
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
}
SubscriptionsBody.propTypes = {
  granuleQueryString: PropTypes.string.isRequired,
  onCreateSubscription: PropTypes.func.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default SubscriptionsBody
