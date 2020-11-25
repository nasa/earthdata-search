import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Route,
  Switch
} from 'react-router-dom'
import { isEqual, startCase } from 'lodash'
import { Col } from 'react-bootstrap'

import { generateHandoffs } from '../../util/handoffs/generateHandoffs'
import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'

import CollectionResultsBodyContainer
  from '../../containers/CollectionResultsBodyContainer/CollectionResultsBodyContainer'
import CollectionDetailsBodyContainer
  from '../../containers/CollectionDetailsBodyContainer/CollectionDetailsBodyContainer'
import GranuleDetailsBodyContainer
  from '../../containers/GranuleDetailsBodyContainer/GranuleDetailsBodyContainer'
import GranuleResultsBodyContainer
  from '../../containers/GranuleResultsBodyContainer/GranuleResultsBodyContainer'
import GranuleResultsActionsContainer
  from '../../containers/GranuleResultsActionsContainer/GranuleResultsActionsContainer'


import Button from '../Button/Button'
import Panels from '../Panels/Panels'
import PanelGroup from '../Panels/PanelGroup'
import PanelItem from '../Panels/PanelItem'
import PanelSection from '../Panels/PanelSection'
import { isDefaultPortal } from '../../util/portals'

import './SearchPanels.scss'

/**
 * Renders SearchPanels.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.panels - The current panels state.
 * @param {Object} props.portal - The current portal state.
 * @param {Function} props.onTogglePanels - Toggles the panels opened or closed.
 * @param {Function} props.onSetActivePanel - Switches the currently active panel.
 */
class SearchPanels extends PureComponent {
  constructor(props) {
    super(props)

    const {
      preferences
    } = props

    const {
      collectionListView,
      granuleListView
    } = preferences

    this.state = {
      collectionPanelView: this.defaultPanelStateFromProps(collectionListView),
      granulePanelView: this.defaultPanelStateFromProps(granuleListView)
    }

    this.onPanelClose = this.onPanelClose.bind(this)
    this.onChangePanel = this.onChangePanel.bind(this)
    this.onChangeCollectionsPanelView = this.onChangeCollectionsPanelView.bind(this)
    this.onChangeGranulePanelView = this.onChangeGranulePanelView.bind(this)
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

      const collectionPanelView = this.defaultPanelStateFromProps(collectionListView)
      const granulePanelView = this.defaultPanelStateFromProps(granuleListView)

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
    const { onSetActivePanel, onTogglePanels } = this.props
    onSetActivePanel(panelId)
    onTogglePanels(true)
  }

  onChangeCollectionsPanelView(view) {
    this.setState({
      collectionPanelView: view
    })
  }

  onChangeGranulePanelView(view) {
    this.setState({
      granulePanelView: view
    })
  }

  /**
   * Determine the value of the panel view state based on user preferences
   * @param {String} value The value stored in the preferences object
   */
  defaultPanelStateFromProps(value) {
    // If the preference isn't explicitly set to table
    if (value === 'table') {
      return value
    }

    // Default value
    return 'list'
  }

  updatePanelViewState(state) {
    this.setState({ ...state })
  }

  render() {
    const {
      collectionMetadata,
      collectionQuery,
      collectionsSearch,
      granuleMetadata,
      granuleQuery,
      granuleSearchResults,
      location,
      match,
      mapProjection,
      preferences,
      portal,
      onApplyGranuleFilters,
      onChangeQuery,
      onFocusedCollectionChange,
      onMetricsCollectionSortChange,
      onToggleAboutCwicModal
    } = this.props

    const {
      pageNum: granulesPageNum = 1,
      sortKey: activeGranulesSortKey = ''
    } = granuleQuery

    const {
      pageNum: collectionsPageNum = 1,
      sortKey: collectionsSortKey = ''
    } = collectionQuery

    const [activeCollectionsSortKey = ''] = collectionsSortKey

    const {
      allIds: collectionAllIds,
      hits: collectionHits = 0,
      isLoading: collectionSearchIsLoading,
      isLoaded: collectionSearchIsLoaded
    } = collectionsSearch

    const { panelState } = preferences

    const {
      hasAllMetadata: hasAllCollectionMetadata = false,
      title: collectionTitle = '',
      isCwic: collectionIsCwic
    } = collectionMetadata

    const { title: granuleTitle = '' } = granuleMetadata

    const handoffLinks = generateHandoffs(collectionMetadata, collectionQuery, mapProjection)

    const {
      allIds: allGranuleIds = [],
      hits: granuleHits = '0',
      isLoading: granulesIsLoading,
      isLoaded: granulesIsLoaded
    } = granuleSearchResults

    const {
      collectionPanelView,
      granulePanelView
    } = this.state

    const {
      portalId,
      org = portalId,
      title = portalId
    } = portal

    const granuleResultsHeaderMetaPrimaryText = `Showing ${commafy(allGranuleIds.length)} of ${commafy(
      granuleHits
    )} matching ${pluralize('granule', granuleHits)}`


    let collectionResultsHeaderMetaPrimaryText = ''
    let collectionResultsPrimaryHeading = ''

    collectionResultsPrimaryHeading = `${commafy(collectionHits)} Matching ${pluralize('Collection', collectionHits)}`
    collectionResultsHeaderMetaPrimaryText = `Showing ${commafy(collectionAllIds.length)} of ${commafy(
      collectionHits
    )} matching ${pluralize('collection', collectionHits)}`

    const initialGranulesLoading = (
      (granulesPageNum === 1 && granulesIsLoading)
      || (!granulesIsLoaded && !granulesIsLoading)
    )

    const granulesSortsArray = [
      {
        label: 'Start Date, Newest First',
        isActive: activeGranulesSortKey === '-start_date',
        onClick: () => onApplyGranuleFilters({ sortKey: '-start_date' })
      },
      {
        label: 'Start Date, Oldest First',
        isActive: activeGranulesSortKey === 'start_date',
        onClick: () => onApplyGranuleFilters({ sortKey: 'start_date' })
      },
      {
        label: 'End Date, Newest First',
        isActive: activeGranulesSortKey === '-end_date',
        onClick: () => onApplyGranuleFilters({ sortKey: '-end_date' })
      },
      {
        label: 'End Date, Oldest First',
        isActive: activeGranulesSortKey === 'end_date',
        onClick: () => onApplyGranuleFilters({ sortKey: 'end_date' })
      }
    ]

    const setGranulesActiveView = view => this.onChangeGranulePanelView(view)

    const granulesViewsArray = [
      {
        label: 'List',
        icon: 'list',
        isActive: granulePanelView === 'list',
        onClick: () => setGranulesActiveView('list')
      },
      {
        label: 'Table',
        icon: 'table',
        isActive: granulePanelView === 'table',
        onClick: () => setGranulesActiveView('table')
      }
    ]

    const setCollectionSort = (value) => {
      const sortKey = value === 'relevance' ? undefined : [value]

      onChangeQuery({
        collection: {
          sortKey
        }
      })
      onMetricsCollectionSortChange({ value })
    }

    const collectionsSortsArray = [
      {
        label: 'Relevance',
        isActive: activeCollectionsSortKey === '',
        onClick: () => setCollectionSort('relevance')
      },
      {
        label: 'Usage',
        isActive: activeCollectionsSortKey === '-usage_score',
        onClick: () => setCollectionSort('-usage_score')
      },
      {
        label: 'End Date',
        isActive: activeCollectionsSortKey === '-ongoing',
        onClick: () => setCollectionSort('-ongoing')
      }
    ]

    const initialCollectionsLoading = (
      (collectionsPageNum === 1 && collectionSearchIsLoading)
      || (!collectionSearchIsLoaded && !collectionSearchIsLoading)
    )

    const setCollectionsActiveView = view => this.onChangeCollectionsPanelView(view)

    const collectionsViewsArray = [
      {
        label: 'List',
        icon: 'list',
        isActive: collectionPanelView === 'list',
        onClick: () => setCollectionsActiveView('list')
      },
      {
        label: 'Table',
        icon: 'table',
        isActive: collectionPanelView === 'table',
        onClick: () => setCollectionsActiveView('table')
      }
    ]

    const buildCollectionResultsBodyFooter = () => {
      if (isDefaultPortal(portalId)) return null

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
        primaryHeading={collectionResultsPrimaryHeading}
        headerMetaPrimaryLoading={initialCollectionsLoading}
        headerMetaPrimaryText={collectionResultsHeaderMetaPrimaryText}
        headerLoading={initialCollectionsLoading}
        viewsArray={collectionsViewsArray}
        activeView={collectionPanelView}
        sortsArray={collectionsSortsArray}
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
        handoffLinks={handoffLinks}
        headerMessage={(
          <>
            {
              collectionIsCwic && (
                <Col className="search-panels__cwic-note">
                  {'This is '}
                  <span className="granule-results-header__cwic-emph">Int&apos;l / Interagency Data</span>
                  {' data. Searches will be performed by external services which may vary in performance and available features. '}
                  <Button
                    className="granule-results-header__link"
                    onClick={() => onToggleAboutCwicModal(true)}
                    variant="link"
                    bootstrapVariant="link"
                    icon="question-circle"
                    label="More details"
                  >
                    More Details
                  </Button>
                </Col>
              )
            }
          </>
        )}
        breadcrumbs={[
          {
            title: `Search Results (${commafy(collectionHits)} Collections)`,
            link: {
              pathname: '/search',
              search: location.search
            },
            onClick: () => onFocusedCollectionChange('')
          }
        ]}
        footer={(
          <GranuleResultsActionsContainer />
        )}
        primaryHeading={collectionTitle}
        headerLoading={!collectionSearchIsLoaded && hasAllCollectionMetadata === false}
        activeView={granulePanelView}
        activeSort={activeGranulesSortKey}
        sortsArray={!collectionIsCwic ? granulesSortsArray : []}
        viewsArray={granulesViewsArray}
        headerMetaPrimaryLoading={initialGranulesLoading}
        headerMetaPrimaryText={granuleResultsHeaderMetaPrimaryText}
        moreActionsDropdownItems={[
          {
            title: 'View Collection Details',
            icon: 'info-circle',
            link: {
              pathname: '/search/granules/collection-details',
              search: location.search
            }
          }
        ]}
        onPanelClose={this.onPanelClose}
      >
        <PanelItem scrollable={false}>
          <GranuleResultsBodyContainer panelView={granulePanelView} />
        </PanelItem>
      </PanelGroup>
    )

    panelSection.push(
      <PanelGroup
        key="collection-details-panel"
        primaryHeading={collectionTitle}
        headerLoading={initialCollectionsLoading}
        breadcrumbs={[
          {
            title: `Search Results (${commafy(collectionHits)} ${pluralize('Collection', collectionHits)})`,
            link: {
              pathname: '/search',
              search: location.search
            },
            onClick: () => onFocusedCollectionChange('')
          }
        ]}
        handoffLinks={handoffLinks}
        moreActionsDropdownItems={[
          {
            title: 'View Granules',
            icon: 'map',
            link: {
              pathname: '/search/granules',
              search: location.search
            }
          }
        ]}
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
        primaryHeading={granuleTitle}
        headerLoading={!granuleTitle}
        breadcrumbs={[
          {
            title: 'Search Results',
            link: {
              pathname: '/search',
              search: location.search
            },
            onClick: () => onFocusedCollectionChange('')
          },
          {
            title: collectionTitle,
            link: {
              pathname: '/search/granules',
              search: location.search
            },
            options: {
              shrink: true
            }
          }
        ]}
        moreActionsDropdownItems={[
          {
            title: 'View Granules',
            icon: 'map',
            link: {
              pathname: '/search/granules',
              search: location.search
            }
          },
          {
            title: 'View Collection Details',
            icon: 'info-circle',
            link: {
              pathname: '/search/granules/collection-details',
              search: location.search
            }
          }
        ]}
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
  collectionMetadata: PropTypes.shape({}).isRequired,
  collectionQuery: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  granuleMetadata: PropTypes.shape({}).isRequired,
  granuleSearchResults: PropTypes.shape({}).isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  mapProjection: PropTypes.string.isRequired,
  onApplyGranuleFilters: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  preferences: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired
}

export default SearchPanels
