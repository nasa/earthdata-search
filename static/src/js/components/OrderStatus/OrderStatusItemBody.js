import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { getStateFromOrderStatus, formatOrderStatus } from '../../util/orderStatus'

import Button from '../Button/Button'

import './OrderStatusItemBody.scss'

export const OrderStatusItemBody = ({
  collection,
  onChangePath,
  type
}) => {
  const {
    collection_id: collectionId,
    collection_metadata: collectionMetadata,
    id: retrievalId
  } = collection

  const {
    browse_flag: browseFlag
  } = collectionMetadata

  let {
    order_status: orderStatus
  } = collectionMetadata

  if (type === 'download') orderStatus = 'complete'

  const className = classNames([
    'order-status-item-body__state-display',
    {
      'order-status-item-body__state-display--success': getStateFromOrderStatus(orderStatus) === 'success',
      'order-status-item-body__state-display--errored': getStateFromOrderStatus(orderStatus) === 'errored'
    }
  ])

  return (
    <div className="order-status-item-body">
      <div className="order-status-item-body__state">
        <span className={className}>
          {formatOrderStatus(orderStatus)}
        </span>
      </div>
      <div>
        {/* TODO: Set up link to browse image links */}
        {
          type === 'download' && (
            <Link
              className="order-status-item-body__button"
              to={{
                pathname: '/granules/download',
                search: `?rid=${retrievalId}&cid=${collectionId}`
              }}
              onClick={() => onChangePath(`/granules/download/?rid=${retrievalId}&cid=${collectionId}`)}
            >
              <Button
                bootstrapVariant="primary"
                bootstrapSize="sm"
                label="View/Download Data Links"
                tooltip={(<>View or download data URLs</>)}
                tooltipPlacement="bottom"
                tooltipId="tooltip__download-links"
              >
                View/Download Data Links
              </Button>
            </Link>
          )
        }
        {
          type === 'echo_order' && (
            <>
              {
                browseFlag && (
                  <Link
                    className="order-status-item-body__button"
                    to={{
                      pathname: '/granules/download',
                      search: `?browse=true&rid=${retrievalId}&cid=${collectionId}`
                    }}
                    onClick={() => onChangePath(`/granules/download/?browse=true&rid=${retrievalId}&cid=${collectionId}`)}
                  >
                    <Button
                      bootstrapVariant="primary"
                      bootstrapSize="sm"
                      label="View Browse Image Links"
                      tooltip={(<>View clickable browse image links in the browser</>)}
                      tooltipPlacement="bottom"
                      tooltipId="tooltip__download-links"
                    >
                      View Browse Image Links
                    </Button>
                  </Link>
                )
              }
            </>
          )
        }
      </div>
    </div>
  )
}

OrderStatusItemBody.propTypes = {
  collection: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}

export default OrderStatusItemBody
