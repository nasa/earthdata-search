import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions/index'

import { metricsDataAccess } from '../../middleware/metrics/actions'

import { getFocusedCollectionGranuleQuery } from '../../selectors/query'
import { getFocusedCollectionGranuleResults } from '../../selectors/collectionResults'
import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import GranuleResultsBody from '../../components/GranuleResults/GranuleResultsBody'

const mapDispatchToProps = dispatch => ({
  onChangeGranulePageNum:
    data => dispatch(actions.changeGranulePageNum(data)),
  onExcludeGranule:
    data => dispatch(actions.excludeGranule(data)),
  onFocusedGranuleChange:
    granuleId => dispatch(actions.changeFocusedGranule(granuleId)),
  onMetricsDataAccess:
    data => dispatch(metricsDataAccess(data)),
  onAddGranuleToProjectCollection:
    data => dispatch(actions.addGranuleToProjectCollection(data)),
  onRemoveGranuleFromProjectCollection:
    data => dispatch(actions.removeGranuleFromProjectCollection(data))
})

const mapStateToProps = state => ({
  collectionMetadata: getFocusedCollectionMetadata(state),
  focusedCollection: state.focusedCollection,
  focusedGranule: state.focusedGranule,
  granuleQuery: getFocusedCollectionGranuleQuery(state),
  granuleSearchResults: getFocusedCollectionGranuleResults(state),
  granulesMetadata: state.metadata.granules,
  portal: state.portal,
  project: state.project
})

export const GranuleResultsBodyContainer = (props) => {
  const {
    collectionMetadata,
    focusedCollection,
    focusedGranule,
    granuleQuery,
    granuleSearchResults,
    granulesMetadata,
    location,
    onAddGranuleToProjectCollection,
    onChangeGranulePageNum,
    onExcludeGranule,
    onFocusedGranuleChange,
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
    isCwic = false
  } = collectionMetadata

  const loadNextPage = () => {
    onChangeGranulePageNum({
      collectionId: focusedCollection,
      pageNum: pageNum + 1
    })
  }

  return (
    <GranuleResultsBody
      collectionId={focusedCollection}
      focusedGranule={focusedGranule}
      granuleQuery={granuleQuery}
      granuleSearchResults={granuleSearchResults}
      granulesMetadata={granulesMetadata}
      isCwic={isCwic}
      loadNextPage={loadNextPage}
      location={location}
      onAddGranuleToProjectCollection={onAddGranuleToProjectCollection}
      onExcludeGranule={onExcludeGranule}
      onFocusedGranuleChange={onFocusedGranuleChange}
      onMetricsDataAccess={onMetricsDataAccess}
      onRemoveGranuleFromProjectCollection={onRemoveGranuleFromProjectCollection}
      panelView={panelView}
      portal={portal}
      project={project}
    />
  )
}

GranuleResultsBodyContainer.propTypes = {
  collectionMetadata: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  focusedGranule: PropTypes.string.isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
  granuleSearchResults: PropTypes.shape({}).isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddGranuleToProjectCollection: PropTypes.func.isRequired,
  onChangeGranulePageNum: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired,
  panelView: PropTypes.string.isRequired,
  portal: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsBodyContainer)
)
