import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import { FaArrowCircleLeft } from 'react-icons/fa'

import { calculateGranulesPerOrder, calculateOrderCount } from '../../util/orderCount'
import { commafy } from '../../util/commafy'
import { stringify } from '../../util/url/url'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import { locationPropType } from '../../util/propTypes/location'

import './ChunkedOrderModal.scss'

export class ChunkedOrderModal extends Component {
  constructor(props) {
    super(props)

    this.onClickContinue = this.onClickContinue.bind(this)
    this.onModalClose = this.onModalClose.bind(this)
  }

  onModalClose() {
    const { onToggleChunkedOrderModal } = this.props
    onToggleChunkedOrderModal(false)
  }

  onClickContinue() {
    const { onSubmitRetrieval, onToggleChunkedOrderModal } = this.props

    onToggleChunkedOrderModal(false)
    onSubmitRetrieval()
  }

  render() {
    const {
      isOpen,
      location,
      onToggleChunkedOrderModal,
      projectCollectionsMetadata,
      projectCollectionsRequiringChunking
    } = this.props

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
        icon={FaArrowCircleLeft}
        label="Refine your search"
        onClick={() => onToggleChunkedOrderModal(false)}
        to={
          {
            pathname: '/search',
            search: stringify({
              ...params,
              p
            })
          }
        }
      >
        Refine your search
      </PortalLinkContainer>
    )

    const body = (
      <>
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

              const { [collectionId]: projectCollectionMetadata = {} } = projectCollectionsMetadata
              const { title } = projectCollectionMetadata

              return (
                <p
                  key={key}
                  data-testid={key}
                >
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
              )
            })
          )
        }
        <p>
          Note: You will receive a separate set of confirmation emails for each order placed.
        </p>
      </>
    )

    return (
      <EDSCModalContainer
        className="chunked-order"
        id="chunked-order"
        isOpen={isOpen}
        onClose={this.onModalClose}
        size="lg"
        title="Per-order Granule Limit Exceeded"
        body={body}
        footerMeta={backLink}
        primaryAction="Continue"
        onPrimaryAction={this.onClickContinue}
        secondaryAction="Change access methods"
        onSecondaryAction={this.onModalClose}
      />
    )
  }
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
