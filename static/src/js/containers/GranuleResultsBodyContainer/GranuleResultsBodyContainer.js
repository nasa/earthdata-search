import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'

import GranuleResultsBody from '../../components/GranuleResults/GranuleResultsBody'

const mapDispatchToProps = dispatch => ({
  onChangeGranulePageNum:
    data => dispatch(actions.changeGranulePageNum(data))
})

const mapStateToProps = state => ({
  granules: state.entities.granules,
  granuleQuery: state.query.granule,
  focusedCollection: state.focusedCollection
})

export const GranuleResultsBodyContainer = (props) => {
  const {
    granules,
    granuleQuery,
    focusedCollection,
    onChangeGranulePageNum
  } = props

  const { pageNum } = granuleQuery

  const onWaypointEnter = (params) => {
    if (params.event !== null) {
      onChangeGranulePageNum(pageNum + 1)
    }
  }

  return (
    <GranuleResultsBody
      granules={granules}
      focusedCollection={focusedCollection}
      pageNum={pageNum}
      waypointEnter={onWaypointEnter}
    />
  )
}

GranuleResultsBodyContainer.defaultProps = {
  focusedCollection: {}
}

GranuleResultsBodyContainer.propTypes = {
  granules: PropTypes.shape({}).isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.shape({}),
  onChangeGranulePageNum: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(GranuleResultsBodyContainer)
