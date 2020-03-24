import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import CollectionResultsList from './CollectionResultsList'
import CollectionResultsTable from '../CollectionResultsTable/CollectionResultsTable'


import './CollectionResultsBody.scss'

/**
 * Renders CollectionResultsBody.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collections - Collections passed from redux store.
 * @param {object} props.location - Locations passed from react router.
 * @param {function} props.onFocusedCollectionChange - Fired when a new collection is focused.
 */
const CollectionResultsBody = ({
  browser,
  collections,
  portal,
  projectIds,
  waypointEnter,
  onAddProjectCollection,
  onRemoveCollectionFromProject,
  onViewCollectionGranules,
  onViewCollectionDetails,
  scrollContainer,
  panelView
}) => {
  const { allIds: collectionIds, hits: collectionHits, isLoading } = collections

  const collectionList = useMemo(() => collectionIds.map((collectionId, index) => {
    const collection = collections.byId[collectionId]

    const {
      dataset_id: datasetId = null,
      granule_count: granuleCount = 0,
      has_formats: hasFormats = false,
      has_spatial_subsetting: hasSpatialSubsetting = false,
      has_temporal_subsetting: hasTemporalSubsetting = false,
      has_transforms: hasTransforms = false,
      has_variables: hasVariables = false,
      has_map_imagery: hasMapImagery = false,
      is_cwic: isCwic = false,
      is_nrt: isNrt = false,
      organizations = [],
      short_name: shortName,
      summary = '',
      thumbnail = null,
      time_end: timeEnd = null,
      time_start: timeStart = null,
      version_id: versionId
    } = collection

    const {
      name: browserName
    } = browser

    let displayOrganization = ''

    if (organizations && organizations.length) {
      [displayOrganization] = organizations
    }

    let temporalRange = ''
    let temporalStart = ''
    let temporalEnd = ''

    if (timeStart || timeEnd) {
      if (timeStart) {
        const dateStart = new Date(timeStart).toISOString().split('T')[0]

        temporalRange = `${dateStart} ongoing`
        temporalStart = dateStart
        temporalEnd = 'ongoing'
      }

      if (timeEnd) {
        const dateEnd = new Date(timeEnd).toISOString().split('T')[0]

        temporalRange = `Up to ${dateEnd}`
        temporalEnd = dateEnd
      }

      if (timeStart && timeEnd) {
        const dateStart = new Date(timeStart).toISOString().split('T')[0]
        const dateEnd = new Date(timeEnd).toISOString().split('T')[0]

        temporalRange = `${dateStart} to ${dateEnd}`
      }
    }

    let description = summary
    if (browserName === 'ie') description = `${description.substring(0, 280)}...`

    const isCollectionInProject = projectIds.indexOf(collectionId) !== -1

    const isLast = index === collectionIds.length - 1

    return {
      collectionId,
      datasetId,
      description,
      displayOrganization,
      granuleCount,
      hasFormats,
      hasSpatialSubsetting,
      hasTemporalSubsetting,
      hasTransforms,
      hasVariables,
      hasMapImagery,
      isCwic,
      isNrt,
      shortName,
      temporalEnd,
      temporalRange,
      temporalStart,
      thumbnail,
      versionId,
      isCollectionInProject,
      isLast
    }
  }), [collectionIds, projectIds])

  return (
    <div className="collection-results-body">
      {
        panelView === 'list' && (
          <CollectionResultsList
            browser={browser}
            collections={collectionList}
            isLoading={isLoading}
            portal={portal}
            projectIds={projectIds}
            onAddProjectCollection={onAddProjectCollection}
            onRemoveCollectionFromProject={onRemoveCollectionFromProject}
            onViewCollectionGranules={onViewCollectionGranules}
            onViewCollectionDetails={onViewCollectionDetails}
            scrollContainer={scrollContainer}
            waypointEnter={waypointEnter}
          />
        )
      }
      {
        panelView === 'table' && (
          <CollectionResultsTable
            collections={collectionList}
            collectionHits={parseInt(collectionHits, 10)}
            onViewCollectionGranules={onViewCollectionGranules}
            onAddProjectCollection={onAddProjectCollection}
            onRemoveCollectionFromProject={onRemoveCollectionFromProject}
            onViewCollectionDetails={onViewCollectionDetails}
            waypointEnter={waypointEnter}
          />
        )
      }
    </div>
  )
}

CollectionResultsBody.defaultProps = {
  scrollContainer: null
}

CollectionResultsBody.propTypes = {
  browser: PropTypes.shape({}).isRequired,
  collections: PropTypes.shape({}).isRequired,
  panelView: PropTypes.string.isRequired,
  portal: PropTypes.shape({}).isRequired,
  projectIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  scrollContainer: PropTypes.instanceOf(Element),
  waypointEnter: PropTypes.func.isRequired
}

export default CollectionResultsBody
