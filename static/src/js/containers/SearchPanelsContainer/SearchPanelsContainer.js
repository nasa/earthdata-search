import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import actions from '../../actions/index'
import SearchPanels from '../../components/SearchPanels/SearchPanels'

const mapStateToProps = state => ({
  panels: state.panels,
  preferences: state.preferences.preferences
})

const mapDispatchToProps = dispatch => ({
  onTogglePanels:
    value => dispatch(actions.togglePanels(value)),
  onSetActivePanel:
    panelId => dispatch(actions.setActivePanel(panelId))
})

export const SearchPanelsContainer = ({
  onTogglePanels,
  onSetActivePanel,
  panels,
  preferences,
  match
}) => (
  <SearchPanels
    onTogglePanels={onTogglePanels}
    onSetActivePanel={onSetActivePanel}
    panels={panels}
    preferences={preferences}
    match={match}
  />
)

SearchPanelsContainer.propTypes = {
  match: PropTypes.shape({}).isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  preferences: PropTypes.shape({}).isRequired
}


export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchPanelsContainer)
)
