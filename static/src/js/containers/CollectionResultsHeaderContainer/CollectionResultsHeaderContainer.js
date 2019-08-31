import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CollectionResultsHeader from '../../components/CollectionResults/CollectionResultsHeader'
import actions from '../../actions'

const mapDispatchToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query))
})

const mapStateToProps = state => ({
  collectionQuery: state.query.collection,
  portal: state.portal
})

export const CollectionResultsHeaderContainer = ({
  collectionQuery,
  portal,
  onChangeQuery
}) => (
  <CollectionResultsHeader
    collectionQuery={collectionQuery}
    portal={portal}
    onChangeQuery={onChangeQuery}
  />
)

CollectionResultsHeaderContainer.propTypes = {
  collectionQuery: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionResultsHeaderContainer)
