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
  FaTimesCircle
} from 'react-icons/fa'

import Button from '../Button/Button'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Spinner from '../Spinner/Spinner'

import { humanizedQueryValueFormattingMap } from '../../util/humanizedQueryValueFormattingMap'

import './SubscriptionsList.scss'

/**
 * Renders the logged in users' subscription list
 */
export const SubscriptionsList = ({
  subscriptions = {},
  onDeleteSubscription,
  onFocusedCollectionChange
}) => {
  const {
    byId: subscriptionsById,
    isLoading,
    isLoaded
  } = subscriptions

  const subscriptionsMetadata = Object.values(subscriptionsById)

  const onHandleRemove = (conceptId, nativeId, collectionId) => {
    // eslint-disable-next-line no-alert
    const confirmDeletion = window.confirm('Are you sure you want to remove this subscription? This action cannot be undone.')

    if (confirmDeletion) {
      onDeleteSubscription(conceptId, nativeId, collectionId)
    }
  }

  return (
    <>
      <h2 className="route-wrapper__page-heading">Subscriptions</h2>
      {
        (isLoading && !isLoaded) && (
          <Spinner
            className="subscriptions-list__spinner"
            type="dots"
            color="gray"
            size="small"
          />
        )
      }

      {
        isLoaded && (
          subscriptionsMetadata.length > 0 ? (
            <Table className="subscriptions-list__table" responsive>
              <thead>
                <tr>
                  <th className="subscriptions-list-table__name-heading">Name</th>
                  <th className="subscriptions-list-table__collection-heading">Collection</th>
                  <th className="subscriptions-list-table__query-heading">Query</th>
                  <th className="subscriptions-list-table__actions-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  subscriptionsMetadata.map((subscription) => {
                    const {
                      conceptId,
                      collection,
                      collectionConceptId,
                      name,
                      nativeId,
                      query
                    } = subscription

                    const parsedQuery = parse(query)

                    const {
                      title
                    } = collection

                    return (
                      <tr
                        key={conceptId}
                      >
                        <td className="subscriptions-list-table__name" title={name}>
                          {name}
                        </td>
                        <td className="subscriptions-list-table__collection" title={title}>
                          {title}
                        </td>
                        <td className="subscriptions-list-table__query">
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
                                        const humanizedKey = humanizedQueryValueFormattingMap[key]

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
                            <span className="subscriptions-list-table__query-text">
                              Preview Query
                            </span>
                          </OverlayTrigger>
                        </td>
                        <td className="subscriptions-list-table__actions">
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
            <p>No subscriptions to display.</p>
          )
        )
      }
    </>
  )
}

SubscriptionsList.propTypes = {
  subscriptions: PropTypes.shape({}).isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default SubscriptionsList
