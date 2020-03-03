import React, { PureComponent } from 'react'
import { PropTypes } from 'prop-types'
import { difference } from 'lodash'

import GranuleResultsItem from './GranuleResultsItem'
import Skeleton from '../Skeleton/Skeleton'

import {
  granuleListItem
} from './skeleton'

import murmurhash3 from '../../util/murmurhash3'
import { eventEmitter } from '../../events/events'

import './GranuleResultsList.scss'

const granuleListItemSkeletonStyle = {
  height: '144px'
}

/**
 * Renders GranuleResultsList.
 * @param {object} props - The props passed into the component.
 * @param {object} props.granules - List of granules passed from redux store.
 */
export class GranuleResultsList extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      focusedGranuleId: ''
    }

    this.onFocusGranule = this.onFocusGranule.bind(this)
  }

  componentDidMount() {
    eventEmitter.on('map.focusgranule', this.onFocusGranule)
  }

  componentWillUnmount() {
    eventEmitter.off('map.focusgranule', this.onFocusGranule)
  }

  onFocusGranule({ granule }) {
    let id
    if (granule) ({ id } = granule)

    this.setState({ focusedGranuleId: id })
  }

  render() {
    const { focusedGranuleId } = this.state
    const {
      collectionId,
      excludedGranuleIds,
      focusedGranule,
      granules,
      isCwic,
      pageNum,
      location,
      waypointEnter,
      scrollContainer,
      onExcludeGranule,
      onFocusedGranuleChange,
      onMetricsDataAccess
    } = this.props
    const {
      isLoading,
      isLoaded
    } = granules

    const allGranuleIds = granules.allIds
    let granuleIds
    if (isCwic) {
      granuleIds = allGranuleIds.filter((id) => {
        const hashedId = murmurhash3(id).toString()
        return excludedGranuleIds.indexOf(hashedId) === -1
      })
    } else {
      granuleIds = difference(allGranuleIds, excludedGranuleIds)
    }

    const initialLoading = ((pageNum === 1 && isLoading) || (!isLoaded && !isLoading))

    const granulesList = granuleIds.map((granuleId, index) => {
      const isLast = granuleIds.length > 0 && index === granuleIds.length - 1

      const isFocused = focusedGranuleId === granuleId

      // Ensure a unique key for granules with the same id (CWIC)
      const granuleKey = `${granuleId}-${index}`
      return (
        <GranuleResultsItem
          collectionId={collectionId}
          focusedGranule={focusedGranule}
          granule={granules.byId[granuleId]}
          isFocused={isFocused}
          isLast={isLast}
          key={granuleKey}
          location={location}
          waypointEnter={waypointEnter}
          scrollContainer={scrollContainer}
          onExcludeGranule={onExcludeGranule}
          onFocusedGranuleChange={onFocusedGranuleChange}
          onMetricsDataAccess={onMetricsDataAccess}
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

    return (
      <div className="granule-results-list">
        <ul className="granule-results-list__list">
          {initialLoading && granulesLoadingList}
          {!initialLoading && granulesList}
        </ul>
      </div>
    )
  }
}

GranuleResultsList.defaultProps = {
  scrollContainer: null
}

GranuleResultsList.propTypes = {
  collectionId: PropTypes.string.isRequired,
  excludedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  focusedGranule: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  pageNum: PropTypes.number.isRequired,
  isCwic: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  waypointEnter: PropTypes.func.isRequired,
  scrollContainer: PropTypes.instanceOf(Element),
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired
}

export default GranuleResultsList
