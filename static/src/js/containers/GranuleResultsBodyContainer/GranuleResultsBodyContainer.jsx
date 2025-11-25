import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { metricsAddGranuleProject, metricsDataAccess } from '../../middleware/metrics/actions'

import GranuleResultsBody from '../../components/GranuleResults/GranuleResultsBody'

import useEdscStore from '../../zustand/useEdscStore'
import { getFocusedCollectionGranuleQuery } from '../../zustand/selectors/query'
import { getCollectionId, getFocusedCollectionMetadata } from '../../zustand/selectors/collection'

export const mapDispatchToProps = (dispatch) => ({
  onMetricsAddGranuleProject:
      (data) => dispatch(metricsAddGranuleProject(data)),
  onMetricsDataAccess:
    (data) => dispatch(metricsDataAccess(data))
})

export const GranuleResultsBodyContainer = (props) => {
  const {
    onMetricsAddGranuleProject,
    onMetricsDataAccess,
    panelView
  } = props

  const collectionMetadata = useEdscStore(getFocusedCollectionMetadata)
  const changeGranuleQuery = useEdscStore((state) => state.query.changeGranuleQuery)
  const granuleQuery = useEdscStore(getFocusedCollectionGranuleQuery)
  const focusedCollectionId = useEdscStore(getCollectionId)

  const {
    pageNum = 1
  } = granuleQuery

  const {
    isOpenSearch = false,
    directDistributionInformation = {}
  } = collectionMetadata

  const loadNextPage = () => {
    changeGranuleQuery({
      collectionId: focusedCollectionId,
      query: {
        pageNum: pageNum + 1
      }
    })
  }

  return (
    <GranuleResultsBody
      collectionId={focusedCollectionId}
      directDistributionInformation={directDistributionInformation}
      isOpenSearch={isOpenSearch}
      loadNextPage={loadNextPage}
      onMetricsDataAccess={onMetricsDataAccess}
      onMetricsAddGranuleProject={onMetricsAddGranuleProject}
      panelView={panelView}
    />
  )
}

GranuleResultsBodyContainer.propTypes = {
  onMetricsAddGranuleProject: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired
}

export default connect(null, mapDispatchToProps)(GranuleResultsBodyContainer)
