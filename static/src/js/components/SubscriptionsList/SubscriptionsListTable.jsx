import React from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Table from 'react-bootstrap/Table'
import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'
import { Close } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { FaEdit } from 'react-icons/fa'
import camelcaseKeys from 'camelcase-keys'
import moment from 'moment'

import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import { SubscriptionsQueryList } from './SubscriptionsQueryList'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import useEdscStore from '../../zustand/useEdscStore'

import renderTooltip from '../../util/renderTooltip'

import { routes } from '../../constants/routes'

import { useDeleteSubscription } from '../../hooks/useDeleteSubscription'

import './SubscriptionsListTable.scss'

/**
 * Renders the logged in users' subscription list
 */
const SubscriptionsListTable = ({
  subscriptionsMetadata,
  subscriptionType
}) => {
  const setCollectionId = useEdscStore(
    (state) => state.collection.setCollectionId
  )

  const { deleteSubscription, loading } = useDeleteSubscription()

  const onHandleRemove = (conceptId, nativeId) => {
    // eslint-disable-next-line no-alert
    const confirmDeletion = window.confirm('Are you sure you want to remove this subscription? This action cannot be undone.')

    if (confirmDeletion) {
      deleteSubscription({
        variables: {
          params: {
            conceptId,
            nativeId
          }
        }
      })
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
                <th className="subscriptions-list-table__collection-heading">Dataset</th>
              )
            }
            <th className="subscriptions-list-table__created-heading">Created</th>
            <th className="subscriptions-list-table__updated-heading">Updated</th>
            <th className="subscriptions-list-table__actions-heading"><span className="visually-hidden">Actions</span></th>
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
                    <div className="actions-container">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          (tooltipProps) => renderTooltip({
                            children: (
                              <>
                                <h5 className="tooltip__tooltip-heading">Filters</h5>
                                <SubscriptionsQueryList
                                  query={parsedQuery}
                                  subscriptionType={subscriptionType}
                                />
                              </>
                            ),
                            className: 'subscriptions-list-table__tooltip tooltip--wide tooltip--ta-left',
                            id: `tooltip__subscription-info__${conceptId}`,
                            ...tooltipProps
                          })
                        }
                      >
                        <EDSCIcon icon={AlertInformation} className="subscriptions-list__button align-middle" />
                      </OverlayTrigger>
                      <PortalLinkContainer
                        className="subscriptions-list__button subscriptions-list__button--edit"
                        type="button"
                        to={
                          {
                            pathname: subscriptionType === 'granule' ? routes.GRANULE_SUBSCRIPTIONS : routes.COLLECTION_SUBSCRIPTIONS,
                            search: subscriptionType === 'granule' ? `?p=${collectionConceptId}` : ''
                          }
                        }
                        onClick={
                          () => {
                            if (subscriptionType === 'granule') setCollectionId(collectionConceptId)
                          }
                        }
                        variant="naked"
                        icon={FaEdit}
                        label="Edit Subscription"
                      />
                      <Button
                        className="subscriptions-list__button subscriptions-list__button--remove"
                        onClick={() => onHandleRemove(conceptId, nativeId, collectionConceptId)}
                        variant="naked"
                        icon={Close}
                        label="Delete Subscription"
                        spinner={loading}
                        spinnerColor="black"
                      />
                    </div>
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
  subscriptionType: PropTypes.string.isRequired
}

export default SubscriptionsListTable
