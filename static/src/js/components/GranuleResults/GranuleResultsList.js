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
  const { granules } = props
  const {
    hits,
    loadTime,
    isLoading,
    isLoaded
  } = granules

  const doneLoading = (!isLoading && isLoaded)

  const granulesList = granules.allIds.map(granuleId => (
    <GranuleResultsItem key={granuleId} granule={granules.byId[granuleId]} />
  ))

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


  const visibleGranules = granulesList.length ? granulesList.length : 0

  const loadTimeInSeconds = (loadTime / 1000).toFixed(1)

  return (
    <div className="granule-results-list">
      <div className="granule-results-list__header">
        <span className="granule-results-list__header-item">
          {!doneLoading && (
            <Skeleton
              containerStyle={{ height: '18px', width: '213px' }}
              shapes={granuleListTotal}
            />
          )}
          {doneLoading && `Showing ${visibleGranules} of ${hits} matching granules` }
        </span>
        <span className="granule-results-list__header-item">
          {!doneLoading && (
            <Skeleton
              containerStyle={{ height: '18px', width: '110px' }}
              shapes={granuleTimeTotal}
            />
          )}
          {doneLoading && `Search Time: ${loadTimeInSeconds}s`}
        </span>
      </div>
      <ul className="granule-results-list__list">
        {!doneLoading && granulesLoadingList}
        {doneLoading && granulesList}
      </ul>
    </div>
  )
}

GranuleResultsList.propTypes = {
  granules: PropTypes.shape({}).isRequired
}

export default pure(GranuleResultsList)
