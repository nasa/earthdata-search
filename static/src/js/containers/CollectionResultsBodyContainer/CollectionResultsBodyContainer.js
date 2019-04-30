import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions/index'

import CollectionResultsBody from '../../components/CollectionResults/CollectionResultsBody'

const mapStateToProps = state => ({
  collections: state.entities.collections
})

const mapDispatchToProps = dispatch => ({
  onFocusedCollectionChange:
    collectionId => dispatch(actions.changeFocusedCollection(collectionId))
})

export const CollectionResultsBodyContainer = (props) => {
  const {
    collections,
    location,
    onFocusedCollectionChange
  } = props

  return (
    <CollectionResultsBody
      collections={collections}
      location={location}
      onFocusedCollectionChange={onFocusedCollectionChange}
    />
  )
}

CollectionResultsBodyContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionResultsBodyContainer)
)
