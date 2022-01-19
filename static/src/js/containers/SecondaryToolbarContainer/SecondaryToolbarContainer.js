import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions/index'
import { getUrsProfile } from '../../selectors/contactInfo'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'
import { locationPropType } from '../../util/propTypes/location'

import SecondaryToolbar from '../../components/SecondaryToolbar/SecondaryToolbar'

export const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch(actions.logout()),
  onUpdateProjectName: (name) => dispatch(actions.updateProjectName(name)),
  onChangePath: (path) => dispatch(actions.changePath(path)),
  onFetchContactInfo: () => dispatch(actions.fetchContactInfo())
})

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  earthdataEnvironment: getEarthdataEnvironment(state),
  portal: state.portal,
  projectCollectionIds: state.project.collections.allIds,
  savedProject: state.savedProject,
  retrieval: state.retrieval,
  ursProfile: getUrsProfile(state)
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
    savedProject,
    retrieval,
    ursProfile,
    onFetchContactInfo
  } = props

  useEffect(() => {
    // If we have a authToken, but no ursProfile, request the contact info
    if (authToken && !(ursProfile && ursProfile.first_name)) {
      onFetchContactInfo()
    }
  }, [authToken])

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
      retrieval={retrieval}
      ursProfile={ursProfile}
    />
  )
}

SecondaryToolbarContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  earthdataEnvironment: PropTypes.string.isRequired,
  location: locationPropType.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchContactInfo: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  portal: PropTypes.shape({}).isRequired,
  projectCollectionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  retrieval: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired,
  ursProfile: PropTypes.shape({
    first_name: PropTypes.string
  }).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SecondaryToolbarContainer)
)
