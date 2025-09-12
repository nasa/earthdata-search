import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

import actions from '../../actions/index'
import { getUrsProfile } from '../../selectors/contactInfo'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import SecondaryToolbar from '../../components/SecondaryToolbar/SecondaryToolbar'

import useEdscStore from '../../zustand/useEdscStore'
import { getProjectCollectionsIds } from '../../zustand/selectors/project'

export const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch(actions.logout()),
  onUpdateProjectName: (name) => dispatch(actions.updateProjectName(name)),
  onFetchContactInfo: () => dispatch(actions.fetchContactInfo())
})

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  savedProject: state.savedProject,
  retrieval: state.retrieval,
  ursProfile: getUrsProfile(state)
})

export const SecondaryToolbarContainer = (props) => {
  const location = useLocation()
  const { disableDatabaseComponents } = getApplicationConfig()
  let secondaryToolbarEnabled = true

  if (disableDatabaseComponents === 'true') secondaryToolbarEnabled = false

  const {
    authToken,
    onFetchContactInfo,
    onLogout,
    onUpdateProjectName,
    retrieval,
    savedProject,
    ursProfile
  } = props

  const projectCollectionIds = useEdscStore(getProjectCollectionsIds)

  useEffect(() => {
    // If we have a authToken, but no ursProfile, request the contact info
    if (secondaryToolbarEnabled && authToken && !(ursProfile && ursProfile.first_name)) {
      onFetchContactInfo()
    }
  }, [secondaryToolbarEnabled])

  if (!secondaryToolbarEnabled) {
    return null
  }

  return (
    <SecondaryToolbar
      authToken={authToken}
      location={location}
      onLogout={onLogout}
      onUpdateProjectName={onUpdateProjectName}
      projectCollectionIds={projectCollectionIds}
      retrieval={retrieval}
      savedProject={savedProject}
      ursProfile={ursProfile}
    />
  )
}

SecondaryToolbarContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  onFetchContactInfo: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  retrieval: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired,
  ursProfile: PropTypes.shape({
    first_name: PropTypes.string
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondaryToolbarContainer)
