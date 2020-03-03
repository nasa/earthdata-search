import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'

import CollectionResultsBodyContainer
  from '../../containers/CollectionResultsBodyContainer/CollectionResultsBodyContainer'
import CollectionResultsHeaderContainer
  from '../../containers/CollectionResultsHeaderContainer/CollectionResultsHeaderContainer'
import GranuleResultsBodyContainer
  from '../../containers/GranuleResultsBodyContainer/GranuleResultsBodyContainer'
import GranuleResultsHeaderContainer
  from '../../containers/GranuleResultsHeaderContainer/GranuleResultsHeaderContainer'

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
    const {
      match
    } = this.props

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

    panelSection.push(
      <PanelGroup
        key="granule-results-panel"
        header={
          <GranuleResultsHeaderContainer onPanelClose={this.onPanelClose} />
        }
      >
        <PanelItem>
          <GranuleResultsBodyContainer />
        </PanelItem>
      </PanelGroup>
    )

    return (
      <Switch key="panel-children">
        <Route
          path={`${match.url}/:activePanel?`}
          render={
          (props) => {
            const { match = {} } = props
            const { params = {} } = match
            const { activePanel: activePanelFromProps = '' } = params
            let activePanel = '0.0.0'

            switch (activePanelFromProps) {
              case 'granules':
                activePanel = '0.1.0'
                break
              default:
                activePanel = '0.0.0'
            }

            return (
              <Panels
                show
                activePanel={activePanel}
              >
                <PanelSection>
                  {panelSection}
                </PanelSection>
              </Panels>
            )
          }
        }
        />
      </Switch>
    )
  }
}

SearchPanels.propTypes = {
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired
}

export default withRouter(SearchPanels)
