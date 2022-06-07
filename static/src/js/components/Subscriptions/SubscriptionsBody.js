import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import { isEqual } from 'lodash'
import { FaBell } from 'react-icons/fa'
import { Form } from 'react-bootstrap'
import snakecaseKeys from 'snakecase-keys'

import { collectionRequestNonIndexedCmrKeys, granuleRequestNonIndexedCmrKeys } from '../../../../../sharedConstants/nonIndexedCmrKeys'
import { prepKeysForCmr } from '../../../../../sharedUtils/prepKeysForCmr'
import { humanizedQueryKeysMap } from '../../util/humanizedQueryKeysMap'
import { humanizedQueryValueFormattingMap } from '../../util/humanizedQueryValueFormattingMap'
import { queryToHumanizedList } from '../../util/queryToHumanizedList'

import Button from '../Button/Button'
import SubscriptionsListItem from './SubscriptionsListItem'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import EmptyListItem from '../EmptyListItem/EmptyListItem'

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
  query,
  subscriptions,
  subscriptionType,
  onCreateSubscription,
  onDeleteSubscription,
  onUpdateSubscription
}) => {
  const [submittingNewSubscription, setSubmittingNewSubscription] = useState(false)
  const [name, setName] = useState('New Subscription')

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

  const hasExactlyMatchingGranuleQuery = exactlyMatchingSubscriptionQueries.length > 0

  const humanReadableQueryList = queryToHumanizedList(query, subscriptionType)

  const hierarcicalKeys = [
    'dataCenterH',
    'granuleDataFormatH',
    'horizontalDataResolutionRange',
    'instrumentH',
    'latency',
    'platformsH',
    'processingLevelIdH',
    'projectH',
    'scienceKeywordsH',
    'tilingSystem',
    'twoDCoordinateSystemName'
  ]

  const buildHumanizedQueryDisplay = (key, value) => {
    // Display temporal items
    if ([
      'temporal',
      'temporalString'
    ].includes(key)) {
      const [start, end] = value
      return (
        <div>
          {start && <div>{`Start: ${start}`}</div>}
          {end && <div>{`End: ${end}`}</div>}
        </div>
      )
    }
    // Display spatial items that have an unknown number of points
    if ([
      'line',
      'point',
      'polygon'
    ].includes(key)) {
      return (
        <div>
          {
            value.map(
              // Display the coordinates like [[1, 1], [2, 2], ...]
              (coordinates) => (
                coordinates.map(
                  (coordinate) => (
                    `[${coordinate.join(', ')}]`
                  )
                ).join(', ')
              )
            ).join(', ')
          }
        </div>
      )
    }
    // Display bounding box
    if (key === 'boundingBox') {
      return (
        <div>
          {value.map(
            (boundingBox) => {
              const [sw, ne] = boundingBox
              return (
                <React.Fragment key={boundingBox}>
                  <div>{`SW: ${sw.join(', ')}`}</div>
                  <div>{`NE: ${ne.join(', ')}`}</div>
                </React.Fragment>
              )
            }
          )}
        </div>
      )
    }
    // Display circle
    if (key === 'circle') {
      return (
        <div>
          {value.map(
            (circle) => {
              const [x, y, radius] = circle
              return (
                <React.Fragment key={circle}>
                  <div>{`Center: ${x}, ${y}`}</div>
                  <div>{`Radius (m): ${radius}`}</div>
                </React.Fragment>
              )
            }
          )}
        </div>
      )
    }
    // Display hierarchical facets
    if (hierarcicalKeys.includes(key)) {
      return (
        <div>
          {value.map((hierarchy) => (
            <div key={hierarchy}>
              {hierarchy.join(' > ')}
            </div>
          ))}
        </div>
      )
    }
    return null
  }

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
                  <h4 className="h5">Create a new subscription</h4>
                  <Form.Group className="subscriptions-body__form-group subscriptions-body__form-group--coords">
                    <Form.Label>
                      Name
                    </Form.Label>
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
                  </Form.Group>
                  <h4 className="subscriptions-body__query-list-heading">{`${humanReadableQueryList.length} filters applied`}</h4>
                  <ul className="subscriptions-body__query-list">
                    {
                      humanReadableQueryList.map(([key, value]) => (
                        <li key={key} className="subscriptions-body__query-list-item">
                          <span className="subscriptions-body__query-list-item-heading">
                            {humanizedQueryKeysMap[key] || key}
                          </span>
                          {
                            // If the values have been humanized, the will exist in this array
                            Object.keys(humanizedQueryValueFormattingMap).includes(key)
                              ? buildHumanizedQueryDisplay(key, value)
                              : (
                                // If the vaules do not exist in the humanized map, the will be displayed here. As a fallback
                                // JSON stringify non-string values
                                <span
                                  className="subscriptions-body__query-list-item-value"
                                  title={typeof value === 'string' ? value : JSON.stringify(value)}
                                >
                                  {typeof value === 'string' ? value : JSON.stringify(value)}
                                </span>
                              )
                          }
                        </li>
                      ))
                    }
                  </ul>
                  {
                    exactlyMatchingSubscriptionQueries.length > 0 && (
                      <p className="subscriptions-body__query-exists-warning">
                        <EDSCIcon className="subscriptions-body__query-exists-warning-icon" icon={FaBell} />
                        {
                          exactlyMatchingSubscriptionQueries.map((exactlyMatchingQuery) => {
                            const { conceptId, name } = exactlyMatchingQuery
                            return (
                              <div key={conceptId}>
                                The subscription named
                                {' '}
                                <strong>{name}</strong>
                                {' '}
                                matches the current search query.
                                {' '}
                                Change the current search query to create a new subscription.
                              </div>
                            )
                          })
                        }
                      </p>
                    )
                  }
                  <Button
                    className="subscriptions-body__create-button"
                    disabled={exactlyMatchingSubscriptionQueries.length > 0}
                    bootstrapVariant="primary"
                    label="Subscribe"
                    spinner={submittingNewSubscription}
                    onClick={async () => {
                      setSubmittingNewSubscription(true)
                      await onCreateSubscription(name, subscriptionType)
                      setSubmittingNewSubscription(false)
                    }}
                  >
                    Subscribe
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
  query: PropTypes.shape({}).isRequired,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  subscriptionType: PropTypes.string.isRequired,
  onCreateSubscription: PropTypes.func.isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onUpdateSubscription: PropTypes.func.isRequired
}

export default SubscriptionsBody
