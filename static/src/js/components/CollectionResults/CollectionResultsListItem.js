import React, {
  memo,
  useRef,
  useEffect
} from 'react'
import PropTypes from 'prop-types'

import CollectionResultsItem from './CollectionResultsItem'

import './CollectionResultsListItem.scss'

/**
 * Renders CollectionResultsListItem. This should be rendered as a react-window item.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.data - The data provided from react-window.
 * @param {Number} props.index - The index of the item.
 * @param {Object} props.style - The style settings for the item from react-window.
 */
export const CollectionResultsListItem = memo(({
  data,
  index,
  style
}) => {
  const element = useRef()
  const {
    collections,
    isItemLoaded,
    loadMoreItems,
    onAddProjectCollection,
    onRemoveCollectionFromProject,
    onViewCollectionDetails,
    onViewCollectionGranules,
    portal,
    setSize,
    windowWidth
  } = data

  useEffect(() => {
    setSize(index, element.current.getBoundingClientRect().height)
  }, [windowWidth])

  if (!isItemLoaded(index)) {
    return (
      <li
        ref={element}
        className="collection-results-list-item collection-results-list-item--loading"
        style={style}
      >
        Loading collections...
      </li>
    )
  }

  return (
    <li className="collection-results-list-item" style={style}>
      <CollectionResultsItem
        ref={element}
        collection={collections[index]}
        onAddProjectCollection={onAddProjectCollection}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onViewCollectionGranules={onViewCollectionGranules}
        onViewCollectionDetails={onViewCollectionDetails}
        loadMoreItems={loadMoreItems}
        portal={portal}
      />
    </li>
  )
})

CollectionResultsListItem.displayName = 'CollectionResultsListItem'

CollectionResultsListItem.propTypes = {
  data: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.shape({}).isRequired
}

export default CollectionResultsListItem
