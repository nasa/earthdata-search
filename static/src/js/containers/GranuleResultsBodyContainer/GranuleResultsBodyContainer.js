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
    data => dispatch(metricsDataAccess(data))
})

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  focusedGranule: state.focusedGranule,
  granules: state.searchResults.granules,
  granuleQuery: state.query.granule
})

export const GranuleResultsBodyContainer = (props) => {
  const {
    collections,
    focusedCollection,
    focusedGranule,
    granules,
    granuleQuery,
    isActive,
    location,
    onChangeGranulePageNum,
    onExcludeGranule,
    onFocusedGranuleChange,
    onMetricsDataAccess
  } = props

  const collectionObject = getFocusedCollectionObject(focusedCollection, collections)

  const {
    excludedGranuleIds = [],
    metadata: collectionMetadata
  } = collectionObject

  if (!collectionMetadata) return null

  const { isCwic = false } = collectionMetadata

  const { pageNum } = granuleQuery

  const onWaypointEnter = () => {
    if (isActive) onChangeGranulePageNum(pageNum + 1)
  }

  return (
    <GranuleResultsBody
      collectionId={focusedCollection}
      excludedGranuleIds={excludedGranuleIds}
      focusedGranule={focusedGranule}
      granules={granules}
      isCwic={isCwic}
      pageNum={pageNum}
      location={location}
      waypointEnter={onWaypointEnter}
      onExcludeGranule={onExcludeGranule}
      onFocusedGranuleChange={onFocusedGranuleChange}
      onMetricsDataAccess={onMetricsDataAccess}
    />
  )
}

GranuleResultsBodyContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  focusedGranule: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
  isActive: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onChangeGranulePageNum: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsBodyContainer)
)
