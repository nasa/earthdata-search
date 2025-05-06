import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import { SavedProjects } from '../../components/SavedProjects/SavedProjects'
import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  earthdataEnvironment: getEarthdataEnvironment(state)
})

export const mapDispatchToProps = (dispatch) => ({
  onChangePath: (path) => dispatch(actions.changePath(path))
})

export const SavedProjectsContainer = (props) => {
  const {
    onChangePath,
    authToken,
    earthdataEnvironment
  } = props

  return (
    <SavedProjects
      authToken={authToken}
      earthdataEnvironment={earthdataEnvironment}
      onChangePath={onChangePath}
    />
  )
}

SavedProjectsContainer.defaultProps = {
  authToken: null
}

SavedProjectsContainer.propTypes = {
  onChangePath: PropTypes.func.isRequired,
  authToken: PropTypes.string,
  earthdataEnvironment: PropTypes.string.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SavedProjectsContainer)
)
