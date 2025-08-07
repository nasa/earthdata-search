import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import { metricsAddCollectionProject } from '../../middleware/metrics/actions'

import CollectionResultsBody from '../../components/CollectionResults/CollectionResultsBody'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuery } from '../../zustand/selectors/query'

export const mapStateToProps = (state) => ({
  collectionsSearch: state.searchResults.collections,
  collectionsMetadata: state.metadata.collections
})

export const mapDispatchToProps = (dispatch) => ({
  onViewCollectionGranules:
    (collectionId) => dispatch(actions.viewCollectionGranules(collectionId)),
  onViewCollectionDetails:
    (collectionId) => dispatch(actions.viewCollectionDetails(collectionId)),
  onMetricsAddCollectionProject:
    (data) => dispatch(metricsAddCollectionProject(data))
})

export const CollectionResultsBodyContainer = (props) => {
  const {
    collectionsMetadata,
    collectionsSearch,
    onMetricsAddCollectionProject,
    onViewCollectionDetails,
    onViewCollectionGranules,
    panelView
  } = props

  const collectionQuery = useEdscStore(getCollectionsQuery)
  const changeQuery = useEdscStore((state) => state.query.changeQuery)

  const loadNextPage = () => {
    const { pageNum } = collectionQuery

    changeQuery({
      collection: {
        pageNum: pageNum + 1
      }
    })
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
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionResultsBodyContainer)
