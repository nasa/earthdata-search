import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions/index'

import CollectionResultsBody from '../../components/CollectionResults/CollectionResultsBody'

const mapStateToProps = state => ({
  collections: state.entities.collections,
  query: state.query.collection
})

const mapDispatchToProps = dispatch => ({
  onFocusedCollectionChange:
    collectionId => dispatch(actions.changeFocusedCollection(collectionId)),
  onChangeCollectionPageNum:
    data => dispatch(actions.changeCollectionPageNum(data))
})

export const CollectionResultsBodyContainer = (props) => {
  const {
    collections,
    query,
    location,
    onFocusedCollectionChange,
    onChangeCollectionPageNum
  } = props

  const loadCollections = (params) => {
    if (params.event !== null) {
      const { pageNum } = query
      onChangeCollectionPageNum(pageNum + 1)
    }
  }

  return (
    <CollectionResultsBody
      collections={collections}
      location={location}
      onFocusedCollectionChange={onFocusedCollectionChange}
      waypointEnter={loadCollections}
    />
  )
}

CollectionResultsBodyContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  query: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onChangeCollectionPageNum: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionResultsBodyContainer)
)
