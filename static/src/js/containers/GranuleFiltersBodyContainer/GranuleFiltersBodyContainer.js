import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getFocusedCollectionMetadata } from '../../util/focusedCollection'

import GranuleFiltersBody from '../../components/GranuleFilters/GranuleFiltersBody'

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection
})

export const GranuleFiltersBodyContainer = ({
  collections,
  focusedCollection,
  granuleFilters,
  onUpdateGranuleFilters
}) => {
  const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

  if (Object.keys(focusedCollectionMetadata).length === 0) return null

  const { metadata } = focusedCollectionMetadata[focusedCollection]

  return (
    <GranuleFiltersBody
      focusedCollection={focusedCollection}
      metadata={metadata}
      granuleFilters={granuleFilters}
      onUpdateGranuleFilters={onUpdateGranuleFilters}
    />
  )
}

GranuleFiltersBodyContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  granuleFilters: PropTypes.shape({}).isRequired,
  onUpdateGranuleFilters: PropTypes.func.isRequired
}

export default connect(mapStateToProps, null)(GranuleFiltersBodyContainer)
