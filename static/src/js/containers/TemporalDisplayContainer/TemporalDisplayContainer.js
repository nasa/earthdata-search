import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TemporalDisplay from '../../components/TemporalDisplay/TemporalDisplay'

const mapStateToProps = state => ({
  temporalSearch: state.query.temporal
})

export const TemporalDisplayContainer = ({ temporalSearch }) => (
  <TemporalDisplay temporalSearch={temporalSearch} />
)

TemporalDisplayContainer.defaultProps = {
  temporalSearch: ''
}

TemporalDisplayContainer.propTypes = {
  temporalSearch: PropTypes.string
}

export default connect(mapStateToProps)(TemporalDisplayContainer)
