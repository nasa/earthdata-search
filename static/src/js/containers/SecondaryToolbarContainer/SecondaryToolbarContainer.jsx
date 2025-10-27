import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import SecondaryToolbar from '../../components/SecondaryToolbar/SecondaryToolbar'

import useEdscStore from '../../zustand/useEdscStore'
import { getProjectCollectionsIds } from '../../zustand/selectors/project'

export const mapStateToProps = (state) => ({
  retrieval: state.retrieval
})

export const SecondaryToolbarContainer = ({
  retrieval
}) => {
  const location = useLocation()
  const { disableDatabaseComponents } = getApplicationConfig()
  let secondaryToolbarEnabled = true

  if (disableDatabaseComponents === 'true') secondaryToolbarEnabled = false

  const projectCollectionIds = useEdscStore(getProjectCollectionsIds)

  if (!secondaryToolbarEnabled) {
    return null
  }

  return (
    <SecondaryToolbar
      location={location}
      projectCollectionIds={projectCollectionIds}
      retrieval={retrieval}
    />
  )
}

SecondaryToolbarContainer.propTypes = {
  retrieval: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps)(SecondaryToolbarContainer)
