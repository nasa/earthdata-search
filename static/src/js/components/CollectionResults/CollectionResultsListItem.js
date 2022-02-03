import React, {
  memo,
  useRef,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import Skeleton from '../Skeleton/Skeleton'

import { collectionResultsItemSkeleton } from './skeleton'
import { collectionMetadataPropType } from '../../util/propTypes/collectionMetadata'

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
    collectionsMetadata,
    isItemLoaded,
    onAddProjectCollection,
    onRemoveCollectionFromProject,
    onViewCollectionDetails,
    onViewCollectionGranules,
    setSize,
    windowWidth
  } = data

  useEffect(() => {
    // Set the height of the item on load
    setSize(index, element.current.getBoundingClientRect().height)
  }, [])

  useEffect(() => {
    // Calculate the height when the container width or element ref is changed
    setSize(index, element.current.getBoundingClientRect().height)
  }, [windowWidth, element.current])

  if (!isItemLoaded(index)) {
    return (
      <li
        ref={element}
        className="collection-results-list-item collection-results-list-item--loading"
        style={style}
      >
        <Skeleton
          containerStyle={{
            height: '140px',
            width: '100%',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: '#dcdee0'
          }}
          shapes={collectionResultsItemSkeleton}
        />
      </li>
    )
  }

  return (
    <li className="collection-results-list-item" style={style}>
      <CollectionResultsItem
        collectionMetadata={collectionsMetadata[index]}
        onAddProjectCollection={onAddProjectCollection}
        onRemoveCollectionFromProject={onRemoveCollectionFromProject}
        onViewCollectionDetails={onViewCollectionDetails}
        onViewCollectionGranules={onViewCollectionGranules}
        ref={element}
      />
    </li>
  )
})

CollectionResultsListItem.displayName = 'CollectionResultsListItem'

CollectionResultsListItem.propTypes = {
  data: PropTypes.shape({
    collectionsMetadata: PropTypes.arrayOf(
      collectionMetadataPropType
    ),
    isItemLoaded: PropTypes.func,
    onAddProjectCollection: PropTypes.func,
    onRemoveCollectionFromProject: PropTypes.func,
    onViewCollectionDetails: PropTypes.func,
    onViewCollectionGranules: PropTypes.func,
    setSize: PropTypes.func,
    windowWidth: PropTypes.number

  }).isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.shape({}).isRequired
}

export default CollectionResultsListItem
