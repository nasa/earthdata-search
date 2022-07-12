import React from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import { FaTrash, FaInfoCircle, FaEdit } from 'react-icons/fa'
import camelcaseKeys from 'camelcase-keys'
import moment from 'moment'

import Button from '../Button/Button'
import { SubscriptionsQueryList } from '../SubscriptionsList/SubscriptionsQueryList'

import './SubscriptionsListItem.scss'
import { getApplicationConfig } from '../../../../../sharedUtils/config'

const dateFormat = getApplicationConfig().temporalDateFormatFull

export const SubscriptionsListItem = ({
  exactlyMatchingSubscriptions,
  hasNullCmrQuery,
  subscription,
  subscriptionType,
  onDeleteSubscription,
  onToggleEditSubscriptionModal
}) => {
  const {
    collectionConceptId,
    creationDate,
    name,
    nativeId,
    query,
    conceptId,
    revisionDate
  } = subscription

  const isRevised = creationDate !== revisionDate
  const dateToDisplay = isRevised ? revisionDate : creationDate

  const isMatchingSubscription = exactlyMatchingSubscriptions
    .some(({ conceptId: matchingConceptId }) => conceptId === matchingConceptId)

  const onHandleRemove = () => {
    // eslint-disable-next-line no-alert
    const confirmDeletion = window.confirm('Are you sure you want to remove this subscription? This action cannot be undone.')

    if (confirmDeletion) {
      onDeleteSubscription(conceptId, nativeId, collectionConceptId)
    }
  }

  const parsedQuery = parse(query)

  return (
    <li className="subscriptions-list-item">
      <div className="subscriptions-list-item__primary">
        <h4 className="subscriptions-list-item__name" title={name}>{name}</h4>
        <span className="subscriptions-list-item__meta">
          <span className="subscriptions-list-item__meta-item">
            {`${isRevised ? 'Updated' : 'Created'}: ${moment.utc(dateToDisplay).format(dateFormat)}`}
          </span>
        </span>
      </div>
      <div className="subscriptions-list-item__actions">
        <Button
          className="subscriptions-list-item__action"
          icon={FaInfoCircle}
          bootstrapVariant="light"
          bootstrapSize="sm"
          label="Details"
          onClick={(e) => e.preventDefault()}
          tooltipId={`subscription-list-item--${conceptId}`}
          overlayClass="subscriptions-list-item__tooltip tooltip--wide"
          tooltip={(
            <>
              <h5 className="tooltip__tooltip-heading">Filters</h5>
              <SubscriptionsQueryList
                query={camelcaseKeys(parsedQuery)}
                subscriptionType={subscriptionType}
              />
            </>
          )}
        >
          Details
        </Button>
        <Button
          className="subscriptions-list-item__action"
          icon={FaEdit}
          bootstrapVariant="light"
          bootstrapSize="sm"
          disabled={
            hasNullCmrQuery
            || (exactlyMatchingSubscriptions.length > 0 && !isMatchingSubscription)
          }
          label="Edit Subscription"
          onClick={() => {
            onToggleEditSubscriptionModal({
              isOpen: true,
              subscriptionConceptId: conceptId,
              type: subscriptionType
            })
          }}
        >
          Edit
        </Button>
        <Button
          className="subscriptions-list-item__action"
          icon={FaTrash}
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
  hasNullCmrQuery: PropTypes.bool.isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onToggleEditSubscriptionModal: PropTypes.func.isRequired,
  exactlyMatchingSubscriptions: PropTypes.arrayOf(
    PropTypes.shape({
      conceptId: PropTypes.string
    })
  ).isRequired,
  subscription: PropTypes.shape({
    collectionConceptId: PropTypes.string,
    creationDate: PropTypes.string,
    conceptId: PropTypes.string,
    name: PropTypes.string,
    nativeId: PropTypes.string,
    query: PropTypes.string,
    revisionDate: PropTypes.string
  }).isRequired,
  subscriptionType: PropTypes.string.isRequired
}

export default SubscriptionsListItem
