import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { locationPropType } from '../../util/propTypes/location'
import actions from '../../actions/index'

import { metricsAddGranuleProject, metricsDataAccess } from '../../middleware/metrics/actions'

import { getCollectionsQuerySpatial, getFocusedCollectionGranuleQuery } from '../../selectors/query'
import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import {
  getFocusedCollectionMetadata,
  getFocusedCollectionTags
} from '../../selectors/collectionMetadata'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getGranulesMetadata } from '../../selectors/granuleMetadata'

import GranuleResultsBody from '../../components/GranuleResults/GranuleResultsBody'

export const mapDispatchToProps = (dispatch) => ({
  onChangeGranulePageNum:
    (data) => dispatch(actions.changeGranulePageNum(data)),
  onExcludeGranule:
    (data) => dispatch(actions.excludeGranule(data)),
  onFocusedGranuleChange:
    (granuleId) => dispatch(actions.changeFocusedGranule(granuleId)),
  onGenerateNotebook:
    (data) => dispatch(actions.generateNotebook(data)),
  onMetricsAddGranuleProject:
      (data) => dispatch(metricsAddGranuleProject(data)),
  onMetricsDataAccess:
    (data) => dispatch(metricsDataAccess(data)),
  onAddGranuleToProjectCollection:
    (data) => dispatch(actions.addGranuleToProjectCollection(data)),
  onRemoveGranuleFromProjectCollection:
    (data) => dispatch(actions.removeGranuleFromProjectCollection(data))
})

export const mapStateToProps = (state) => ({
  collectionMetadata: getFocusedCollectionMetadata(state),
  collectionTags: getFocusedCollectionTags(state),
  collectionQuerySpatial: getCollectionsQuerySpatial(state),
  focusedCollectionId: getFocusedCollectionId(state),
  focusedGranuleId: getFocusedGranuleId(state),
  generateNotebook: state.ui.generateNotebook,
  granuleQuery: getFocusedCollectionGranuleQuery(state),
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  granulesMetadata: getGranulesMetadata(state),
  portal: state.portal,
  project: state.project
})

export const GranuleResultsBodyContainer = (props) => {
  const {
    collectionMetadata,
    collectionQuerySpatial,
    collectionTags,
    focusedCollectionId,
    focusedGranuleId,
    generateNotebook,
    granuleQuery,
    granuleSearchResults,
    granulesMetadata,
    location,
    onAddGranuleToProjectCollection,
    onChangeGranulePageNum,
    onExcludeGranule,
    onFocusedGranuleChange,
    onGenerateNotebook,
    onMetricsAddGranuleProject,
    onMetricsDataAccess,
    onRemoveGranuleFromProjectCollection,
    panelView,
    portal,
    project
  } = props

  const {
    pageNum = 1
  } = granuleQuery

  const {
    isOpenSearch = false,
    directDistributionInformation = {}
  } = collectionMetadata

  const loadNextPage = () => {
    onChangeGranulePageNum({
      collectionId: focusedCollectionId,
      pageNum: pageNum + 1
    })
  }

  return (
    <GranuleResultsBody
      collectionId={focusedCollectionId}
      collectionQuerySpatial={collectionQuerySpatial}
      collectionTags={collectionTags}
      directDistributionInformation={directDistributionInformation}
      focusedGranuleId={focusedGranuleId}
      generateNotebook={generateNotebook}
      granuleSearchResults={granuleSearchResults}
      granulesMetadata={granulesMetadata}
      granuleQuery={granuleQuery}
      isOpenSearch={isOpenSearch}
      loadNextPage={loadNextPage}
      location={location}
      onAddGranuleToProjectCollection={onAddGranuleToProjectCollection}
      onExcludeGranule={onExcludeGranule}
      onFocusedGranuleChange={onFocusedGranuleChange}
      onGenerateNotebook={onGenerateNotebook}
      onMetricsDataAccess={onMetricsDataAccess}
      onMetricsAddGranuleProject={onMetricsAddGranuleProject}
      onRemoveGranuleFromProjectCollection={onRemoveGranuleFromProjectCollection}
      panelView={panelView}
      portal={portal}
      project={project}
    />
  )
}

GranuleResultsBodyContainer.propTypes = {
  collectionMetadata: PropTypes.shape({
    directDistributionInformation: PropTypes.shape({}),
    isOpenSearch: PropTypes.bool
  }).isRequired,
  collectionQuerySpatial: PropTypes.shape({}).isRequired,
  collectionTags: PropTypes.shape({}).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  generateNotebook: PropTypes.shape({}).isRequired,
  granuleQuery: PropTypes.shape({
    pageNum: PropTypes.number
  }).isRequired,
  granuleSearchResults: PropTypes.shape({}).isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  onAddGranuleToProjectCollection: PropTypes.func.isRequired,
  onChangeGranulePageNum: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onGenerateNotebook: PropTypes.func.isRequired,
  onMetricsAddGranuleProject: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired,
  portal: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsBodyContainer)
)
