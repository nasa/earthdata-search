import React from 'react'
import PropTypes from 'prop-types'

import { Table } from 'react-bootstrap'

import { Spinner } from '../Spinner/Spinner'

import './SubscriptionsList.scss'

/**
 * Renders the logged in users' subscription list
 */
export const SubscriptionsList = ({
  subscriptions = {}
}) => {
  const {
    byId: subscriptionsById,
    isLoading,
    isLoaded
  } = subscriptions

  const subscriptionsMetadata = Object.values(subscriptionsById)

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
                          {title}
                        </td>
                        <td>
                          {query}
                        </td>
                        <td className="subscriptions-list-table__actions" />
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
  subscriptions: PropTypes.shape({}).isRequired
}

export default SubscriptionsList
