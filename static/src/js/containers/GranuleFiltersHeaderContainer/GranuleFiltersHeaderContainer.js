import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getFocusedCollectionMetadata } from '../../util/focusedCollection'

import GranuleFiltersHeader from '../../components/GranuleFilters/GranuleFiltersHeader'

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection
})

export const GranuleFiltersHeaderContainer = ({
  collections,
  focusedCollection
}) => {
  const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

  if (Object.keys(focusedCollectionMetadata).length === 0) return null

  const { metadata = {} } = focusedCollectionMetadata[focusedCollection]
  const { dataset_id: datasetId } = metadata

  return (
    <GranuleFiltersHeader
      datasetId={datasetId}
    />
  )
}

GranuleFiltersHeaderContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired
}

export default connect(mapStateToProps, null)(GranuleFiltersHeaderContainer)
