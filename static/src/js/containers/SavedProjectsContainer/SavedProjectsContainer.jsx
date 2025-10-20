import React from 'react'
import { connect } from 'react-redux'

import SavedProjects from '../../components/SavedProjects/SavedProjects'

export const mapDispatchToProps = () => ({})

export const SavedProjectsContainer = () => (
  <SavedProjects />
)

SavedProjectsContainer.propTypes = {}

export default connect(null, mapDispatchToProps)(SavedProjectsContainer)
