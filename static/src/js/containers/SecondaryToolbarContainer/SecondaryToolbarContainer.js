import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions/index'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'
import { locationPropType } from '../../util/propTypes/location'

import SecondaryToolbar from '../../components/SecondaryToolbar/SecondaryToolbar'

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(actions.logout()),
  onUpdateProjectName: name => dispatch(actions.updateProjectName(name)),
  onChangePath: path => dispatch(actions.changePath(path))
})

const mapStateToProps = state => ({
  authToken: state.authToken,
  earthdataEnvironment: getEarthdataEnvironment(state),
  portal: state.portal,
  projectCollectionIds: state.project.collections.allIds,
  savedProject: state.savedProject
})

export const SecondaryToolbarContainer = (props) => {
  const {
    authToken,
    earthdataEnvironment,
    location,
    onChangePath,
    onLogout,
    onUpdateProjectName,
    portal,
    projectCollectionIds,
    savedProject
  } = props

  return (
    <SecondaryToolbar
      authToken={authToken}
      earthdataEnvironment={earthdataEnvironment}
      location={location}
      onChangePath={onChangePath}
      onLogout={onLogout}
      onUpdateProjectName={onUpdateProjectName}
      portal={portal}
      projectCollectionIds={projectCollectionIds}
      savedProject={savedProject}
    />
  )
}

SecondaryToolbarContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  earthdataEnvironment: PropTypes.string.isRequired,
  location: locationPropType.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  portal: PropTypes.shape({}).isRequired,
  projectCollectionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  savedProject: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SecondaryToolbarContainer)
)
