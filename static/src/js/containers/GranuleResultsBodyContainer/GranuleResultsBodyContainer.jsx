import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import { metricsAddGranuleProject, metricsDataAccess } from '../../middleware/metrics/actions'

import GranuleResultsBody from '../../components/GranuleResults/GranuleResultsBody'

import useEdscStore from '../../zustand/useEdscStore'
import { getFocusedCollectionGranuleQuery } from '../../zustand/selectors/query'
import { getCollectionId, getFocusedCollectionMetadata } from '../../zustand/selectors/collection'

export const mapDispatchToProps = (dispatch) => ({
  onGenerateNotebook:
    (data) => dispatch(actions.generateNotebook(data)),
  onMetricsAddGranuleProject:
      (data) => dispatch(metricsAddGranuleProject(data)),
  onMetricsDataAccess:
    (data) => dispatch(metricsDataAccess(data))
})

export const mapStateToProps = (state) => ({
  generateNotebook: state.ui.generateNotebook
})

export const GranuleResultsBodyContainer = (props) => {
  const {
    generateNotebook,
    onGenerateNotebook,
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
      generateNotebook={generateNotebook}
      isOpenSearch={isOpenSearch}
      loadNextPage={loadNextPage}
      onGenerateNotebook={onGenerateNotebook}
      onMetricsDataAccess={onMetricsDataAccess}
      onMetricsAddGranuleProject={onMetricsAddGranuleProject}
      panelView={panelView}
    />
  )
}

GranuleResultsBodyContainer.propTypes = {
  generateNotebook: PropTypes.shape({}).isRequired,
  onGenerateNotebook: PropTypes.func.isRequired,
  onMetricsAddGranuleProject: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(GranuleResultsBodyContainer)
