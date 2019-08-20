import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import actions from '../../actions/index'

import Timeline from '../../components/Timeline/Timeline'
import { getFocusedCollectionMetadata } from '../../util/focusedCollection'

const mapDispatchToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onChangeProjectQuery: query => dispatch(actions.changeProjectQuery(query)),
  onChangeTimelineQuery: query => dispatch(actions.changeTimelineQuery(query)),
  onToggleOverrideTemporalModal:
    open => dispatch(actions.toggleOverrideTemporalModal(open))
})

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  pathname: state.router.location.pathname,
  project: state.project,
  temporalSearch: state.query.collection.temporal,
  timeline: state.timeline
})

export const TimelineContainer = (props) => {
  const {
    collections,
    focusedCollection,
    pathname,
    project,
    temporalSearch,
    timeline,
    onChangeQuery,
    onChangeProjectQuery,
    onChangeTimelineQuery,
    onToggleOverrideTemporalModal
  } = props

  let changeQueryMethod = onChangeQuery
  // Determine the collectionMetadata the timeline should be displaying
  const isProjectPage = pathname.startsWith('/project')
  const isGranulesPage = pathname.startsWith('/search/granules')
  const collectionMetadata = {}
  let granuleFilterTemporal

  if (isProjectPage) {
    const { byId } = collections
    const { collectionIds: projectIds } = project
    projectIds.forEach((collectionId, index) => {
      if (index > 2) return // only take the first 3 collections
      collectionMetadata[collectionId] = byId[collectionId]
    })

    changeQueryMethod = onChangeProjectQuery
  } else if (isGranulesPage && focusedCollection !== '') {
    const metadata = getFocusedCollectionMetadata(focusedCollection, collections)
    collectionMetadata[focusedCollection] = metadata[focusedCollection]
  }

  if (!isEmpty(collectionMetadata[focusedCollection])) {
    const { granuleFilters = {} } = collectionMetadata[focusedCollection]
    if (!isEmpty(granuleFilters)) {
      ({
        temporal: granuleFilterTemporal
      } = granuleFilters)
    }
  }

  if (Object.keys(collectionMetadata).length === 0) return null

  return (
    <Timeline
      collectionMetadata={collectionMetadata}
      focusedCollection={focusedCollection}
      showOverrideModal={isProjectPage}
      temporalSearch={temporalSearch}
      granuleFilterTemporal={granuleFilterTemporal}
      timeline={timeline}
      onChangeQuery={changeQueryMethod}
      onChangeTimelineQuery={onChangeTimelineQuery}
      onToggleOverrideTemporalModal={onToggleOverrideTemporalModal}
    />
  )
}

TimelineContainer.defaultProps = {
  temporalSearch: {}
}

TimelineContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  project: PropTypes.shape({}).isRequired,
  temporalSearch: PropTypes.shape({}),
  timeline: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeProjectQuery: PropTypes.func.isRequired,
  onChangeTimelineQuery: PropTypes.func.isRequired,
  onToggleOverrideTemporalModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineContainer)
