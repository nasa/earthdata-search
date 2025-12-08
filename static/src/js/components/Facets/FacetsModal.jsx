import React from 'react'
import PropTypes from 'prop-types'

import { changeViewAllFacet } from '../../util/facets'
import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import FacetsList from './FacetsList'
import FacetsModalNav from './FacetsModalNav'
import Skeleton from '../Skeleton/Skeleton'

import useEdscStore from '../../zustand/useEdscStore'
import { isModalOpen, setOpenModalFunction } from '../../zustand/selectors/ui'

import { MODAL_NAMES } from '../../constants/modalNames'

import './FacetsModal.scss'

const matchingCollectionsSkeleton = [
  {
    shape: 'rectangle',
    left: 2,
    top: 10,
    height: 18.5,
    width: '100%',
    radius: 2
  }
]

const FacetsModal = ({
  collectionHits = null,
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
  const isOpen = useEdscStore((state) => isModalOpen(state, MODAL_NAMES.VIEW_ALL_FACETS))
  const setOpenModal = useEdscStore(setOpenModalFunction)

  if (!isOpen || !selectedCategory) return null

  const onModalClose = () => {
    setOpenModal(null)
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

  const footerMeta = isLoading
    ? (
      <Skeleton
        containerStyle={
          {
            height: '40px',
            width: '13rem'
          }
        }
        shapes={matchingCollectionsSkeleton}
      />
    )
    : (
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

FacetsModal.propTypes = {
  collectionHits: PropTypes.number,
  onToggleFacetsModal: PropTypes.func.isRequired,
  viewAllFacets: PropTypes.shape({
    allIds: PropTypes.arrayOf(PropTypes.string),
    byId: PropTypes.shape({}),
    isLoading: PropTypes.bool,
    selectedCategory: PropTypes.string
  }).isRequired
}

export default FacetsModal
