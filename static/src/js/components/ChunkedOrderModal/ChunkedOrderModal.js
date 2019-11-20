import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import { parse } from 'qs'

import Button from '../Button/Button'
import { stringify } from '../../util/url/url'

import './ChunkedOrderModal.scss'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

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

    return (
      <Modal
        dialogClassName="chunked-order-modal"
        show={isOpen}
        onHide={this.onModalClose}
        centered
        size="lg"
        aria-labelledby="modal__chunked-order-modal"
      >
        <Modal.Header
          className="chunked-order-modal__header"
          closeButton
        >
          <Modal.Title
            className="chunked-order-modal__title"
          >
            Maximum Granules Exceeded
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="chunked-order-modal__body">
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
                    {title}
                    {' '}
                    will be automatically split up into
                    {' '}
                    {orderCount}
                    {' '}
                    orders. You will receive a set of emails for each order placed.
                  </p>
                )
              })
            )
          }
        </Modal.Body>
        <Modal.Footer>
          { backLink}
          <Button
            className="chunked-order-modal__action chunked-order-modal__action--secondary"
            bootstrapVariant="primary"
            label="Close"
            onClick={this.onModalClose}
          >
            Change access methods
          </Button>
          <Button
            className="chunked-order-modal__action chunked-order-modal__action--secondary"
            bootstrapVariant="primary"
            label="Continue"
            onClick={this.onClickContinue}
          >
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
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
