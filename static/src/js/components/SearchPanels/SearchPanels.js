import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Route,
  Switch
} from 'react-router-dom'

import { isEqual, startCase } from 'lodash'

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

    this.state = {
      collectionPanelView: 'list',
      granulePanelView: 'list'
    }

    this.onPanelClose = this.onPanelClose.bind(this)
    this.onChangePanel = this.onChangePanel.bind(this)
    this.onChangeCollectionPanelView = this.onChangeCollectionPanelView.bind(this)
    this.updatePanelViewState = this.updatePanelViewState.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { preferences } = this.props
    const { preferences: prevPreferences } = prevProps

    if (!isEqual(preferences, prevPreferences)) {
      const {
        collectionListView,
        granuleListView
      } = preferences

      const collectionPanelView = collectionListView === 'default' ? 'list' : collectionListView
      const granulePanelView = granuleListView === 'default' ? 'list' : granuleListView

      this.updatePanelViewState({
        collectionPanelView,
        granulePanelView
      })
    }
  }

  onPanelClose() {
    const { onTogglePanels } = this.props
    onTogglePanels(false)
  }

  onChangePanel(panelId) {
    const { onSetActivePanel } = this.props
    onSetActivePanel(panelId)
  }

  onChangeCollectionPanelView(view) {
    this.setState({
      collectionPanelView: view
    })
  }

  onChangeGranulePanelView(view) {
    this.setState({
      granulePanelView: view
    })
  }

  updatePanelViewState(state) {
    this.setState({ ...state })
  }

  render() {
    const {
      match,
      preferences,
      portal
    } = this.props

    const { panelState } = preferences

    const {
      collectionPanelView,
      // eslint-disable-next-line no-unused-vars
      granulePanelView
    } = this.state


    const {
      portalId,
      org = portalId,
      title = portalId
    } = portal

    const buildCollectionResultsBodyFooter = () => {
      if (!portalId.length) return null

      return (
        <div className="search-panels__portal-escape">
          Looking for more collections?
          {' '}
          <a href="/" className="search-panels__portal-escape-link">
            Leave
            {' '}
            {startCase(org)}
            &#39;s
            {' '}
            {startCase(title)}
            {' '}
            Portal
          </a>
        </div>
      )
    }

    const panelSection = []

    panelSection.push(
      <PanelGroup
        key="collection-results-panel"
        header={(
          <CollectionResultsHeaderContainer
            panelView={collectionPanelView}
            onChangePanelView={this.onChangeCollectionPanelView}
          />
        )}
        footer={buildCollectionResultsBodyFooter()}
        onPanelClose={this.onPanelClose}
      >
        <PanelItem scrollable={false}>
          <CollectionResultsBodyContainer panelView={collectionPanelView} />
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
                  className="search-panels"
                  show
                  activePanel={activePanel}
                  draggable
                  panelState={panelState}
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
  match: PropTypes.shape({}).isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  preferences: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired
}

export default SearchPanels
