import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import GranuleFiltersHeader from '../../components/GranuleFilters/GranuleFiltersHeader'

const mapStateToProps = state => ({
  collectionMetatadata: getFocusedCollectionMetadata(state)
})

/**
 * Renders GranuleFiltersHeaderContainer.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionMetatadata - The focused collection id.
 */
export const GranuleFiltersHeaderContainer = ({
  collectionMetatadata
}) => {
  const { title } = collectionMetatadata

  return (
    <GranuleFiltersHeader
      title={title}
    />
  )
}

GranuleFiltersHeaderContainer.propTypes = {
  collectionMetatadata: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, null)(GranuleFiltersHeaderContainer)
