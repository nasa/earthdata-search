import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../../actions'

import SavedProjects from '../../components/SavedProjects/SavedProjects'

export const mapDispatchToProps = (dispatch) => ({
  onHandleError: (errorConfig) => dispatch(actions.handleError(errorConfig))
})

export const SavedProjectsContainer = ({
  onHandleError
}) => (
  <SavedProjects
    onHandleError={onHandleError}
  />
)

SavedProjectsContainer.propTypes = {
  onHandleError: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(SavedProjectsContainer)
