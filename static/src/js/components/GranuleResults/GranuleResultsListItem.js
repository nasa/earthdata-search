import React, {
  memo,
  useEffect,
  useRef
} from 'react'
import { PropTypes } from 'prop-types'

import { useRemsToPixels } from '../../hooks/useRemsToPixels'
import { granuleListItem } from './skeleton'

import GranuleResultsItem from './GranuleResultsItem'
import Skeleton from '../Skeleton/Skeleton'

/**
 * Renders GranuleResultsListItem.
 * @param {Object} props - The props passed into the component.
 * @param {Number} props.columnIndex - The column index of the current item from react-window.
 * @param {Object} props.data - The data of the current item from react-window.
 * @param {Number} props.rowIndex - The row index of the current item from react-window.
 * @param {Object} props.style - The style attributes of the current item from react-window.
 */
export const GranuleResultsListItem = memo(({
  columnIndex,
  data,
  rowIndex,
  style
}) => {
  const element = useRef()

  const {
    collectionId,
    directDistributionInformation,
    granules,
    isCollectionInProject,
    isGranuleInProject,
    isItemLoaded,
    location,
    numColumns,
    onAddGranuleToProjectCollection,
    onExcludeGranule,
    onFocusedGranuleChange,
    onMetricsDataAccess,
    onRemoveGranuleFromProjectCollection,
    portal,
    setRowHeight,
    windowWidth
  } = data

  const { remInPixels } = useRemsToPixels()

  // Calculate the index of the list item
  const index = rowIndex * numColumns + columnIndex

  useEffect(() => {
    if (!element.current) return

    // Calculate and set the size of the current item
    const currentHeight = element.current.getBoundingClientRect().height

    setRowHeight(rowIndex, columnIndex, currentHeight)
  }, [windowWidth, element.current])

  // Tweak the position of the elements to simultate the correct margins
  const customStyle = {
    ...style,
    left: style.left + remInPixels,
    top: style.top + remInPixels,
    width: style.width - remInPixels,
    height: style.height - remInPixels
  }

  // If the item has not loaded, render a placeholder
  if (!isItemLoaded(index)) {
    return (
      <li
        ref={element}
        className="granule-results-list-item"
        style={customStyle}
      >
        <Skeleton
          className="granule-results-item"
          containerStyle={{
            height: '140px',
            width: '100%'
          }}
          shapes={granuleListItem}
        />
      </li>
    )
  }

  const granule = granules[index] || false

  // Prevent rendering of additional items so we only get 1 placeholder during loading
  if (!granule) return null

  return (
    <li className="granule-results-list-item" style={customStyle}>
      <GranuleResultsItem
        collectionId={collectionId}
        directDistributionInformation={directDistributionInformation}
        granule={granules[index]}
        isCollectionInProject={isCollectionInProject}
        isGranuleInProject={isGranuleInProject}
        location={location}
        onAddGranuleToProjectCollection={onAddGranuleToProjectCollection}
        onExcludeGranule={onExcludeGranule}
        onFocusedGranuleChange={onFocusedGranuleChange}
        onMetricsDataAccess={onMetricsDataAccess}
        onRemoveGranuleFromProjectCollection={onRemoveGranuleFromProjectCollection}
        portal={portal}
        ref={element}
      />
    </li>
  )
})

GranuleResultsListItem.displayName = 'GranuleResultsListItem'

GranuleResultsListItem.propTypes = {
  columnIndex: PropTypes.number.isRequired,
  data: PropTypes.shape({
    collectionId: PropTypes.string,
    directDistributionInformation: PropTypes.shape({}),
    granules: PropTypes.arrayOf(PropTypes.shape({})),
    isCollectionInProject: PropTypes.bool,
    isGranuleInProject: PropTypes.func,
    isItemLoaded: PropTypes.func,
    location: PropTypes.shape({}),
    numColumns: PropTypes.number,
    onAddGranuleToProjectCollection: PropTypes.func,
    onExcludeGranule: PropTypes.func,
    onFocusedGranuleChange: PropTypes.func,
    onMetricsDataAccess: PropTypes.func,
    onRemoveGranuleFromProjectCollection: PropTypes.func,
    portal: PropTypes.shape({}),
    setRowHeight: PropTypes.func,
    windowWidth: PropTypes.number
  }).isRequired,
  rowIndex: PropTypes.number.isRequired,
  style: PropTypes.shape({
    height: PropTypes.number,
    left: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number
  }).isRequired
}

export default GranuleResultsListItem
