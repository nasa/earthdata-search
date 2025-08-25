import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { metricsAddCollectionProject } from '../../middleware/metrics/actions'

import CollectionResultsBody from '../../components/CollectionResults/CollectionResultsBody'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuery } from '../../zustand/selectors/query'

export const mapDispatchToProps = (dispatch) => ({
  onMetricsAddCollectionProject:
    (data) => dispatch(metricsAddCollectionProject(data))
})

export const CollectionResultsBodyContainer = (props) => {
  const {
    onMetricsAddCollectionProject,
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
      loadNextPage={loadNextPage}
      onMetricsAddCollectionProject={onMetricsAddCollectionProject}
      panelView={panelView}
    />
  )
}

CollectionResultsBodyContainer.propTypes = {
  onMetricsAddCollectionProject: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired
}

export default connect(null, mapDispatchToProps)(CollectionResultsBodyContainer)
