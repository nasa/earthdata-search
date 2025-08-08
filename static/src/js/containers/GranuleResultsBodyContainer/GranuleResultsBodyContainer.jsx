import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { locationPropType } from '../../util/propTypes/location'
import actions from '../../actions/index'

import { metricsAddGranuleProject, metricsDataAccess } from '../../middleware/metrics/actions'

import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import {
  getFocusedCollectionMetadata,
  getFocusedCollectionTags
} from '../../selectors/collectionMetadata'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getGranulesMetadata } from '../../selectors/granuleMetadata'

import GranuleResultsBody from '../../components/GranuleResults/GranuleResultsBody'

import useEdscStore from '../../zustand/useEdscStore'
import { getFocusedCollectionGranuleQuery } from '../../zustand/selectors/query'
import { getFocusedCollectionId } from '../../zustand/selectors/focusedCollection'

export const mapDispatchToProps = (dispatch) => ({
  onFocusedGranuleChange:
    (granuleId) => dispatch(actions.changeFocusedGranule(granuleId)),
  onGenerateNotebook:
    (data) => dispatch(actions.generateNotebook(data)),
  onMetricsAddGranuleProject:
      (data) => dispatch(metricsAddGranuleProject(data)),
  onMetricsDataAccess:
    (data) => dispatch(metricsDataAccess(data))
})

export const mapStateToProps = (state) => ({
  collectionMetadata: getFocusedCollectionMetadata(state),
  collectionTags: getFocusedCollectionTags(state),
  focusedGranuleId: getFocusedGranuleId(state),
  generateNotebook: state.ui.generateNotebook,
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  granulesMetadata: getGranulesMetadata(state)
})

export const GranuleResultsBodyContainer = (props) => {
  const {
    collectionMetadata,
    collectionTags,
    focusedGranuleId,
    generateNotebook,
    granuleSearchResults,
    granulesMetadata,
    location,
    onFocusedGranuleChange,
    onGenerateNotebook,
    onMetricsAddGranuleProject,
    onMetricsDataAccess,
    panelView
  } = props

  const changeGranuleQuery = useEdscStore((state) => state.query.changeGranuleQuery)
  const granuleQuery = useEdscStore(getFocusedCollectionGranuleQuery)
  const focusedCollectionId = useEdscStore(getFocusedCollectionId)

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
      collectionTags={collectionTags}
      directDistributionInformation={directDistributionInformation}
      focusedGranuleId={focusedGranuleId}
      generateNotebook={generateNotebook}
      granuleSearchResults={granuleSearchResults}
      granulesMetadata={granulesMetadata}
      isOpenSearch={isOpenSearch}
      loadNextPage={loadNextPage}
      location={location}
      onFocusedGranuleChange={onFocusedGranuleChange}
      onGenerateNotebook={onGenerateNotebook}
      onMetricsDataAccess={onMetricsDataAccess}
      onMetricsAddGranuleProject={onMetricsAddGranuleProject}
      panelView={panelView}
    />
  )
}

GranuleResultsBodyContainer.propTypes = {
  collectionMetadata: PropTypes.shape({
    directDistributionInformation: PropTypes.shape({}),
    isOpenSearch: PropTypes.bool
  }).isRequired,
  collectionTags: PropTypes.shape({}).isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  generateNotebook: PropTypes.shape({}).isRequired,
  granuleSearchResults: PropTypes.shape({}).isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onGenerateNotebook: PropTypes.func.isRequired,
  onMetricsAddGranuleProject: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsBodyContainer)
)
