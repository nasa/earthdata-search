import React from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import Button from '../Button/Button'

import { humanizedGranuleQueryMap } from '../../util/humanizedGranuleQueryMap'

import './SubscriptionsListItem.scss'

export const SubscriptionsListItem = ({
  subscription
}) => {
  const { name, query, conceptId } = subscription

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
            <span className="subscriptions-list-item__query">
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
          disabled
          label="Edit Subscription"
          onClick={() => console.log('Edit clicked')}
        >
          Edit
        </Button>
        <Button
          className="subscriptions-list-item__action"
          bootstrapVariant="danger"
          bootstrapSize="sm"
          disabled
          label="Delete Subscription"
          onClick={() => console.log('Delete clicked')}
        >
          Delete
        </Button>
      </div>
    </li>
  )
}

SubscriptionsListItem.propTypes = {
  subscription: PropTypes.shape({}).isRequired
}

export default SubscriptionsListItem
