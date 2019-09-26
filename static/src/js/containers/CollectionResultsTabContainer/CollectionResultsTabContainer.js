import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import CollectionResultsTab from '../../components/CollectionResults/CollectionResultsTab'

const mapStateToProps = state => ({
  collectionHits: state.searchResults.collections.hits
})

export const CollectionResultsTabContainer = ({ collectionHits }) => (
  <CollectionResultsTab
    collectionHits={collectionHits}
  />
)

CollectionResultsTabContainer.defaultProps = {
  collectionHits: null
}

CollectionResultsTabContainer.propTypes = {
  collectionHits: PropTypes.string
}

export default connect(mapStateToProps, null)(CollectionResultsTabContainer)
