import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'
import SearchPanels from '../../components/SearchPanels/SearchPanels'

const mapStateToProps = state => ({
  panels: state.panels
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
  panels
}) => (
  <SearchPanels
    onTogglePanels={onTogglePanels}
    onSetActivePanel={onSetActivePanel}
    panels={panels}
  />
)

SearchPanelsContainer.propTypes = {
  onTogglePanels: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchPanelsContainer)
