import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'

import GranuleResultsList from './GranuleResultsList'

import './GranuleResultsBody.scss'

/**
 * Renders GranuleResultsBody.
 * @param {object} props - The props passed into the component.
 * @param {object} props.granules - Granules passed from redux store.
 */
class GranuleResultsBody extends Component {
  constructor() {
    super()
    this.getRef = this.getRef.bind(this)
    this.wrapper = React.createRef()
    this.scrollContainer = null
  }

  componentDidMount() {
    const {
      current
    } = this.wrapper

    if (current) {
      this.scrollContainer = current.querySelector('.simplebar-content-wrapper')
    }
  }

  getRef(wrapper) {
    this.wrapper = {
      current: wrapper
    }
  }

  render() {
    const {
      collectionId,
      excludedGranuleIds,
      focusedGranule,
      granules,
      isCwic,
      pageNum,
      location,
      waypointEnter,
      onExcludeGranule,
      onFocusedGranuleChange,
      onMetricsDataAccess
    } = this.props

    return (
      <div className="granule-results-body" ref={el => this.getRef(el)}>
        <SimpleBar className="granule-results-body__scroll-container">
          <GranuleResultsList
            collectionId={collectionId}
            excludedGranuleIds={excludedGranuleIds}
            focusedGranule={focusedGranule}
            granules={granules}
            isCwic={isCwic}
            pageNum={pageNum}
            location={location}
            waypointEnter={waypointEnter}
            scrollContainer={this.scrollContainer}
            onExcludeGranule={onExcludeGranule}
            onFocusedGranuleChange={onFocusedGranuleChange}
            onMetricsDataAccess={onMetricsDataAccess}
          />
        </SimpleBar>
      </div>
    )
  }
}

GranuleResultsBody.propTypes = {
  collectionId: PropTypes.string.isRequired,
  excludedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  focusedGranule: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  isCwic: PropTypes.bool.isRequired,
  pageNum: PropTypes.number.isRequired,
  location: PropTypes.shape({}).isRequired,
  waypointEnter: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired
}

export default GranuleResultsBody
