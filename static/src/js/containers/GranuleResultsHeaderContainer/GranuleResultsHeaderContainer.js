import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions'

import GranuleResultsHeader from '../../components/GranuleResults/GranuleResultsHeader'

const mapDispatchToProps = dispatch => ({
  onUpdateSortOrder:
    sortOrder => dispatch(actions.granuleResultsPanelUpdateSortOrder(sortOrder)),
  onUpdateSearchValue:
    searchValue => dispatch(actions.granuleResultsPanelUpdateSearchValue(searchValue))
})

const mapStateToProps = state => ({
  focusedCollection: state.focusedCollection,
  sortOrder: state.ui.granuleResultsPanel.sortOrder,
  searchValue: state.ui.granuleResultsPanel.searchValue
})

export const GranuleResultsHeaderContainer = (props) => {
  const {
    focusedCollection,
    location,
    onUpdateSearchValue,
    onUpdateSortOrder,
    searchValue,
    sortOrder
  } = props

  return (
    <GranuleResultsHeader
      location={location}
      focusedCollection={focusedCollection}
      onUpdateSortOrder={onUpdateSortOrder}
      onUpdateSearchValue={onUpdateSearchValue}
      sortOrder={sortOrder}
      searchValue={searchValue}
    />
  )
}

GranuleResultsHeaderContainer.defaultProps = {
  focusedCollection: {}
}

GranuleResultsHeaderContainer.propTypes = {
  location: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.shape({}),
  onUpdateSortOrder: PropTypes.func.isRequired,
  onUpdateSearchValue: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsHeaderContainer)
)
