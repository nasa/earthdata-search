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
import CollectionDetailsHeaderContainer
  from '../../containers/CollectionDetailsHeaderContainer/CollectionDetailsHeaderContainer'
import CollectionDetailsBodyContainer
  from '../../containers/CollectionDetailsBodyContainer/CollectionDetailsBodyContainer'
import GranuleDetailsHeaderContainer
  from '../../containers/GranuleDetailsHeaderContainer/GranuleDetailsHeaderContainer'
import GranuleDetailsBodyContainer
  from '../../containers/GranuleDetailsBodyContainer/GranuleDetailsBodyContainer'

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
        header={<CollectionResultsHeaderContainer />}
        onPanelClose={this.onPanelClose}
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
          <GranuleResultsHeaderContainer />
        }
        onPanelClose={this.onPanelClose}
      >
        <PanelItem>
          <GranuleResultsBodyContainer />
        </PanelItem>
      </PanelGroup>
    )

    panelSection.push(
      <PanelGroup
        key="collection-details-panel"
        header={
          <CollectionDetailsHeaderContainer />
        }
        onPanelClose={this.onPanelClose}
      >
        <PanelItem scrollable={false}>
          <CollectionDetailsBodyContainer />
        </PanelItem>
      </PanelGroup>
    )

    panelSection.push(
      <PanelGroup
        key="granule-details-panel"
        header={
          <GranuleDetailsHeaderContainer />
        }
        onPanelClose={this.onPanelClose}
      >
        <PanelItem>
          <GranuleDetailsBodyContainer />
        </PanelItem>
      </PanelGroup>
    )

    return (
      <Switch key="panel-children">
        <Route
          path={`${match.url}/:activePanel*`}
          render={
          (props) => {
            // React Router does not play nicely with our panel component due to the
            // way the nested panels are implemented. Here we take the route information
            // provided by React Router, and use that to determine which panel should
            // be active at any given time. activePanel will be equal to whichever path
            // is set after "/search"

            const { match = {} } = props
            const { params = {} } = match
            const { activePanel: activePanelFromProps = '' } = params
            let activePanel = '0.0.0'

            switch (activePanelFromProps) {
              case 'granules/granule-details':
                activePanel = '0.3.0'
                break
              case 'granules/collection-details':
                activePanel = '0.2.0'
                break
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
