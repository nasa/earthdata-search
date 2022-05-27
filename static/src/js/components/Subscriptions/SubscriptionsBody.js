import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import { isEqual } from 'lodash'
import { FaBell, FaPlus } from 'react-icons/fa'
import { Col, Form, Row } from 'react-bootstrap'

import Button from '../Button/Button'
import SubscriptionsListItem from './SubscriptionsListItem'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import EmptyListItem from '../EmptyListItem/EmptyListItem'

import { humanizedGranuleQueryMap } from '../../util/humanizedGranuleQueryMap'

import './SubscriptionsBody.scss'

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
  queryString,
  subscriptions,
  subscriptionType,
  onCreateSubscription,
  onDeleteSubscription,
  onUpdateSubscription
}) => {
  const currentQuery = parse(queryString)

  const [submittingNewSubscription, setSubmittingNewSubscription] = useState(false)
  const [name, setName] = useState(null)

  const onChangeName = (event) => {
    const { target } = event
    const { value = '' } = target

    setName(value)
  }

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
              { /* eslint-disable-next-line max-len */}
              Subscribe to be notified by email when new data matching your search query becomes available.
            </p>
            <div>
              <Form.Row className="subscriptions-body__form-row">
                <Form.Group as={Row} className="subscriptions-body__form-group subscriptions-body__form-group--coords">
                  <Form.Label srOnly>
                    Coordinates:
                  </Form.Label>
                  <Col
                    className="subscriptions-body__form-column"
                  >
                    <Form.Control
                      className="subscriptions-body__text-input"
                      data-test-id="subscriptions-body_point"
                      type="text"
                      placeholder="Subscription Name"
                      value={name}
                      onChange={onChangeName}
                      onBlur={onChangeName}
                      onKeyUp={onChangeName}
                    />
                  </Col>
                </Form.Group>
              </Form.Row>
            </div>
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
                await onCreateSubscription(name, subscriptionType)
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
                    subscriptionType={subscriptionType}
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
                    onClick={() => onCreateSubscription(name, subscriptionType)}
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
  queryString: PropTypes.string.isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  subscriptionType: PropTypes.string.isRequired,
  onCreateSubscription: PropTypes.func.isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onUpdateSubscription: PropTypes.func.isRequired
}

export default SubscriptionsBody
