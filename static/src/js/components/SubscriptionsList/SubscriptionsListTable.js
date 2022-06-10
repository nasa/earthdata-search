import React from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import {
  Table,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'
import {
  FaEdit,
  FaInfoCircle,
  FaTimesCircle
} from 'react-icons/fa'
import camelcaseKeys from 'camelcase-keys'
import moment from 'moment'

import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import { humanizedQueryKeysMap } from '../../util/humanizedQueryKeysMap'

import './SubscriptionsListTable.scss'

/**
 * Renders the logged in users' subscription list
 */
export const SubscriptionsListTable = ({
  subscriptionsMetadata = {},
  subscriptionType,
  onDeleteSubscription,
  onFocusedCollectionChange
}) => {
  const onHandleRemove = (conceptId, nativeId, collectionId) => {
    // eslint-disable-next-line no-alert
    const confirmDeletion = window.confirm('Are you sure you want to remove this subscription? This action cannot be undone.')

    if (confirmDeletion) {
      onDeleteSubscription(conceptId, nativeId, collectionId)
    }
  }

  return (
    subscriptionsMetadata.length > 0 ? (
      <Table className="subscriptions-list__table" responsive>
        <thead>
          <tr>
            <th className="subscriptions-list-table__name-heading">Name</th>
            {
              subscriptionType === 'granule' && (
                <th className="subscriptions-list-table__collection-heading">Collection</th>
              )
            }
            <th className="subscriptions-list-table__created-heading">Created</th>
            <th className="subscriptions-list-table__updated-heading">Updated</th>
          </tr>
        </thead>
        <tbody>
          {
            subscriptionsMetadata.map((subscription) => {
              const {
                conceptId,
                collection,
                collectionConceptId,
                creationDate,
                name,
                nativeId,
                query,
                revisionDate
              } = subscription

              const parsedQuery = camelcaseKeys(parse(query))

              const {
                title
              } = collection || {}

              return (
                <tr
                  key={conceptId}
                >
                  <td className="subscriptions-list-table__name" title={name}>
                    {name}
                  </td>
                  {
                    subscriptionType === 'granule' && (
                      <td className="subscriptions-list-table__collection" title={title}>
                        {title}
                      </td>
                    )
                  }
                  <td className="subscriptions-list-table__created">
                    {moment.utc(creationDate).format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                  <td className="subscriptions-list-table__updated">
                    {moment.utc(revisionDate).format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                  <td className="subscriptions-list-table__actions">
                    <OverlayTrigger
                      placement="top"
                      overlay={(
                        <Tooltip
                          id={`tooltip__subscription-info__${conceptId}`}
                          className="subscriptions-list-table__tooltip tooltip--wide"
                        >
                          <>
                            <p className="subscriptions-list-table__tooltip-query-heading">Query Parameters</p>
                            <ul className="subscriptions-list-table__tooltip-query-list">
                              {
                                Object.keys(parsedQuery).map((key) => {
                                  const humanizedKey = humanizedQueryKeysMap[key]

                                  return (
                                    <li key={key} className="subscriptions-list-table__tooltip-query-list-item">
                                      <span>
                                        {humanizedKey}
                                        {': '}
                                      </span>
                                      <span
                                        title={JSON.stringify(parsedQuery[key])}
                                        className="subscriptions-list-table__tooltip-query-list-item-value"
                                      >
                                        {JSON.stringify(parsedQuery[key])}
                                      </span>
                                    </li>
                                  )
                                })
                              }
                            </ul>
                          </>
                        </Tooltip>
                      )}
                    >
                      <EDSCIcon icon={FaInfoCircle} className="subscriptions-list__button" />
                    </OverlayTrigger>
                    <PortalLinkContainer
                      className="subscriptions-list__button subscriptions-list__button--edit"
                      type="button"
                      to={{
                        pathname: '/search/granules/subscriptions',
                        search: `?p=${collectionConceptId}`
                      }}
                      onClick={() => onFocusedCollectionChange(collectionConceptId)}
                      variant="naked"
                      icon={FaEdit}
                      label="Edit Subscription"
                    />
                    <Button
                      className="subscriptions-list__button subscriptions-list__button--remove"
                      onClick={() => onHandleRemove(conceptId, nativeId, collectionConceptId)}
                      variant="naked"
                      icon={FaTimesCircle}
                      label="Delete Subscription"
                    />
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    ) : (
      <p>
        No subscriptions to display.
      </p>
    )
  )
}

SubscriptionsListTable.propTypes = {
  subscriptionsMetadata: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  subscriptionType: PropTypes.string.isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default SubscriptionsListTable
