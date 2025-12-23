import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'
import { Subscribe } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import {
  FaLock,
  FaMap,
  FaQuestionCircle
} from 'react-icons/fa'
import classNames from 'classnames'
import Helmet from 'react-helmet'

import { collectionSortKeys } from '../../constants/collectionSortKeys'
import { commafy } from '../../util/commafy'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { getHandoffLinks } from '../../util/handoffs/getHandoffLinks'
import { granuleSortKeys } from '../../constants/granuleSortKeys'
import { pluralize } from '../../util/pluralize'

import AuthRequiredContainer from '../../containers/AuthRequiredContainer/AuthRequiredContainer'
import CollectionDetailsBodyContainer from '../../containers/CollectionDetailsBodyContainer/CollectionDetailsBodyContainer'
import CollectionResultsBodyContainer
  from '../../containers/CollectionResultsBodyContainer/CollectionResultsBodyContainer'
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
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import GranuleDetailsBody from '../GranuleDetails/GranuleDetailsBody'
import Panels from '../Panels/Panels'
import PanelGroup from '../Panels/PanelGroup'
import PanelItem from '../Panels/PanelItem'
import PanelSection from '../Panels/PanelSection'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollections } from '../../zustand/selectors/collections'
import {
  getCollectionsQuery,
  getFocusedCollectionGranuleQuery
} from '../../zustand/selectors/query'
import { getCollectionId, getFocusedCollectionMetadata } from '../../zustand/selectors/collection'
import { getFocusedGranule, getGranuleId } from '../../zustand/selectors/granule'
import { getGranules } from '../../zustand/selectors/granules'
import { getEdlToken, getSitePreferences } from '../../zustand/selectors/user'

import { useExportCollections } from '../../hooks/useExportCollections'

import { routes } from '../../constants/routes'

import './SearchPanels.scss'
import { setOpenModalFunction } from '../../zustand/selectors/ui'
import { MODAL_NAMES } from '../../constants/modalNames'

const { edscHost } = getEnvironmentConfig()

/**
 * Determine the value of the panel view state based on user preferences
 * @param {String} value The value stored in the preferences object
 */
const defaultPanelStateFromProps = (value) => {
  // If the preference isn't explicitly set to table
  if (value === 'table') {
    return value
  }

  // Default value
  return 'list'
}

const SearchPanels = ({
  collectionSubscriptions,
  onMetricsCollectionSortChange
}) => {
  const setOpenModal = useEdscStore(setOpenModalFunction)
  const edlToken = useEdscStore(getEdlToken)
  const collectionMetadata = useEdscStore(getFocusedCollectionMetadata)
  const collectionQuery = useEdscStore(getCollectionsQuery)
  const collections = useEdscStore(getCollections)
  const collectionId = useEdscStore(getCollectionId)
  const focusedGranuleId = useEdscStore(getGranuleId)
  const granuleMetadata = useEdscStore(getFocusedGranule)
  const granuleQuery = useEdscStore(getFocusedCollectionGranuleQuery)
  const granules = useEdscStore(getGranules)
  const sitePreferences = useEdscStore(getSitePreferences)
  const {
    changeGranuleQuery,
    changeQuery,
    mapView,
    setCollectionId,
    startDrawing
  } = useEdscStore((state) => ({
    changeGranuleQuery: state.query.changeGranuleQuery,
    changeQuery: state.query.changeQuery,
    mapView: state.map.mapView,
    setCollectionId: state.collection.setCollectionId,
    startDrawing: state.home.startDrawing
  }))

  const location = useLocation()
  const params = useParams()

  const {
    exportCollections,
    exportFormat,
    exportLoading
  } = useExportCollections()

  const {
    collectionListView,
    granuleListView,
    panelState
  } = sitePreferences

  const [collectionPanelView, setCollectionPanelView] = useState(
    defaultPanelStateFromProps(collectionListView)
  )
  const [granulePanelView, setGranulePanelView] = useState(
    defaultPanelStateFromProps(granuleListView)
  )

  const loggedIn = !!edlToken

  const {
    pageNum: granulesPageNum = 1,
    sortKey: activeGranulesSortKey = ''
  } = granuleQuery

  const {
    pageNum: collectionsPageNum = 1,
    sortKey: activeCollectionsSortKey
  } = collectionQuery

  const {
    count: collectionHits = 0,
    isLoading: collectionSearchIsLoading,
    isLoaded: collectionSearchIsLoaded,
    items: collectionItems
  } = collections

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
    map: mapView
  })

  const {
    count: granuleHits = '0',
    isLoading: granulesIsLoading,
    isLoaded: granulesIsLoaded,
    items: granuleItems = []
  } = granules

  const granuleResultsHeaderMetaPrimaryText = `Showing ${commafy(granuleItems.length)} of ${commafy(
    granuleHits
  )} matching ${pluralize('granule', granuleHits)}`

  let collectionResultsHeaderMetaPrimaryText = ''
  let collectionResultsPrimaryHeading = ''

  collectionResultsPrimaryHeading = `${commafy(collectionHits)} Matching ${pluralize('Collection', collectionHits)}`
  collectionResultsHeaderMetaPrimaryText = `Showing ${commafy(collectionItems.length)} of ${commafy(
    collectionHits
  )} matching ${pluralize('collection', collectionHits)}`

  const initialGranulesLoading = (
    (granulesPageNum === 1 && granulesIsLoading)
    || (!granulesIsLoaded && !granulesIsLoading)
  )

  const granulesSortsArray = [
    {
      label: 'Start Date, Newest First',
      isActive: activeGranulesSortKey === granuleSortKeys.startDateDescending,
      onClick: () => changeGranuleQuery({
        collectionId,
        query: {
          sortKey: granuleSortKeys.startDateDescending
        }
      })
    },
    {
      label: 'Start Date, Oldest First',
      isActive: activeGranulesSortKey === granuleSortKeys.startDateAscending,
      onClick: () => changeGranuleQuery({
        collectionId,
        query: {
          sortKey: granuleSortKeys.startDateAscending
        }
      })
    },
    {
      label: 'End Date, Newest First',
      isActive: activeGranulesSortKey === granuleSortKeys.endDateDescending,
      onClick: () => changeGranuleQuery({
        collectionId,
        query: {
          sortKey: granuleSortKeys.endDateDescending
        }
      })
    },
    {
      label: 'End Date, Oldest First',
      isActive: activeGranulesSortKey === granuleSortKeys.endDateAscending,
      onClick: () => changeGranuleQuery({
        collectionId,
        query: {
          sortKey: granuleSortKeys.endDateAscending
        }
      })
    }
  ]

  const setGranulesActiveView = (view) => setGranulePanelView(view)

  const granulesViewsArray = [
    {
      label: 'List',
      isActive: granulePanelView === 'list',
      onClick: () => setGranulesActiveView('list')
    },
    {
      label: 'Table',
      isActive: granulePanelView === 'table',
      onClick: () => setGranulesActiveView('table')
    }
  ]

  const setCollectionSort = (value) => {
    changeQuery({
      collection: {
        sortKey: value
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
      label: 'Recent Version',
      isActive: activeCollectionsSortKey === collectionSortKeys.recentVersion,
      onClick: () => setCollectionSort(collectionSortKeys.recentVersion)
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

  const setCollectionsActiveView = (view) => setCollectionPanelView(view)

  const collectionsViewsArray = [
    {
      label: 'List',
      isActive: collectionPanelView === 'list',
      onClick: () => setCollectionsActiveView('list')
    },
    {
      label: 'Table',
      isActive: collectionPanelView === 'table',
      onClick: () => setCollectionsActiveView('table')
    }
  ]

  const exportsArray = [
    {
      title: 'Export CSV',
      label: 'CSV',
      onClick: () => exportCollections('csv'),
      inProgress: exportLoading && exportFormat === 'csv'
    },
    {
      title: 'Export JSON',
      label: 'JSON',
      onClick: () => exportCollections('json'),
      inProgress: exportLoading && exportFormat === 'json'
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

    return loggedIn && (
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
                  pathname: routes.COLLECTION_SUBSCRIPTIONS,
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

  if (loggedIn) {
    subscriptionsMoreActionsItem = [
      {
        title: 'Subscriptions',
        icon: Subscribe,
        link: {
          pathname: routes.GRANULE_SUBSCRIPTIONS,
          search: location.search
        }
      }
    ]
  }

  const panelSection = []

  // Collection Results Panel
  panelSection.push(
    <PanelGroup
      key="collection-results-panel"
      dataTestId="panel-group_collection-results"
      primaryHeading={collectionResultsPrimaryHeading}
      headerMetaPrimaryLoading={initialCollectionsLoading}
      headerMetaPrimaryText={collectionResultsHeaderMetaPrimaryText}
      headerLoading={initialCollectionsLoading}
      viewsArray={collectionsViewsArray}
      activeSort={activeCollectionsSortKey}
      activeView={collectionPanelView}
      sortsArray={collectionsSortsArray}
      footer={buildCollectionResultsBodyFooter()}
      moreActionsDropdownItems={exportsArray}
    >
      <PanelItem scrollable={false}>
        <CollectionResultsBodyContainer panelView={collectionPanelView} />
      </PanelItem>
    </PanelGroup>
  )

  let consortiumInfo = null

  if (isInternationalInteragency) {
    consortiumInfo = (
      <Col className="search-panels__note mx-3">
        {'This is '}
        <span className="search-panels__note-emph search-panels__note-emph--opensearch">Int&apos;l / Interagency Data</span>
        {' data. Searches will be performed by external services which may vary in performance and available features. '}
        {
          // TODO EDSC-4611 move this code
          collectionIsOpenSearch && (
            <Button
              className="search-panels__header-message-link"
              onClick={() => setOpenModal(MODAL_NAMES.ABOUT_CWIC)}
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

  // Granule Results Panel
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
              // TODO EDSC-4611 move this code
              collectionIsCSDA && (
                <Col className="search-panels__note mx-3">
                  {'This collection is made available through the '}
                  <span className="search-panels__note-emph search-panels__note-emph--csda">NASA Commercial Smallsat Data Acquisition (CSDA) Program</span>
                  {' for NASA funded researchers. Access to the data will require additional authentication. '}
                  <Button
                    className="search-panels__header-message-link"
                    dataTestId="search-panels__csda-modal-button"
                    onClick={() => setOpenModal(MODAL_NAMES.ABOUT_CSDA)}
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
              pathname: routes.SEARCH,
              search: location.search
            },
            onClick: () => setCollectionId(null)
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
              className="collection-results-item__badge-icon collection-results-item__badge-icon--csda d-inline-block me-1"
              icon={FaLock}
              size="8"
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
              pathname: routes.COLLECTION_DETAILS,
              search: location.search
            }
          },
          ...subscriptionsMoreActionsItem
        ]
      }
    >
      <PanelItem scrollable={false}>
        <GranuleResultsBodyContainer panelView={granulePanelView} />
      </PanelItem>
    </PanelGroup>
  )

  // Collection Details Panel
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
              pathname: routes.SEARCH,
              search: location.search
            },
            onClick: () => setCollectionId(null)
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
              pathname: routes.GRANULES,
              search: location.search
            }
          },
          ...subscriptionsMoreActionsItem
        ]
      }
    >
      <PanelItem scrollable={false}>
        <CollectionDetailsBodyContainer />
      </PanelItem>
    </PanelGroup>
  )

  // Granule Details Panel
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
              pathname: routes.SEARCH,
              search: location.search
            },
            onClick: () => setCollectionId(null)
          },
          {
            title: collectionTitle,
            link: {
              pathname: routes.GRANULES,
              search: location.search
            },
            options: {
              shrink: true
            },
            isLoading: !collectionTitle
          }
        ]
      }
      moreActionsDropdownItems={
        [
          {
            title: 'Granules',
            icon: FaMap,
            link: {
              pathname: routes.GRANULES,
              search: location.search
            }
          },
          {
            title: 'Collection Details',
            icon: AlertInformation,
            link: {
              pathname: routes.COLLECTION_DETAILS,
              search: location.search
            }
          }
        ]
      }
    >
      <PanelItem>
        <GranuleDetailsBody />
      </PanelItem>
    </PanelGroup>
  )

  // Granule Subscriptions Panel
  panelSection.push(
    <PanelGroup
      key="granule-subscriptions-panel"
      dataTestId="panel-group_granule-subscriptions"
      primaryHeading="Granule Subscriptions"
      breadcrumbs={
        [
          {
            title: 'Search Results',
            link: {
              pathname: routes.SEARCH,
              search: location.search
            },
            onClick: () => setCollectionId(null)
          },
          {
            title: collectionTitle,
            link: {
              pathname: routes.GRANULES,
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
              pathname: routes.GRANULES,
              search: location.search
            }
          },
          {
            title: 'Collection Details',
            icon: AlertInformation,
            link: {
              pathname: routes.COLLECTION_DETAILS,
              search: location.search
            }
          }
        ]
      }
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

  // Collection Subscriptions Panel
  panelSection.push(
    <PanelGroup
      key="collection-subscriptions-panel"
      dataTestId="panel-group_collection-subscriptions"
      primaryHeading="Dataset Search Subscriptions"
      breadcrumbs={
        [
          {
            title: 'Search Results',
            link: {
              pathname: routes.SEARCH,
              search: location.search
            },
            onClick: () => setCollectionId(null)
          }
        ]
      }
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

  // If start drawing is set, we want to hide the panel so the user has more space to use the map
  const showPanel = !startDrawing

  // React Router does not play nicely with our panel component due to the
  // way the nested panels are implemented. Here we take the route information
  // provided by React Router, and use that to determine which panel should
  // be active at any given time. activePanel will be equal to whichever path
  // is set after "/search"

  const {
    activePanel1: activePanelFromProps1 = '',
    activePanel2: activePanelFromProps2 = ''
  } = params
  const activePanelFromProps = [activePanelFromProps1, activePanelFromProps2].filter(Boolean).join('/')

  let activePanel = '0.0.0'
  let appTitle = ''
  let appDescription = ''
  let appUrl = `${edscHost}/search`

  switch (activePanelFromProps) {
    case 'subscriptions':
      activePanel = '0.5.0'
      appTitle = 'Dataset Search Subscriptions'
      appDescription = 'Subscribe to be notifed when new datasets become available'
      appUrl = `${edscHost}${routes.COLLECTION_SUBSCRIPTIONS}`
      break
    case 'granules/subscriptions':
      activePanel = '0.4.0'
      if (collectionTitle) appTitle = `${collectionTitle} Subscriptions`
      if (collectionTitle) appDescription = `Subscribe to be notifed when new ${collectionTitle} data is available`
      if (conceptId) appUrl = `${edscHost}${routes.GRANULE_SUBSCRIPTIONS}?p=${conceptId}`
      break
    case 'granules/granule-details':
      activePanel = '0.3.0'
      if (granuleTitle) appTitle = `${granuleTitle} Details`
      if (granuleTitle) appDescription = `View ${granuleTitle} on Earthdata Search`
      if (conceptId && granuleConceptId) appUrl = `${edscHost}${routes.GRANULE_DETAILS}?p=${conceptId}&g=${granuleConceptId}`
      break
    case 'granules/collection-details':
      activePanel = '0.2.0'
      if (collectionTitle) appTitle = `${collectionTitle} Details`
      if (collectionTitle) appDescription = `View ${collectionTitle} on Earthdata Search`
      if (conceptId) appUrl = `${edscHost}${routes.COLLECTION_DETAILS}?p=${conceptId}`
      break
    case 'granules':
      activePanel = '0.1.0'
      if (collectionTitle) appTitle = `${collectionTitle}`
      if (collectionTitle) appDescription = `Explore and access ${collectionTitle} data on Earthdata Search`
      if (conceptId) appUrl = `${edscHost}${routes.GRANULES}?p=${conceptId}`
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
        show={showPanel}
        activePanel={activePanel}
        draggable
        panelState={panelState}
        focusedMeta={
          focusedGranuleId && (
            <div className="search-panels__focused-meta">
              <GranuleResultsFocusedMetaContainer />
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

SearchPanels.propTypes = {
  collectionSubscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired
}

export default SearchPanels
