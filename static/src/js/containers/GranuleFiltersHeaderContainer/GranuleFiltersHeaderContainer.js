import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import GranuleFiltersHeader from '../../components/GranuleFilters/GranuleFiltersHeader'

const mapStateToProps = state => ({
  collectionMetadata: getFocusedCollectionMetadata(state)
})

/**
 * Renders GranuleFiltersHeaderContainer.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionMetadata - The focused collection id.
 */
export const GranuleFiltersHeaderContainer = ({
  collectionMetadata
}) => {
  const { title } = collectionMetadata

  return (
    <GranuleFiltersHeader
      title={title}
    />
  )
}

GranuleFiltersHeaderContainer.propTypes = {
  collectionMetadata: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, null)(GranuleFiltersHeaderContainer)
