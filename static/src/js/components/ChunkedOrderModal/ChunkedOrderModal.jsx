import React from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import { ArrowCircleLeft } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { calculateGranulesPerOrder, calculateOrderCount } from '../../util/orderCount'
import { commafy } from '../../util/commafy'
import { stringify } from '../../util/url/url'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import { locationPropType } from '../../util/propTypes/location'
import './ChunkedOrderModal.scss'

const ChunkedOrderModal = ({
  isOpen,
  location,
  onToggleChunkedOrderModal,
  onSubmitRetrieval,
  projectCollectionsMetadata,
  projectCollectionsRequiringChunking
}) => {
  const onModalClose = () => {
    onToggleChunkedOrderModal(false)
  }

  const onClickContinue = () => {
    onToggleChunkedOrderModal(false)
    onSubmitRetrieval()
  }

  // Remove focused collection from back button params
  const params = parse(location.search, {
    ignoreQueryPrefix: true,
    parseArrays: false
  })
  let { p = '' } = params
  p = p.replace(/^[^!]*/, '')

  const backLink = (
    <PortalLinkContainer
      className="chunked-order-modal__action chunked-order-modal__action--secondary"
      bootstrapVariant="primary"
      type="button"
      icon={ArrowCircleLeft}
      label="Refine your search"
      onClick={onModalClose}
      to={
        {
          pathname: '/search',
          search: stringify({
            ...params,
            p
          })
        }
      }
      updatePath
    >
      Refine your search
    </PortalLinkContainer>
  )
  const body = (
    <div>
      {
        Object.keys(projectCollectionsRequiringChunking).length > 0 && (
          Object.keys(projectCollectionsRequiringChunking).map((collectionId, i) => {
            const key = `chunked_order_message-${i}`

            const { [collectionId]: projectCollection } = projectCollectionsRequiringChunking
            const orderCount = calculateOrderCount(projectCollection)

            const {
              accessMethods = {},
              granules = {},
              selectedAccessMethod
            } = projectCollection

            const { hits: granuleCount } = granules

            const granulesPerOrder = calculateGranulesPerOrder(
              accessMethods,
              selectedAccessMethod
            )

            // Display notice for services which send confirmation emails
            let sendsEmails = false
            const isEchoOrdering = /echoOrder\d+$/
            const isEsi = /esi\d+$/

            if (selectedAccessMethod
              && (isEchoOrdering.test(selectedAccessMethod) || isEsi.test(selectedAccessMethod))) {
              sendsEmails = true
            }

            const { [collectionId]: projectCollectionMetadata = {} } = projectCollectionsMetadata
            const { title } = projectCollectionMetadata

            return (
              <div
                key={key}
                data-testid={key}
              >
                <p>
                  The collection
                  {' '}
                  <span className="chunked-order-modal__body-emphasis">{title}</span>
                  {' '}
                  contains
                  {' '}
                  <span className="chunked-order-modal__body-emphasis">{commafy(granuleCount)}</span>
                  {' '}
                  granules which exceeds the
                  {' '}
                  <span className="chunked-order-modal__body-emphasis">{commafy(granulesPerOrder)}</span>
                  {' '}
                  granule limit configured by the provider.
                  When submitted, the order will automatically be split into
                  {' '}
                  <span className="chunked-order-modal__body-strong">{`${orderCount} orders`}</span>
                  .
                </p>
                {
                  sendsEmails && (
                    <p>
                      Note: You will receive a separate set of confirmation emails
                      for each order in
                      {' '}
                      {title}
                      .
                    </p>
                  )
                }
              </div>
            )
          })
        )
      }
    </div>
  )

  return (
    <EDSCModalContainer
      className="chunked-order"
      id="chunked-order"
      isOpen={isOpen}
      onClose={onModalClose}
      size="lg"
      title="Per-order Granule Limit Exceeded"
      body={body}
      footerMeta={backLink}
      primaryAction="Continue"
      onPrimaryAction={onClickContinue}
      secondaryAction="Change access methods"
      onSecondaryAction={onModalClose}
    />
  )
}

ChunkedOrderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  location: locationPropType.isRequired,
  onSubmitRetrieval: PropTypes.func.isRequired,
  onToggleChunkedOrderModal: PropTypes.func.isRequired,
  projectCollectionsMetadata: PropTypes.shape({}).isRequired,
  projectCollectionsRequiringChunking: PropTypes.shape({}).isRequired
}

export default ChunkedOrderModal
