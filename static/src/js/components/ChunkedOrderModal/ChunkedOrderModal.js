import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import { FaArrowCircleLeft } from 'react-icons/fa'

import { calculateOrderCount } from '../../util/orderCount'
import { commafy } from '../../util/commafy'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
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

    const { defaultGranulesPerOrder } = getApplicationConfig()

    // Remove focused collection from back button params
    const params = parse(location.search, { ignoreQueryPrefix: true, parseArrays: false })
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
        to={{
          pathname: '/search',
          search: stringify({
            ...params,
            p
          })
        }}
      >
        Refine your search
      </PortalLinkContainer>
    )

    const body = (
      <>
        <p>
          Orders for data containing more than
          {` ${commafy(defaultGranulesPerOrder)} `}
          granules will be split into multiple orders.
          You will receive a set of emails for each order placed.
        </p>
        {
          Object.keys(projectCollectionsRequiringChunking).length > 0 && (
            Object.keys(projectCollectionsRequiringChunking).map((collectionId, i) => {
              const key = `chunked_order_message-${i}`

              const { [collectionId]: projectCollection } = projectCollectionsRequiringChunking
              const orderCount = calculateOrderCount(projectCollection)

              const { [collectionId]: projectCollectionMetadata = {} } = projectCollectionsMetadata
              const { title } = projectCollectionMetadata

              return (
                <p key={key}>
                  Your order for
                  {' '}
                  <span className="chunked-order-modal__body-emphasis">{title}</span>
                  {' '}
                  will be automatically split up into
                  {' '}
                  <span className="chunked-order-modal__body-strong">{`${orderCount} orders`}</span>
                  .
                </p>
              )
            })
          )
        }
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
