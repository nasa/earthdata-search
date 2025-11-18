import React from 'react'
import { upperFirst } from 'lodash-es'
import {
  ArrowChevronUp,
  ArrowChevronDown
// @ts-expect-error The file does not have types
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { FaQuestionCircle } from 'react-icons/fa'
import Col from 'react-bootstrap/Col'
import moment from 'moment'

import Button from '../Button/Button'
// @ts-expect-error The file does not have types
import ProgressRing from '../ProgressRing/ProgressRing'
// @ts-expect-error The file does not have types
import EDSCTabs from '../EDSCTabs/EDSCTabs'

import commafy from '../../util/commafy'
// @ts-expect-error The file does not have types
import pluralize from '../../util/pluralize'
// @ts-expect-error The file does not have types
import { formatOrderStatus } from '../../../../../sharedUtils/orderStatus'

interface OrderStatusItemProps {
  /** The type of access method */
  accessMethodType: string
  /** Optional CSS class name for the list item */
  className?: string
  /** Indicates if the collection is part of CSDA program */
  collectionIsCSDA: boolean
  /** Number of granules in the order */
  granuleCount: number
  /** Whether the order has a status */
  hasStatus: boolean
  /** Whether the message is an error */
  messageIsError: boolean
  /** Array of messages from the service */
  messages: string[]
  /** Whether the item is expanded/opened */
  opened: boolean
  /** Handler to toggle the CSDA modal */
  onToggleAboutCSDAModal: (state: boolean) => void
  /** Additional information about the order */
  orderInfo: string
  /** Current status of the order */
  orderStatus: string
  /** Progress percentage of the order */
  progressPercentage: number
  /** Handler to set the opened state */
  setOpened: (opened: boolean) => void
  /** Array of tab components to display */
  tabs: object[]
  /** Title of the order status item */
  title: string
  /** Number of completed orders */
  totalCompleteOrders: number
  /** Total number of orders */
  totalOrders: number
  /** Last updated timestamp for the order */
  updatedAt: string
}

const OrderStatusItem: React.FC<OrderStatusItemProps> = ({
  accessMethodType,
  className,
  collectionIsCSDA,
  granuleCount,
  hasStatus,
  messageIsError,
  messages,
  opened,
  onToggleAboutCSDAModal,
  orderInfo,
  orderStatus,
  progressPercentage,
  setOpened,
  tabs,
  title,
  totalCompleteOrders,
  totalOrders,
  updatedAt
}) => (
  <li className={className}>
    <header className="order-status-item__header">
      <h4 className="order-status-item__heading" title={title}>{title}</h4>
      {
        !opened && (
          <>
            <span className="order-status-item__meta-column order-status-item__meta-column--progress">
              <ProgressRing
                className="order-status-item__progress-ring--closed"
                width={22}
                strokeWidth={3}
                progress={progressPercentage}
              />
              <span
                className="order-status-item__status"
                aria-label="Order Status"
              >
                {!hasStatus ? 'Complete' : formatOrderStatus(orderStatus)}
              </span>
              {
                (progressPercentage != null && progressPercentage >= 0) && (
                  <span
                    className="order-status-item__percentage"
                    aria-label="Order Progress Percentage"
                  >
                    {`(${progressPercentage}%)`}
                  </span>
                )
              }
            </span>
            <span
              className="order-status-item__meta-column order-status-item__meta-column--access-method"
              aria-label="Access Method Type"
            >
              {upperFirst(accessMethodType)}
            </span>
            <span
              className="order-status-item__meta-column order-status-item__meta-column--granules"
              aria-label="Granule Count"
            >
              {`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}
            </span>
          </>
        )
      }
      <Button
        className="order-status-item__button"
        type="icon"
        icon={opened ? ArrowChevronUp : ArrowChevronDown}
        label={opened ? 'Close details' : 'Show details'}
        title={opened ? 'Close details' : 'Show details'}
        onClick={() => setOpened(!opened)}
      />
    </header>
    {
      opened && (
        <div className="order-status-item__body">
          <div className="order-status-item__body-header" data-testid="order-status-item__body-header">
            <div className="order-status-item__body-header-primary">
              <div className="order-status-item__meta-row">
                <div className="order-status-item__meta">
                  <h4 className="order-status-item__meta-heading">Status</h4>
                  <div className="order-status-item__meta-body order-status-item__meta-body--progress">
                    <ProgressRing
                      className="order-status-item__progress-ring"
                      width={22}
                      strokeWidth={3}
                      progress={progressPercentage}
                    />
                    <div className="order-status-item__progress-meta">
                      <div className="d-flex align-items-center">
                        <span
                          className="order-status-item__status"
                          aria-label="Order Status"
                        >
                          {!hasStatus ? 'Complete' : formatOrderStatus(orderStatus)}
                        </span>
                        {
                          (progressPercentage != null && progressPercentage >= 0) && (
                            <span
                              className="order-status-item__percentage"
                              aria-label="Order Progress Percentage"
                            >
                              {`(${progressPercentage}%)`}
                            </span>
                          )
                        }
                      </div>
                      {
                        totalOrders > 0 && (
                          <span
                            className="order-status-item__orders-processed"
                            aria-label="Orders Processed Count"
                          >
                            {`${totalCompleteOrders}/${totalOrders} orders complete`}
                          </span>
                        )
                      }
                      <span
                        className="order-status-item__last-updated"
                        aria-label="Order Last Updated Time"
                      >
                        Updated:
                        {' '}
                        {moment(updatedAt).format('MM-DD-YYYY hh:mm:ss a')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="order-status-item__meta">
                  <h4 className="order-status-item__meta-heading">Access Method</h4>
                  <div
                    className="order-status-item__meta-body order-status-item__meta-body--access-method"
                    aria-label="Access Method Type"
                  >
                    <span className="order-status-item__status">{upperFirst(accessMethodType)}</span>
                  </div>
                </div>
                <div className="order-status-item__meta">
                  <h4 className="order-status-item__meta-heading">Granules</h4>
                  <div
                    className="order-status-item__meta-body order-status-item__meta-body--granules"
                    aria-label="Granule Count"
                  >
                    <span className="order-status-item__status">{`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {
                orderInfo && (
                  <div
                    className="order-status-item__order-info"
                    aria-label="Order Information"
                  >
                    {orderInfo}
                  </div>
                )
              }
            </div>
            {
              collectionIsCSDA && (
                <Col
                  className="order-status-item__note mb-3"
                  aria-label="CSDA Note"
                >
                  {'This collection is made available through the '}
                  <span className="order-status-item__note-emph order-status-item__note-emph--csda">NASA Commercial Smallsat Data Acquisition (CSDA) Program</span>
                  {' for NASA funded researchers. Access to the data will require additional authentication. '}
                  <Button
                    className="order-status-item__header-message-link"
                    dataTestId="order-status-item__csda-modal-button"
                    onClick={() => onToggleAboutCSDAModal(true)}
                    variant="link"
                    bootstrapVariant="link"
                    icon={FaQuestionCircle}
                    label="More details"
                  >
                    More Details
                  </Button>
                </Col>
              )
            }
            <div className="order-status-item__additional-info">
              {
                messages.length > 0 && (
                  <div className={`order-status-item__message${messageIsError ? ' order-status-item__message--is-error' : ''}`}>
                    <h3 className="order-status-item__message-heading">Service has responded with message:</h3>
                    <ul className="order-status-item__message-body">
                      {
                        messages.map((message, i) => {
                          const messagesKey = `message-${i}`

                          return (
                            <li key={messagesKey}>{message}</li>
                          )
                        })
                      }
                    </ul>
                  </div>
                )
              }
            </div>
          </div>
          <EDSCTabs className="order-status-item__tabs">
            {tabs}
          </EDSCTabs>
        </div>
      )
    }
  </li>
)

export default OrderStatusItem
