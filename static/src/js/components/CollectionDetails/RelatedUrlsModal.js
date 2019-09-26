import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'

import ArrowTags from '../ArrowTags/ArrowTags'

import { pluralize } from '../../util/pluralize'

import './RelatedUrlsModal.scss'

export class RelatedUrlsModal extends Component {
  constructor(props) {
    super(props)
    this.onModalClose = this.onModalClose.bind(this)
  }

  onModalClose() {
    const { onToggleRelatedUrlsModal } = this.props
    onToggleRelatedUrlsModal(false)
  }

  render() {
    const {
      focusedCollectionObject,
      isOpen
    } = this.props

    const { formattedMetadata = {} } = focusedCollectionObject
    const { relatedUrls = [] } = formattedMetadata

    return (
      <Modal
        dialogClassName="related-urls-modal modal--full modal--has-inner-header"
        show={isOpen}
        onHide={this.onModalClose}
        centered
        size="lg"
        aria-labelledby="modal__related-urls-modal"
      >
        <Modal.Header
          className="related-urls-modal__header"
          closeButton
        >
          <Modal.Title
            id="modal__related-urls-modal"
            className="related-urls-modal__title"
          >
            Related URLs
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="related-urls-modal__body">
          {
            relatedUrls.map((category, i) => {
              if (category.urls.length) {
                const key = `modal_related_url_${i}`
                return (
                  <div key={key} className="related-urls-modal__group">
                    <h4 className="related-urls-modal__group-title">{pluralize(category.label, category.urls)}</h4>
                    {
                      category.urls.map((url, j) => {
                        const key = `modal_related_url_${i}-${j}`
                        return (
                          <ul key={key} className="related-urls-modal__url">
                            <ArrowTags tags={[url.Type, url.Subtype]} />
                            {/* eslint-disable-next-line react/jsx-no-target-blank */}
                            <a className="related-urls-modal__link" href={url.URL} target="_blank">{url.URL}</a>
                          </ul>
                        )
                      })
                    }
                  </div>
                )
              }
              return null
            })
          }
        </Modal.Body>
        <Modal.Footer className="related-urls-modal__footer">
          <div>
            <Button
              className="related-urls-modal__action related-urls-modal__action--close"
              variant="primary"
              onClick={this.onModalClose}
            >
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}

RelatedUrlsModal.propTypes = {
  focusedCollectionObject: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default RelatedUrlsModal
