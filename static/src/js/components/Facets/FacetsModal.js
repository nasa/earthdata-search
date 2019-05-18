import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import classNames from 'classnames'

import { changeViewAllFacet } from '../../util/facets'

import FacetsList from './FacetsList'
import FacetsModalNav from './FacetsModalNav'
import Spinner from '../Spinner/Spinner'

import './FacetsModal.scss'

export class FacetsModal extends Component {
  constructor(props) {
    super(props)
    this.onApplyClick = this.onApplyClick.bind(this)
    this.onModalClose = this.onModalClose.bind(this)
    this.modalInner = React.createRef()
  }

  onModalClose() {
    const { onToggleFacetsModal } = this.props
    onToggleFacetsModal(false)
  }

  onApplyClick() {
    const { onApplyViewAllFacets } = this.props
    onApplyViewAllFacets()
  }

  render() {
    const {
      viewAllFacets,
      collectionHits,
      isOpen,
      onChangeViewAllFacet
    } = this.props

    const {
      isLoading,
      selectedCategory
    } = viewAllFacets

    const { [selectedCategory]: selectedFacet = {} } = viewAllFacets.byId

    const isFirstLoad = isLoading && !viewAllFacets.allIds.length

    const viewAllFacetHandler = (e, facetLinkInfo) => {
      changeViewAllFacet(e, facetLinkInfo, onChangeViewAllFacet)
    }

    const modalInnerClassNames = classNames({
      'modal__inner-body': true,
      'facets-modal__inner-body': true,
      'facets-modal__inner-body--loading': isFirstLoad
    })

    if (!selectedCategory) return null

    return (
      <Modal
        dialogClassName="facets-modal modal--full modal--has-inner-header"
        show={isOpen}
        onHide={this.onModalClose}
        centered
        size="lg"
        aria-labelledby="modal__facets-modal"
      >
        <Modal.Header
          className="facets-modal__header"
          closeButton
        >
          <Modal.Title
            id="modal__facets-modal"
            className="facets-modal__title"
          >
            {`Filter collections by ${selectedCategory}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="facets-modal__body">
          <FacetsModalNav
            activeLetters={selectedFacet.startingLetters}
            modalInnerRef={this.modalInner}
          />
          <div className={modalInnerClassNames} ref={this.modalInner}>
            {
              isFirstLoad
                ? (
                  <Spinner type="dots" />
                )
                : (
                  <FacetsList
                    sortBy="alpha"
                    facetCategory={selectedCategory}
                    facets={selectedFacet.children}
                    liftSelectedFacets={false}
                    changeHandler={viewAllFacetHandler}
                    variation="light"
                  />
                )
            }
          </div>
        </Modal.Body>
        <Modal.Footer className="facets-modal__footer">
          <div>
            {
              !isLoading && (
                <span className="facets-modal__hits">{`${collectionHits} Matching Collections`}</span>
              )
            }
          </div>
          <div>
            <Button
              className="facets-modal__action facets-modal__action--cancel"
              variant="light"
              onClick={this.onModalClose}
            >
              Cancel
            </Button>
            <Button
              className="facets-modal__action facets-modal__action--apply"
              variant="primary"
              onClick={this.onApplyClick}
            >
              Apply
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}

FacetsModal.defaultProps = {
  collectionHits: null
}

FacetsModal.propTypes = {
  collectionHits: PropTypes.string,
  viewAllFacets: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onApplyViewAllFacets: PropTypes.func.isRequired,
  onChangeViewAllFacet: PropTypes.func.isRequired,
  onToggleFacetsModal: PropTypes.func.isRequired
}

export default FacetsModal
