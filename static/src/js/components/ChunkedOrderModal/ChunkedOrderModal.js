import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'

import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { stringify } from '../../util/url/url'
import { commafy } from '../../util/commafy'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

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
      location,
      collectionMetdata,
      onToggleChunkedOrderModal,
      project,
      isOpen
    } = this.props

    const {
      byId,
      collectionsRequiringChunking
    } = project

    const { defaultGranulesPerOrder } = getApplicationConfig()

    const { byId: metadataById } = collectionMetdata

    // Remove focused collection from back button params
    const params = parse(location.search, { ignoreQueryPrefix: true })
    let { p = '' } = params
    p = p.replace(/^[^!]*/, '')

    const backLink = (
      <PortalLinkContainer
        className="chunked-order-modal__action chunked-order-modal__action--secondary"
        bootstrapVariant="primary"
        type="button"
        icon="arrow-circle-o-left"
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
          collectionsRequiringChunking.length > 0 && (
            collectionsRequiringChunking.map((collection, i) => {
              const key = `chunked_order_message-${i}`

              const { [collection]: chunkedCollection } = byId
              const { orderCount } = chunkedCollection

              const { [collection]: allMetadata } = metadataById
              const { metadata: jsonMetadata } = allMetadata
              const { title } = jsonMetadata

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
  collectionMetdata: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onSubmitRetrieval: PropTypes.func.isRequired,
  onToggleChunkedOrderModal: PropTypes.func.isRequired
}

export default ChunkedOrderModal
