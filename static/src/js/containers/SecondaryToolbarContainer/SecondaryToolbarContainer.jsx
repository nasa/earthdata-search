import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import { getUrsProfile } from '../../selectors/contactInfo'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import SecondaryToolbar from '../../components/SecondaryToolbar/SecondaryToolbar'
import useEdscStore from '../../zustand/useEdscStore'

export const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch(actions.logout()),
  onUpdateProjectName: (name) => dispatch(actions.updateProjectName(name)),
  onFetchContactInfo: () => dispatch(actions.fetchContactInfo())
})

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  earthdataEnvironment: getEarthdataEnvironment(state),
  projectCollectionIds: state.project.collections.allIds,
  savedProject: state.savedProject,
  retrieval: state.retrieval,
  ursProfile: getUrsProfile(state)
})

export const SecondaryToolbarContainer = (props) => {
  const location = useEdscStore((state) => state.location.location)

  const { disableDatabaseComponents } = getApplicationConfig()
  let secondaryToolbarEnabled = true

  if (disableDatabaseComponents === 'true') secondaryToolbarEnabled = false

  const {
    authToken,
    earthdataEnvironment,
    onLogout,
    onUpdateProjectName,
    projectCollectionIds,
    savedProject,
    retrieval,
    ursProfile,
    onFetchContactInfo
  } = props

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
      earthdataEnvironment={earthdataEnvironment}
      location={location}
      onLogout={onLogout}
      onUpdateProjectName={onUpdateProjectName}
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
  onFetchContactInfo: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  projectCollectionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  retrieval: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired,
  ursProfile: PropTypes.shape({
    first_name: PropTypes.string
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondaryToolbarContainer)
