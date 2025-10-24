import React from 'react'
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
  onLogout: () => dispatch(actions.logout())
})

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
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
    onLogout,
    retrieval,
    ursProfile
  } = props

  const projectCollectionIds = useEdscStore(getProjectCollectionsIds)

  if (!secondaryToolbarEnabled) {
    return null
  }

  return (
    <SecondaryToolbar
      authToken={authToken}
      location={location}
      onLogout={onLogout}
      projectCollectionIds={projectCollectionIds}
      retrieval={retrieval}
      ursProfile={ursProfile}
    />
  )
}

SecondaryToolbarContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
  retrieval: PropTypes.shape({}).isRequired,
  ursProfile: PropTypes.shape({
    first_name: PropTypes.string
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SecondaryToolbarContainer)
