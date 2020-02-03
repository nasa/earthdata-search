import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { changeViewAllFacet } from '../../util/facets'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import FacetsList from './FacetsList'
import FacetsModalNav from './FacetsModalNav'

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

    if (!selectedCategory) return null

    const innerHeader = (
      <FacetsModalNav
        activeLetters={selectedFacet.startingLetters}
      />
    )

    const body = (
      <FacetsList
        sortBy="alpha"
        facetCategory={selectedCategory}
        facets={selectedFacet.children}
        liftSelectedFacets={false}
        changeHandler={viewAllFacetHandler}
        variation="light"
      />
    )

    const footerMeta = (
      <>
        {
          !isFirstLoad && (
            <span className="facets-modal__hits">{`${collectionHits} Matching Collections`}</span>
          )
        }
      </>
    )

    return (
      <EDSCModalContainer
        className="facets-modal"
        title={`Filter collections by ${selectedCategory}`}
        isOpen={isOpen}
        id="facets"
        size="lg"
        fixedHeight="lg"
        spinner={isFirstLoad}
        bodyPadding={false}
        onClose={this.onModalClose}
        innerHeader={innerHeader}
        footerMeta={footerMeta}
        body={body}
        primaryAction="Apply"
        onPrimaryAction={this.onApplyClick}
        secondaryAction="Cancel"
        onSecondaryAction={this.onModalClose}
      />
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
