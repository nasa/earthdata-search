import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'
import getFocusedCollectionMetadata from '../../util/focusedCollection'

import GranuleResultsBody from '../../components/GranuleResults/GranuleResultsBody'

const mapDispatchToProps = dispatch => ({
  onChangeGranulePageNum:
    data => dispatch(actions.changeGranulePageNum(data)),
  onExcludeGranule:
    data => dispatch(actions.excludeGranule(data))
})

const mapStateToProps = state => ({
  collections: state.collections,
  focusedCollection: state.focusedCollection,
  granules: state.searchResults.granules,
  granuleQuery: state.query.granule
})

export const GranuleResultsBodyContainer = (props) => {
  const {
    collections,
    focusedCollection,
    granules,
    granuleQuery,
    onChangeGranulePageNum,
    onExcludeGranule
  } = props

  const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

  if (Object.keys(focusedCollectionMetadata).length === 0) return null

  const { pageNum } = granuleQuery

  const onWaypointEnter = (params) => {
    if (params.event !== null) {
      onChangeGranulePageNum(pageNum + 1)
    }
  }

  const { excludedGranuleIds } = collections.byId[focusedCollection]

  return (
    <GranuleResultsBody
      collectionId={focusedCollection}
      excludedGranuleIds={excludedGranuleIds}
      granules={granules}
      pageNum={pageNum}
      waypointEnter={onWaypointEnter}
      onExcludeGranule={onExcludeGranule}
    />
  )
}

GranuleResultsBodyContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
  onChangeGranulePageNum: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(GranuleResultsBodyContainer)
