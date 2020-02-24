import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import CollectionResultsBodyContainer
  from '../../containers/CollectionResultsBodyContainer/CollectionResultsBodyContainer'
import CollectionResultsHeaderContainer
  from '../../containers/CollectionResultsHeaderContainer/CollectionResultsHeaderContainer'

import Panels from '../Panels/Panels'
import PanelGroup from '../Panels/PanelGroup'
import PanelItem from '../Panels/PanelItem'
import PanelSection from '../Panels/PanelSection'

import './SearchPanels.scss'

/**
 * Renders SearchPanels.
 * @param {object} props - The props passed into the component.
 * @param {object} props.panels - The current panels state.
 * @param {function} props.onTogglePanels - Toggles the panels opened or closed.
 * @param {function} props.onSetActivePanel - Switches the currently active panel.
 */

class SearchPanels extends PureComponent {
  constructor(props) {
    super(props)

    this.onPanelClose = this.onPanelClose.bind(this)
    this.onChangePanel = this.onChangePanel.bind(this)
  }

  onPanelClose() {
    const { onTogglePanels } = this.props
    onTogglePanels(false)
  }

  onChangePanel(panelId) {
    const { onSetActivePanel } = this.props
    onSetActivePanel(panelId)
  }

  render() {
    const panelSection = []

    panelSection.push(
      <PanelGroup
        key="collection-results-panel"
        header={<CollectionResultsHeaderContainer onPanelClose={this.onPanelClose} />}
      >
        <PanelItem>
          <CollectionResultsBodyContainer />
        </PanelItem>
      </PanelGroup>
    )

    return (
      <Panels
        show
        activePanel="0.0.0"
      >
        <PanelSection>
          {panelSection}
        </PanelSection>
        <PanelSection>
          {panelSection}
        </PanelSection>
      </Panels>
    )
  }
}

SearchPanels.propTypes = {
  onTogglePanels: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired
}

export default SearchPanels
