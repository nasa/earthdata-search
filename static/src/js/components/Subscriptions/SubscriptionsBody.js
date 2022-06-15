import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import { isEqual } from 'lodash'
import { FaBell, FaPlus } from 'react-icons/fa'
import { Form } from 'react-bootstrap'
import snakecaseKeys from 'snakecase-keys'

import { collectionRequestNonIndexedCmrKeys, granuleRequestNonIndexedCmrKeys } from '../../../../../sharedConstants/nonIndexedCmrKeys'
import { prepKeysForCmr } from '../../../../../sharedUtils/prepKeysForCmr'
import { queryToHumanizedList } from '../../util/queryToHumanizedList'

import Button from '../Button/Button'
import SubscriptionsListItem from './SubscriptionsListItem'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import EmptyListItem from '../EmptyListItem/EmptyListItem'
import SubscriptionsQueryList from '../SubscriptionsList/SubscriptionsQueryList'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './SubscriptionsBody.scss'
import pluralize from '../../util/pluralize'

/**
 * Renders SubscriptionsBody.
 * @param {Node} queryString - String representing the current query string.
 * @param {String} onCreateSubscription - Callback to create a subscription.
 * @param {String} onDeleteSubscription - Callback to delete a subscription.
 * @param {String} onUpdateSubscription - Callback to update a subscription.
 * @param {Array} subscriptions - An array of subscriptions.
 * @param {String} subscriptionType - The type of subscriptions to display, collection or granule.
 */
export const SubscriptionsBody = ({
  query,
  subscriptions,
  subscriptionType,
  onCreateSubscription,
  onDeleteSubscription,
  onUpdateSubscription
}) => {
  const [submittingNewSubscription, setSubmittingNewSubscription] = useState(false)
  const [name, setName] = useState()

  const onChangeName = (event) => {
    const { target } = event
    const { value = '' } = target

    setName(value)
  }

  // Compare the subscriptions returned for the user to the current query to prevent submission
  // of duplicate subscriptions
  const exactlyMatchingSubscriptionQueries = subscriptions.filter((subscription) => {
    let nonIndexedKeys
    const { query: subscriptionQuery } = subscription
    // The query returned for each subscription is returned as a string. To make a reliable comparison,
    // it is parsed into an object. Unneeded keys are trimmed from the current query with prepKeysForCmr,
    // which returns a string and is then parsed and snakecased to match the values returned by the CMR.

    if (subscriptionType === 'collection') nonIndexedKeys = collectionRequestNonIndexedCmrKeys
    if (subscriptionType === 'granule') nonIndexedKeys = granuleRequestNonIndexedCmrKeys

    return isEqual(
      parse(
        prepKeysForCmr(snakecaseKeys(query), nonIndexedKeys)
      ),
      parse(subscriptionQuery)
    )
  })

  let nullCmrQuery = {}

  if (subscriptionType === 'collection') {
    nullCmrQuery = {
      serviceType: [],
      tagKey: []
    }
  }

  console.log('query', query)
  console.log('hasNullCmrQuery', nullCmrQuery)

  const hasNullCmrQuery = isEqual(query, nullCmrQuery)
  const hasExactlyMatchingGranuleQuery = exactlyMatchingSubscriptionQueries.length > 0

  const humanReadableQueryList = queryToHumanizedList(query, subscriptionType)

  return (
    <div className="subscriptions-body">
      <div className="subscriptions-body__content">
        <div className="row subscriptions-body__row subscriptions-body__row--intro">
          <div className="col col-12">
            <p className="subscriptions-body__intro-text">
              { /* eslint-disable-next-line max-len */}
              Subscribe to be notified by email when new data matching your search query becomes available.
            </p>
            <div className="subscriptions-body__query">
              <Form>
                <div className="subscriptions-body__query-primary">
                  <h4 className="subscriptions-body__query-primary-heading h6">Create a new subscription</h4>
                  <Form.Group className="subscriptions-body__form-group subscriptions-body__form-group--coords">
                    <Form.Label className="mb-1">
                      Name
                    </Form.Label>
                    <Form.Control
                      className="subscriptions-body__text-input"
                      data-test-id="subscriptions-body_point"
                      type="text"
                      value={name}
                      onChange={onChangeName}
                      onBlur={onChangeName}
                      onKeyUp={onChangeName}
                    />
                  </Form.Group>
                  <h4 className="subscriptions-body__query-list-heading">{`${humanReadableQueryList.length} ${pluralize('filter', humanReadableQueryList.length)} applied`}</h4>
                  <SubscriptionsQueryList
                    displayEmptyMessage={false}
                    query={query}
                    subscriptionType={subscriptionType}
                  />
                  <div className="subscriptions-body__query-secondary">
                    {
                      (hasExactlyMatchingGranuleQuery || hasNullCmrQuery) && (
                        <p className="subscriptions-body__warning">
                          <EDSCIcon className="subscriptions-body__warning-icon" icon={FaBell} />
                          {
                            hasExactlyMatchingGranuleQuery
                            && exactlyMatchingSubscriptionQueries.map((exactlyMatchingQuery) => {
                              const { conceptId, name } = exactlyMatchingQuery
                              return (
                                <div key={conceptId}>
                                  The subscription
                                  {' '}
                                  <strong>{name}</strong>
                                  {' '}
                                  matches the current search query.
                                  {' '}
                                  Choose a different search query to create a new subscription.
                                </div>
                              )
                            })
                          }
                          {
                            hasNullCmrQuery && (
                              <div>
                                The current query is not currently supported.
                                {' '}
                                Add additional filters to create a new subscription.
                              </div>
                            )
                          }
                        </p>
                      )
                    }
                  </div>
                  <Button
                    className="subscriptions-body__create-button"
                    disabled={hasExactlyMatchingGranuleQuery || hasNullCmrQuery}
                    bootstrapVariant="primary"
                    label="Subscribe"
                    spinner={submittingNewSubscription}
                    icon={FaPlus}
                    onClick={async () => {
                      setSubmittingNewSubscription(true)
                      await onCreateSubscription(name, subscriptionType)
                      setSubmittingNewSubscription(false)
                    }}
                  >
                    Create Subscription
                  </Button>
                </div>
              </Form>
            </div>
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
                    subscriptionType={subscriptionType}
                    onUpdateSubscription={onUpdateSubscription}
                    onDeleteSubscription={onDeleteSubscription}
                    hasExactlyMatchingGranuleQuery={hasExactlyMatchingGranuleQuery}
                    hasNullCmrQuery={hasNullCmrQuery}
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
                    disabled={hasExactlyMatchingGranuleQuery || hasNullCmrQuery}
                    bootstrapVariant="link"
                    label="Create New Subscription"
                    variant="link"
                    onClick={() => onCreateSubscription(name, subscriptionType)}
                  >
                    create a new subscription
                  </Button>
                  {' to be notified when new data becomes available.'}
                </EmptyListItem>
              )
            }
          </ul>
          {
              subscriptions.length > 0 && (
                <div className="subscriptions-body__list-footer">
                  <PortalLinkContainer
                    className="subscriptions-body__view-all-subscriptions"
                    to="/subscriptions"
                    type="button"
                    bootstrapVariant="light"
                    label="View All Subscriptions"
                  >
                    View All Subscriptions
                  </PortalLinkContainer>
                </div>
              )
            }
        </div>
      </div>
    </div>
  )
}
SubscriptionsBody.propTypes = {
  query: PropTypes.shape({
    hasGranulesOrCwic: PropTypes.bool
  }).isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  subscriptionType: PropTypes.string.isRequired,
  onCreateSubscription: PropTypes.func.isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onUpdateSubscription: PropTypes.func.isRequired
}

export default SubscriptionsBody
