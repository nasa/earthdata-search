import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import { metricsAddCollectionProject } from '../../middleware/metrics/actions'

import CollectionResultsBody from '../../components/CollectionResults/CollectionResultsBody'

export const mapStateToProps = (state) => ({
  collectionsSearch: state.searchResults.collections,
  collectionsMetadata: state.metadata.collections,
  query: state.query.collection
})

export const mapDispatchToProps = (dispatch) => ({
  onViewCollectionGranules:
    (collectionId) => dispatch(actions.viewCollectionGranules(collectionId)),
  onViewCollectionDetails:
    (collectionId) => dispatch(actions.viewCollectionDetails(collectionId)),
  onChangeCollectionPageNum:
    (data) => dispatch(actions.changeCollectionPageNum(data)),
  onMetricsAddCollectionProject:
    (data) => dispatch(metricsAddCollectionProject(data))
})

export const CollectionResultsBodyContainer = (props) => {
  const {
    collectionsMetadata,
    collectionsSearch,
    onChangeCollectionPageNum,
    onMetricsAddCollectionProject,
    onViewCollectionDetails,
    onViewCollectionGranules,
    panelView,
    query
  } = props

  const loadNextPage = () => {
    const { pageNum } = query

    onChangeCollectionPageNum(pageNum + 1)
  }

  return (
    <CollectionResultsBody
      collectionsMetadata={collectionsMetadata}
      collectionsSearch={collectionsSearch}
      loadNextPage={loadNextPage}
      onMetricsAddCollectionProject={onMetricsAddCollectionProject}
      onViewCollectionDetails={onViewCollectionDetails}
      onViewCollectionGranules={onViewCollectionGranules}
      panelView={panelView}
    />
  )
}

CollectionResultsBodyContainer.propTypes = {
  collectionsMetadata: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  onMetricsAddCollectionProject: PropTypes.func.isRequired,
  onChangeCollectionPageNum: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired,
  query: PropTypes.shape({
    pageNum: PropTypes.number
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionResultsBodyContainer)
