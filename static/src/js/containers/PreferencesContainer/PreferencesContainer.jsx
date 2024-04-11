import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import Preferences from '../../components/Preferences/Preferences'

export const mapStateToProps = (state) => ({
  preferences: state.preferences
})

export const mapDispatchToProps = (dispatch) => ({
  onUpdatePreferences: (data) => dispatch(actions.updatePreferences(data))
})

export const PreferencesContainer = ({ preferences, onUpdatePreferences }) => (
  <Preferences
    preferences={preferences}
    onUpdatePreferences={onUpdatePreferences}
  />
)

PreferencesContainer.propTypes = {
  preferences: PropTypes.shape({}).isRequired,
  onUpdatePreferences: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PreferencesContainer)
)
