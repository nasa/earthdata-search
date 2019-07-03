import React from 'react'
import PropTypes from 'prop-types'

import CollectionResultsItem from './CollectionResultsItem'

import './CollectionResultsList.scss'

export const CollectionResultsList = ({
  collections,
  onViewCollectionGranules,
  onViewCollectionDetails,
  waypointEnter
}) => {
  const collectionIds = collections.allIds

  const collectionResults = collectionIds.map((id, index) => {
    const collection = collections.byId[id]
    const isLast = collectionIds.length > 0 && index === collectionIds.length - 1

    return (
      <CollectionResultsItem
        key={collection.id}
        collection={collection}
        onViewCollectionGranules={onViewCollectionGranules}
        onViewCollectionDetails={onViewCollectionDetails}
        isLast={isLast}
        waypointEnter={waypointEnter}
      />
    )
  })

  return (
    <ul className="collection-results-list">
      {collectionResults}
      {collections.isLoading && (
        <li className="collection-results-list__loading">
          Loading collections...
        </li>
      )}
    </ul>
  )
}

CollectionResultsList.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  waypointEnter: PropTypes.func.isRequired
}

export default CollectionResultsList
