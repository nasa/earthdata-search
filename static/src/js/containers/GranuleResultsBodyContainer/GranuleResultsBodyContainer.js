import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'

import GranuleResultsBody from '../../components/GranuleResults/GranuleResultsBody'

const mapDispatchToProps = dispatch => ({
  onFocusedCollectionChange: (collectionId) => {
    dispatch(actions.changeFocusedCollection(collectionId))
  }
})

const mapStateToProps = state => ({
  granules: state.entities.granules,
  focusedCollection: state.focusedCollection
})

export const GranuleResultsBodyContainer = (props) => {
  const {
    granules,
    focusedCollection,
    onFocusedCollectionChange
  } = props

  return (
    <GranuleResultsBody
      granules={granules}
      focusedCollection={focusedCollection}
      onFocusedCollectionChange={onFocusedCollectionChange}
    />
  )
}

GranuleResultsBodyContainer.defaultProps = {
  focusedCollection: {}
}

GranuleResultsBodyContainer.propTypes = {
  granules: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.shape({}),
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(GranuleResultsBodyContainer)
