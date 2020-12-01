import React from 'react'
import PropTypes from 'prop-types'

import { Table } from 'react-bootstrap'

import Button from '../Button/Button'
import { Spinner } from '../Spinner/Spinner'

import './SubscriptionsList.scss'

/**
 * Renders the logged in users' subscription list
 */
export const SubscriptionsList = ({
  subscriptions = {},
  onDeleteSubscription
}) => {
  const {
    byId: subscriptionsById,
    isLoading,
    isLoaded
  } = subscriptions

  const subscriptionsMetadata = Object.values(subscriptionsById)

  const onHandleRemove = (conceptId, nativeId) => {
    // eslint-disable-next-line no-alert
    const confirmDeletion = window.confirm('Are you sure you want to remove this subscription? This action cannot be undone.')

    if (confirmDeletion) {
      onDeleteSubscription(conceptId, nativeId)
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
            <Table className="subscriptions-list__table">
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
                      name,
                      nativeId,
                      query
                    } = subscription

                    const {
                      title
                    } = collection

                    return (
                      <tr
                        key={conceptId}
                      >
                        <td>
                          {name}
                        </td>
                        <td>
                          {title}
                        </td>
                        <td>
                          {query}
                        </td>
                        <td className="subscriptions-list-table__actions">
                          <Button
                            className="subscriptions-list__button subscriptions-list__button--remove"
                            onClick={() => onHandleRemove(conceptId, nativeId)}
                            variant="naked"
                            icon="times-circle"
                            label="Delete Download"
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
  onDeleteSubscription: PropTypes.func.isRequired
}

export default SubscriptionsList
