import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions/index'
import { metricsDataAccess } from '../../middleware/metrics/actions'
import { getFocusedCollectionObject } from '../../util/focusedCollection'

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
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  focusedGranule: state.focusedGranule,
  granuleQuery: state.query.granule,
  portal: state.portal,
  project: state.project
})

export const GranuleResultsBodyContainer = (props) => {
  const {
    collections,
    focusedCollection,
    focusedGranule,
    granuleQuery,
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

  const collectionObject = getFocusedCollectionObject(focusedCollection, collections)

  const {
    excludedGranuleIds = [],
    granules = {},
    metadata: collectionMetadata = {}
  } = collectionObject

  const { isCwic = false } = collectionMetadata

  const loadNextPage = () => {
    const { pageNum } = granuleQuery
    onChangeGranulePageNum({
      collectionId: focusedCollection,
      pageNum: pageNum + 1
    })
  }

  return (
    <GranuleResultsBody
      collectionId={focusedCollection}
      excludedGranuleIds={excludedGranuleIds}
      focusedGranule={focusedGranule}
      granules={granules}
      isCwic={isCwic}
      location={location}
      loadNextPage={loadNextPage}
      onExcludeGranule={onExcludeGranule}
      onFocusedGranuleChange={onFocusedGranuleChange}
      onMetricsDataAccess={onMetricsDataAccess}
      panelView={panelView}
      portal={portal}
      project={project}
      onAddGranuleToProjectCollection={onAddGranuleToProjectCollection}
      onRemoveGranuleFromProjectCollection={onRemoveGranuleFromProjectCollection}
    />
  )
}

GranuleResultsBodyContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  focusedGranule: PropTypes.string.isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
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
