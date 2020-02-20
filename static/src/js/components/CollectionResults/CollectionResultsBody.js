import React from 'react'
import PropTypes from 'prop-types'

import CollectionResultsList from './CollectionResultsList'

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
  scrollContainer
}) => (
  <div className="collection-results-body">
    <CollectionResultsList
      browser={browser}
      collections={collections}
      portal={portal}
      projectIds={projectIds}
      onAddProjectCollection={onAddProjectCollection}
      onRemoveCollectionFromProject={onRemoveCollectionFromProject}
      onViewCollectionGranules={onViewCollectionGranules}
      onViewCollectionDetails={onViewCollectionDetails}
      waypointEnter={waypointEnter}
      scrollContainer={scrollContainer}
    />
  </div>
)

CollectionResultsBody.defaultProps = {
  scrollContainer: null
}

CollectionResultsBody.propTypes = {
  browser: PropTypes.shape({}).isRequired,
  collections: PropTypes.shape({}).isRequired,
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
