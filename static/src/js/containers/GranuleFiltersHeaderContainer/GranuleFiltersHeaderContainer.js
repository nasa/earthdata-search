import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getFocusedCollectionMetadata } from '../../util/focusedCollection'

import GranuleFiltersHeader from '../../components/GranuleFilters/GranuleFiltersHeader'

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection
})


/**
 * Renders GranuleFiltersHeaderContainer.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.collections - The collections.
 * @param {String} props.focusedCollection - The focused collection id.
 */
export const GranuleFiltersHeaderContainer = ({
  collections,
  focusedCollection
}) => {
  const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

  if (!focusedCollectionMetadata) return null

  const { dataset_id: datasetId } = focusedCollectionMetadata

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
