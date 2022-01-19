import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import TemporalDisplay from '../../components/TemporalDisplay/TemporalDisplay'

export const mapDispatchToProps = (dispatch) => ({
  onRemoveTimelineFilter: () => dispatch(actions.removeTemporalFilter())
})

export const mapStateToProps = (state) => ({
  temporalSearch: state.query.collection.temporal
})

export const TemporalDisplayContainer = ({
  onRemoveTimelineFilter,
  temporalSearch
}) => (
  <TemporalDisplay
    temporalSearch={temporalSearch}
    onRemoveTimelineFilter={onRemoveTimelineFilter}
  />
)

TemporalDisplayContainer.defaultProps = {
  temporalSearch: {}
}

TemporalDisplayContainer.propTypes = {
  onRemoveTimelineFilter: PropTypes.func.isRequired,
  temporalSearch: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(TemporalDisplayContainer)
