import React from 'react'
import PropTypes from 'prop-types'

import { changeViewAllFacet } from '../../util/facets'
import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import FacetsList from './FacetsList'
import FacetsModalNav from './FacetsModalNav'

import useEdscStore from '../../zustand/useEdscStore'

import './FacetsModal.scss'

const FacetsModal = ({
  collectionHits,
  isOpen,
  onToggleFacetsModal,
  viewAllFacets
}) => {
  const {
    allIds,
    byId,
    isLoading,
    selectedCategory
  } = viewAllFacets

  const {
    applyViewAllFacets,
    setViewAllFacets
  } = useEdscStore((state) => ({
    applyViewAllFacets: state.facetParams.applyViewAllFacets,
    setViewAllFacets: state.facetParams.setViewAllFacets
  }))

  if (!selectedCategory) return null

  const onModalClose = () => {
    onToggleFacetsModal(false)
  }

  const onApplyClick = () => {
    applyViewAllFacets()
  }

  const viewAllFacetHandler = (event, facetLinkInfo) => {
    changeViewAllFacet(
      event,
      {
        params: facetLinkInfo,
        selectedCategory
      },
      setViewAllFacets
    )
  }

  const { [selectedCategory]: selectedFacet = {} } = byId

  const isFirstLoad = isLoading && !allIds.length

  const innerHeader = (
    <FacetsModalNav
      activeLetters={selectedFacet.startingLetters}
    />
  )

  const body = (
    <FacetsList
      changeHandler={viewAllFacetHandler}
      facetCategory={selectedCategory}
      facets={selectedFacet.children}
      liftSelectedFacets={false}
      sortBy="alpha"
      variation="light"
    />
  )

  const footerMeta = !isFirstLoad && (
    <span className="facets-modal__hits">{`${commafy(collectionHits)} Matching ${pluralize('Collection', collectionHits)}`}</span>
  )

  return (
    <EDSCModalContainer
      body={body}
      bodyPadding={false}
      className="facets-modal"
      fixedHeight="lg"
      footerMeta={footerMeta}
      id="facets"
      innerHeader={innerHeader}
      isOpen={isOpen}
      onClose={onModalClose}
      onPrimaryAction={onApplyClick}
      onSecondaryAction={onModalClose}
      primaryAction="Apply"
      secondaryAction="Cancel"
      size="lg"
      spinner={isFirstLoad}
      title={`Filter collections by ${selectedCategory}`}
    />
  )
}

FacetsModal.defaultProps = {
  collectionHits: null
}

FacetsModal.propTypes = {
  collectionHits: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  onToggleFacetsModal: PropTypes.func.isRequired,
  viewAllFacets: PropTypes.shape({
    allIds: PropTypes.arrayOf(PropTypes.string),
    byId: PropTypes.shape({}),
    isLoading: PropTypes.bool,
    selectedCategory: PropTypes.string
  }).isRequired
}

export default FacetsModal
