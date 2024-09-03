import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import { isEqual } from 'lodash-es'
import { Badge, Col } from 'react-bootstrap'

import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'
import { List, Subscribe } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import {
  FaMap,
  FaQuestionCircle,
  FaTable,
  FaLock
} from 'react-icons/fa'

import classNames from 'classnames'
import Helmet from 'react-helmet'

import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'
import { getHandoffLinks } from '../../util/handoffs/getHandoffLinks'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { collectionSortKeys } from '../../constants/collectionSortKeys'

import AuthRequiredContainer from '../../containers/AuthRequiredContainer/AuthRequiredContainer'
import CollectionResultsBodyContainer
  from '../../containers/CollectionResultsBodyContainer/CollectionResultsBodyContainer'
import CollectionDetailsBodyContainer
  from '../../containers/CollectionDetailsBodyContainer/CollectionDetailsBodyContainer'
import GranuleDetailsBodyContainer
  from '../../containers/GranuleDetailsBodyContainer/GranuleDetailsBodyContainer'
import GranuleResultsBodyContainer
  from '../../containers/GranuleResultsBodyContainer/GranuleResultsBodyContainer'
import GranuleResultsFocusedMetaContainer
  from '../../containers/GranuleResultsFocusedMetaContainer/GranuleResultsFocusedMetaContainer'
import GranuleResultsActionsContainer
  from '../../containers/GranuleResultsActionsContainer/GranuleResultsActionsContainer'
import SubscriptionsBodyContainer
  from '../../containers/SubscriptionsBodyContainer/SubscriptionsBodyContainer'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import Button from '../Button/Button'
import Panels from '../Panels/Panels'
import PanelGroup from '../Panels/PanelGroup'
import PanelItem from '../Panels/PanelItem'
import PanelSection from '../Panels/PanelSection'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

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

    const { edscHost } = getEnvironmentConfig()
    this.edscHost = edscHost
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
      authToken,
      collectionMetadata,
      collectionQuery,
      collectionsSearch,
      collectionSubscriptions,
      granuleMetadata,
      granuleQuery,
      granuleSearchResults,
      isExportRunning,
      location,
      map,
      match,
      onApplyGranuleFilters,
      onChangeQuery,
      onExport,
      onFocusedCollectionChange,
      onMetricsCollectionSortChange,
      onToggleAboutCSDAModal,
      onToggleAboutCwicModal,
      preferences
    } = this.props

    const isLoggedIn = !(authToken === null || authToken === '')

    const {
      pageNum: granulesPageNum = 1,
      sortKey: activeGranulesSortKey = ''
    } = granuleQuery

    const {
      pageNum: collectionsPageNum = 1,
      sortKey: collectionsSortKey = collectionSortKeys.scoreDescending
    } = collectionQuery

    const [activeCollectionsSortKey = collectionSortKeys.scoreDescending] = collectionsSortKey

    const {
      allIds: collectionAllIds,
      hits: collectionHits = 0,
      isLoading: collectionSearchIsLoading,
      isLoaded: collectionSearchIsLoaded
    } = collectionsSearch

    const { panelState } = preferences

    const {
      conceptId,
      consortiums = [],
      hasAllMetadata: hasAllCollectionMetadata = false,
      title: collectionTitle = '',
      isCSDA: collectionIsCSDA,
      isOpenSearch: collectionIsOpenSearch
    } = collectionMetadata

    // Do not display the international/interagency data message for EOSDIS or CWIC collections
    const isInternationalInteragency = consortiums.filter((consortium) => consortium !== 'EOSDIS' && consortium !== 'GEOSS').length > 0

    const { title: granuleTitle = '', conceptId: granuleConceptId = '' } = granuleMetadata

    const handoffLinks = getHandoffLinks({
      collectionMetadata,
      collectionQuery,
      map
    })
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
        isActive: activeGranulesSortKey === collectionSortKeys.startDateAscending,
        onClick: () => onApplyGranuleFilters({ sortKey: collectionSortKeys.startDateAscending })
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

    const setGranulesActiveView = (view) => this.onChangeGranulePanelView(view)

    const granulesViewsArray = [
      {
        label: 'List',
        icon: List,
        isActive: granulePanelView === 'list',
        onClick: () => setGranulesActiveView('list')
      },
      {
        label: 'Table',
        icon: FaTable,
        isActive: granulePanelView === 'table',
        onClick: () => setGranulesActiveView('table')
      }
    ]

    const setCollectionSort = (value) => {
      const sortKey = [value]
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
        isActive: activeCollectionsSortKey === collectionSortKeys.scoreDescending,
        onClick: () => setCollectionSort(collectionSortKeys.scoreDescending)
      },
      {
        label: 'Usage',
        isActive: activeCollectionsSortKey === collectionSortKeys.usageDescending,
        onClick: () => setCollectionSort(collectionSortKeys.usageDescending)
      },
      {
        label: 'Start Date',
        isActive: activeCollectionsSortKey === collectionSortKeys.startDateAscending,
        onClick: () => setCollectionSort(collectionSortKeys.startDateAscending)
      },
      {
        label: 'End Date',
        isActive: activeCollectionsSortKey === collectionSortKeys.endDateDescending,
        onClick: () => setCollectionSort(collectionSortKeys.endDateDescending)
      }
    ]

    const initialCollectionsLoading = (
      (collectionsPageNum === 1 && collectionSearchIsLoading)
      || (!collectionSearchIsLoaded && !collectionSearchIsLoading)
    )

    const setCollectionsActiveView = (view) => this.onChangeCollectionsPanelView(view)

    const collectionsViewsArray = [
      {
        label: 'List',
        icon: List,
        isActive: collectionPanelView === 'list',
        onClick: () => setCollectionsActiveView('list')
      },
      {
        label: 'Table',
        icon: FaTable,
        isActive: collectionPanelView === 'table',
        onClick: () => setCollectionsActiveView('table')
      }
    ]

    const {
      csv: csvExportRunning,
      json: jsonExportRunning
    } = isExportRunning
    const exportsArray = [
      {
        label: 'CSV',
        onClick: () => onExport('csv'),
        inProgress: csvExportRunning
      },
      {
        label: 'JSON',
        onClick: () => onExport('json'),
        inProgress: jsonExportRunning
      }
    ]

    const buildCollectionResultsBodyFooter = () => {
      const subscriptionButtonClassnames = classNames([
        'search-panels__action',
        'search-panels__action--subscriptions',
        {
          'search-panels__action--is-active': collectionSubscriptions.length > 0
        }
      ])

      return isLoggedIn && (
        <div className="search-panels__actions">
          <PortalFeatureContainer authentication>
            <AuthRequiredContainer noRedirect>
              <PortalLinkContainer
                type="button"
                icon={Subscribe}
                className={subscriptionButtonClassnames}
                dataTestId="search-panels-actions__subscriptions-button"
                label={collectionSubscriptions.length ? 'View or edit subscriptions' : 'Create subscription'}
                title={collectionSubscriptions.length ? 'View or edit subscriptions' : 'Create subscription'}
                badge={collectionSubscriptions.length ? `${collectionSubscriptions.length}` : false}
                naked
                to={
                  {
                    pathname: '/search/subscriptions',
                    search: location.search
                  }
                }
              >
                Subscriptions
              </PortalLinkContainer>
            </AuthRequiredContainer>
          </PortalFeatureContainer>
        </div>
      )
    }

    let subscriptionsMoreActionsItem = []

    if (isLoggedIn) {
      subscriptionsMoreActionsItem = [
        {
          title: 'Subscriptions',
          icon: Subscribe,
          link: {
            pathname: '/search/granules/subscriptions',
            search: location.search
          }
        }
      ]
    }

    const panelSection = []

    panelSection.push(
      <PanelGroup
        key="collection-results-panel"
        dataTestId="panel-group_collection-results"
        primaryHeading={collectionResultsPrimaryHeading}
        headerMetaPrimaryLoading={initialCollectionsLoading}
        headerMetaPrimaryText={collectionResultsHeaderMetaPrimaryText}
        headerLoading={initialCollectionsLoading}
        exportsArray={exportsArray}
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

    let consortiumInfo = null

    if (isInternationalInteragency) {
      consortiumInfo = (
        <Col className="search-panels__note">
          {'This is '}
          <span className="search-panels__note-emph search-panels__note-emph--opensearch">Int&apos;l / Interagency Data</span>
          {' data. Searches will be performed by external services which may vary in performance and available features. '}
          {
            collectionIsOpenSearch && (
              <Button
                className="search-panels__header-message-link"
                onClick={() => onToggleAboutCwicModal(true)}
                variant="link"
                bootstrapVariant="link"
                icon={FaQuestionCircle}
                label="More details"
              >
                More Details
              </Button>
            )
          }
        </Col>
      )
    }

    panelSection.push(
      <PanelGroup
        key="granule-results-panel"
        dataTestId="panel-group_granule-results"
        handoffLinks={handoffLinks}
        headerMessage={
          (
            <>
              {consortiumInfo}
              {
                collectionIsCSDA && (
                  <Col className="search-panels__note">
                    {'This collection is made available through the '}
                    <span className="search-panels__note-emph search-panels__note-emph--csda">NASA Commercial Smallsat Data Acquisition (CSDA) Program</span>
                    {' for NASA funded researchers. Access to the data will require additional authentication. '}
                    <Button
                      className="search-panels__header-message-link"
                      dataTestId="search-panels__csda-modal-button"
                      onClick={() => onToggleAboutCSDAModal(true)}
                      variant="link"
                      bootstrapVariant="link"
                      icon={FaQuestionCircle}
                      label="More details"
                    >
                      More Details
                    </Button>
                  </Col>
                )
              }
            </>
          )
        }
        breadcrumbs={
          [
            {
              title: `Search Results (${commafy(collectionHits)} Collections)`,
              link: {
                pathname: '/search',
                search: location.search
              },
              onClick: () => onFocusedCollectionChange('')
            }
          ]
        }
        footer={(
          <GranuleResultsActionsContainer />
        )}
        primaryHeading={collectionTitle}
        secondaryHeading={
          collectionIsCSDA && (
            <Badge className="panel-group-header__heading-badge badge--purple">
              <EDSCIcon
                className="collection-results-item__badge-icon collection-results-item__badge-icon--csda d-inline-block mr-1"
                icon={FaLock}
                size="0.55rem"
              />
              CSDA
            </Badge>
          )
        }
        headerLoading={!collectionSearchIsLoaded && hasAllCollectionMetadata === false}
        activeView={granulePanelView}
        activeSort={activeGranulesSortKey}
        sortsArray={!collectionIsOpenSearch ? granulesSortsArray : []}
        viewsArray={granulesViewsArray}
        headerMetaPrimaryLoading={initialGranulesLoading}
        headerMetaPrimaryText={granuleResultsHeaderMetaPrimaryText}
        moreActionsDropdownItems={
          [
            {
              title: 'Collection Details',
              icon: AlertInformation,
              link: {
                pathname: '/search/granules/collection-details',
                search: location.search
              }
            },
            ...subscriptionsMoreActionsItem
          ]
        }
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
        dataTestId="panel-group_granules-collections-results"
        primaryHeading={collectionTitle}
        headerLoading={initialCollectionsLoading}
        breadcrumbs={
          [
            {
              title: `Search Results (${commafy(collectionHits)} ${pluralize('Collection', collectionHits)})`,
              link: {
                pathname: '/search',
                search: location.search
              },
              onClick: () => onFocusedCollectionChange('')
            }
          ]
        }
        handoffLinks={handoffLinks}
        moreActionsDropdownItems={
          [
            {
              title: 'Granules',
              icon: FaMap,
              link: {
                pathname: '/search/granules',
                search: location.search
              }
            },
            ...subscriptionsMoreActionsItem
          ]
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
        dataTestId="panel-group_granule-details"
        primaryHeading={granuleTitle}
        headerLoading={!granuleTitle}
        breadcrumbs={
          [
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
          ]
        }
        moreActionsDropdownItems={
          [
            {
              title: 'Granules',
              icon: FaMap,
              link: {
                pathname: '/search/granules',
                search: location.search
              }
            },
            {
              title: 'Collection Details',
              icon: AlertInformation,
              link: {
                pathname: '/search/granules/collection-details',
                search: location.search
              }
            }
          ]
        }
        onPanelClose={this.onPanelClose}
      >
        <PanelItem>
          <GranuleDetailsBodyContainer />
        </PanelItem>
      </PanelGroup>
    )

    panelSection.push(
      <PanelGroup
        key="granule-subscriptions-panel"
        primaryHeading="Granule Subscriptions"
        breadcrumbs={
          [
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
          ]
        }
        moreActionsDropdownItems={
          [
            {
              title: 'Granules',
              icon: FaMap,
              link: {
                pathname: '/search/granules',
                search: location.search
              }
            },
            {
              title: 'Collection Details',
              icon: AlertInformation,
              link: {
                pathname: '/search/granules/collection-details',
                search: location.search
              }
            }
          ]
        }
        onPanelClose={this.onPanelClose}
      >
        <PanelItem>
          <PortalFeatureContainer authentication>
            <AuthRequiredContainer noRedirect>
              <SubscriptionsBodyContainer subscriptionType="granule" />
            </AuthRequiredContainer>
          </PortalFeatureContainer>
        </PanelItem>
      </PanelGroup>
    )

    panelSection.push(
      <PanelGroup
        key="collection-subscriptions-panel"
        primaryHeading="Dataset Search Subscriptions"
        breadcrumbs={
          [
            {
              title: 'Search Results',
              link: {
                pathname: '/search',
                search: location.search
              },
              onClick: () => onFocusedCollectionChange('')
            }
          ]
        }
        onPanelClose={this.onPanelClose}
      >
        <PanelItem>
          <PortalFeatureContainer authentication>
            <AuthRequiredContainer noRedirect>
              <SubscriptionsBodyContainer subscriptionType="collection" />
            </AuthRequiredContainer>
          </PortalFeatureContainer>
        </PanelItem>
      </PanelGroup>
    )

    const { edscHost } = this

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

              const {
                match: propsMatch = {}
              } = props
              const { params = {} } = propsMatch
              const { activePanel: activePanelFromProps = '' } = params
              let activePanel = '0.0.0'
              let appTitle = ''
              let appDescription = ''
              let appUrl = ''

              switch (activePanelFromProps) {
                case 'subscriptions':
                  activePanel = '0.5.0'
                  appTitle = 'Dataset Search Subscriptions'
                  appDescription = 'Subscribe to be notifed when new datasets become available'
                  appUrl = `${edscHost}/search/subscriptions`
                  break
                case 'granules/subscriptions':
                  activePanel = '0.4.0'
                  if (collectionTitle) appTitle = `${collectionTitle} Subscriptions`
                  if (collectionTitle) appDescription = `Subscribe to be notifed when new ${collectionTitle} data is available`
                  if (conceptId) appUrl = `${edscHost}/search/granules/subscriptions?p=${conceptId}`
                  break
                case 'granules/granule-details':
                  activePanel = '0.3.0'
                  if (granuleTitle) appTitle = `${granuleTitle} Details`
                  if (granuleTitle) appDescription = `View ${granuleTitle} on Earthdata Search`
                  if (conceptId && granuleConceptId) appUrl = `${edscHost}/search/granules/granule-details?p=${conceptId}&g=${granuleConceptId}`
                  break
                case 'granules/collection-details':
                  activePanel = '0.2.0'
                  if (collectionTitle) appTitle = `${collectionTitle} Details`
                  if (collectionTitle) appDescription = `View ${collectionTitle} on Earthdata Search`
                  if (conceptId) appUrl = `${edscHost}/search/collection-details?p=${conceptId}`
                  break
                case 'granules':
                  activePanel = '0.1.0'
                  if (collectionTitle) appTitle = `${collectionTitle}`
                  if (collectionTitle) appDescription = `Explore and access ${collectionTitle} data on Earthdata Search`
                  if (conceptId) appUrl = `${edscHost}/search/granules?p=${conceptId}`
                  break
                default:
                  activePanel = '0.0.0'
              }

              return (
                <>
                  {
                    appTitle && (
                      <Helmet>
                        <title>{appTitle}</title>
                        <meta name="title" content={appTitle} />
                        <meta property="og:title" content={appTitle} />
                      </Helmet>
                    )
                  }
                  {
                    appDescription && (
                      <Helmet>
                        <meta name="description" content={appDescription} />
                        <meta property="og:description" content={appDescription} />
                      </Helmet>
                    )
                  }
                  {
                    appUrl && (
                      <Helmet>
                        <link rel="canonical" href={appUrl} />
                        <meta property="og:url" content={appUrl} />
                      </Helmet>
                    )
                  }
                  <Panels
                    className="search-panels"
                    show
                    activePanel={activePanel}
                    draggable
                    panelState={panelState}
                    focusedMeta={
                      (
                        <div className="search-panels__focused-meta">
                          <Switch>
                            <Route
                              path="/search/granules"
                              render={
                                () => (
                                  <GranuleResultsFocusedMetaContainer />
                                )
                              }
                            />
                          </Switch>
                        </div>
                      )
                    }
                  >
                    <PanelSection>
                      {panelSection}
                    </PanelSection>
                  </Panels>
                </>
              )
            }
          }
        />
      </Switch>
    )
  }
}

SearchPanels.propTypes = {
  authToken: PropTypes.string.isRequired,
  collectionMetadata: PropTypes.shape({
    conceptId: PropTypes.string,
    consortiums: PropTypes.arrayOf(PropTypes.string),
    hasAllMetadata: PropTypes.bool,
    isCSDA: PropTypes.bool,
    isOpenSearch: PropTypes.bool,
    title: PropTypes.string
  }).isRequired,
  collectionQuery: PropTypes.shape({
    pageNum: PropTypes.number,
    sortKey: PropTypes.arrayOf(
      PropTypes.string
    )
  }).isRequired,
  collectionsSearch: PropTypes.shape({
    allIds: PropTypes.arrayOf(PropTypes.string),
    hits: PropTypes.number,
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool
  }).isRequired,
  collectionSubscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  granuleMetadata: PropTypes.shape({
    conceptId: PropTypes.string,
    title: PropTypes.string
  }).isRequired,
  granuleQuery: PropTypes.shape({
    pageNum: PropTypes.number,
    sortKey: PropTypes.string
  }).isRequired,
  granuleSearchResults: PropTypes.shape({
    allIds: PropTypes.arrayOf(PropTypes.string),
    hits: PropTypes.number,
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool
  }).isRequired,
  isExportRunning: PropTypes.shape({
    csv: PropTypes.bool,
    json: PropTypes.bool
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired,
  map: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    url: PropTypes.string,
    params: PropTypes.shape({})
  }).isRequired,
  onApplyGranuleFilters: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  panels: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({
    portalId: PropTypes.string,
    title: PropTypes.shape({
      primary: PropTypes.string
    }),
    pageTitle: PropTypes.string
  }).isRequired,
  preferences: PropTypes.shape({
    collectionListView: PropTypes.node,
    granuleListView: PropTypes.node,
    panelState: PropTypes.string
  }).isRequired
}

export default SearchPanels
