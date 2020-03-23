import React from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import CollectionResultsItem from './CollectionResultsItem'

import './CollectionResultsList.scss'

export const CollectionResultsList = ({
  collections,
  portal,
  onAddProjectCollection,
  onRemoveCollectionFromProject,
  onViewCollectionGranules,
  onViewCollectionDetails,
  waypointEnter,
  scrollContainer,
  isLoading
}) => {
  const collectionResults = collections.map((collection, i) => {
    const key = `${collection.id}-list-view-${i}`
    return (
      <CollectionResultsItem
        key={key}
        collection={collection}
        onAddProjectCollection={onAddProjectCollection}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onViewCollectionGranules={onViewCollectionGranules}
        onViewCollectionDetails={onViewCollectionDetails}
        waypointEnter={waypointEnter}
        scrollContainer={scrollContainer}
      />
    )
  })

  const {
    portalId,
    org = portalId,
    title = portalId
  } = portal

  return (
    <ul className="collection-results-list" data-test-id="collection-results-list">
      {collectionResults}
      {isLoading && (
        <li className="collection-results-list__loading">
          Loading collections...
        </li>
      )}
      {
        portalId.length > 0 && (
          <p className="portal-escape">
            Looking for more collections?
            {' '}
            <a href="/" className="portal-escape-link">
              Leave
              {' '}
              {startCase(org)}
              &#39;s
              {' '}
              {startCase(title)}
              {' '}
              Portal
            </a>
          </p>
        )
      }
    </ul>
  )
}

CollectionResultsList.defaultProps = {
  scrollContainer: null
}

CollectionResultsList.propTypes = {
  collections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isLoading: PropTypes.bool.isRequired,
  portal: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  waypointEnter: PropTypes.func.isRequired,
  scrollContainer: PropTypes.instanceOf(Element)
}

export default CollectionResultsList
