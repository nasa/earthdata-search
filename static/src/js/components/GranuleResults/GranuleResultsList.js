import React from 'react'
import { PropTypes } from 'prop-types'
import { pure } from 'recompose'

import GranuleResultsItem from './GranuleResultsItem'
import Skeleton from '../Skeleton/Skeleton'

import {
  granuleListItem,
  granuleListTotal,
  granuleTimeTotal
} from './skeleton'

import './GranuleResultsList.scss'

const granuleListItemSkeletonStyle = {
  height: '144px'
}

/**
 * Renders GranuleResultsList.
 * @param {object} props - The props passed into the component.
 * @param {object} props.granules - List of granules passed from redux store.
 */
export const GranuleResultsList = (props) => {
  const { granules, pageNum, waypointEnter } = props
  const {
    hits,
    loadTime,
    isLoading,
    isLoaded
  } = granules

  const granuleIds = granules.allIds

  const initialLoading = (pageNum === 1 && !isLoaded)

  const granulesList = granuleIds.map((granuleId, index) => {
    const isLast = granuleIds.length > 0 && index === granuleIds.length - 1
    return (
      <GranuleResultsItem
        key={granuleId}
        granule={granules.byId[granuleId]}
        isLast={isLast}
        waypointEnter={waypointEnter}
      />
    )
  })

  const granulesLoadingList = [1, 2, 3].map((item,
    i) => {
    const key = `granule_loader_${i}`
    return (
      <Skeleton
        key={key}
        className="granule-results-item"
        containerStyle={granuleListItemSkeletonStyle}
        shapes={granuleListItem}
      />
    )
  })

  // if loading pageNum > 1, append more skeletons to the granulesList
  if (pageNum > 1 && isLoading) {
    granulesList.push(granulesLoadingList[0])
  }

  const visibleGranules = granulesList.length ? granulesList.length : 0

  const loadTimeInSeconds = (loadTime / 1000).toFixed(1)

  return (
    <div className="granule-results-list">
      <div className="granule-results-list__header">
        <span className="granule-results-list__header-item">
          {
            initialLoading && (
              <Skeleton
                containerStyle={{ height: '18px', width: '213px' }}
                shapes={granuleListTotal}
              />
            )
          }
          {!initialLoading && `Showing ${visibleGranules} of ${hits} matching granules` }
        </span>
        <span className="granule-results-list__header-item">
          {
            initialLoading && (
              <Skeleton
                containerStyle={{ height: '18px', width: '110px' }}
                shapes={granuleTimeTotal}
              />
            )
          }
          {!initialLoading && `Search Time: ${loadTimeInSeconds}s` }
        </span>
      </div>
      <ul className="granule-results-list__list">
        {initialLoading && granulesLoadingList}
        {!initialLoading && granulesList}
      </ul>
    </div>
  )
}

GranuleResultsList.propTypes = {
  granules: PropTypes.shape({}).isRequired,
  pageNum: PropTypes.number.isRequired,
  waypointEnter: PropTypes.func.isRequired
}

export default pure(GranuleResultsList)
