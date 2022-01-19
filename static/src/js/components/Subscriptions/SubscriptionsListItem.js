import React from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import Button from '../Button/Button'

import { humanizedGranuleQueryMap } from '../../util/humanizedGranuleQueryMap'

import './SubscriptionsListItem.scss'

export const SubscriptionsListItem = ({
  hasExactlyMatchingGranuleQuery,
  subscription,
  onDeleteSubscription,
  onUpdateSubscription
}) => {
  const {
    collectionConceptId,
    name,
    nativeId,
    query,
    conceptId
  } = subscription

  const onHandleRemove = () => {
    // eslint-disable-next-line no-alert
    const confirmDeletion = window.confirm('Are you sure you want to remove this subscription? This action cannot be undone.')

    if (confirmDeletion) {
      onDeleteSubscription(conceptId, nativeId, collectionConceptId)
    }
  }

  const onHandleUpdate = () => {
    // eslint-disable-next-line no-alert
    const confirmUpdate = window.confirm('Are you sure you want to update this subscription with your current search parameters?')

    if (confirmUpdate) {
      onUpdateSubscription(conceptId, nativeId, name)
    }
  }

  // TODO: Needs tests - EDSC-2923
  const parsedQuery = parse(query)

  return (
    <li className="subscriptions-list-item">
      <div className="subscriptions-list-item__primary">
        <h4 className="subscriptions-list-item__name" title={name}>{name}</h4>
        <span className="subscriptions-list-item__query">
          <OverlayTrigger
            placement="top"
            overlay={(
              <Tooltip
                id={`tooltip__subscription-info__${conceptId}`}
                className="subscriptions-list-item__tooltip tooltip--wide"
              >
                <p className="subscriptions-list-item__tooltip-query-heading">Query Parameters</p>
                <ul className="subscriptions-list-item__tooltip-query-list">
                  {
                    Object.keys(parsedQuery).map((key) => {
                      const humanizedKey = humanizedGranuleQueryMap[key]

                      return (
                        <li key={key} className="subscriptions-list-item__tooltip-query-list-item">
                          <span className="subscriptions-list-item__tooltip-query-list-item-heading">
                            {humanizedKey}
                            {': '}
                          </span>
                          <span
                            title={JSON.stringify(parsedQuery[key])}
                            className="subscriptions-list-item__tooltip-query-list-item-value"
                          >
                            {JSON.stringify(parsedQuery[key])}
                          </span>
                        </li>
                      )
                    })
                  }
                </ul>
              </Tooltip>
            )}
          >
            <span className="subscriptions-list-item__query-text">
              {
                Object.keys(parsedQuery).map((key, i) => {
                  const humanizedKey = humanizedGranuleQueryMap[key]

                  return (
                    <span key={key}>
                      <span>
                        {humanizedKey}
                        {': '}
                      </span>
                      <span>
                        {JSON.stringify(parsedQuery[key])}
                      </span>
                      {
                        i < Object.keys(parsedQuery).length - 1 && ', '
                      }
                    </span>
                  )
                })
              }
            </span>
          </OverlayTrigger>
        </span>
      </div>
      <div className="subscriptions-list-item__actions">
        <Button
          className="subscriptions-list-item__action"
          bootstrapVariant="light"
          bootstrapSize="sm"
          disabled={hasExactlyMatchingGranuleQuery}
          label="Update Subscription"
          onClick={() => onHandleUpdate()}
        >
          Update
        </Button>
        <Button
          className="subscriptions-list-item__action"
          bootstrapVariant="danger"
          bootstrapSize="sm"
          label="Delete Subscription"
          onClick={() => onHandleRemove()}
        >
          Delete
        </Button>
      </div>
    </li>
  )
}

SubscriptionsListItem.propTypes = {
  hasExactlyMatchingGranuleQuery: PropTypes.bool.isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onUpdateSubscription: PropTypes.func.isRequired,
  subscription: PropTypes.shape({
    collectionConceptId: PropTypes.string,
    conceptId: PropTypes.string,
    name: PropTypes.string,
    nativeId: PropTypes.string,
    query: PropTypes.string
  }).isRequired
}

export default SubscriptionsListItem
