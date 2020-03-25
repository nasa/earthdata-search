import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import CollectionResultsList from './CollectionResultsList'
import CollectionResultsTable from '../CollectionResultsTable/CollectionResultsTable'
import { formatCollectionList } from '../../util/formatCollectionList'


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

  const collectionList = useMemo(() => formatCollectionList(collections, projectIds, browser),
    [collectionIds, projectIds])

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
            portal={portal}
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
