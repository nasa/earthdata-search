import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isPlainObject, isEmpty } from 'lodash'

import actions from '../../actions/index'

import SearchForm from '../../components/SearchForm/SearchForm'

const mapDispatchToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onChangeFocusedCollection:
    collectionId => dispatch(actions.changeFocusedCollection(collectionId)),
  onClearFilters:
    () => dispatch(actions.clearFilters()),
  onToggleAdvancedSearchModal:
    state => dispatch(actions.toggleAdvancedSearchModal(state))
})

const mapStateToProps = state => ({
  advancedSearch: state.advancedSearch,
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  drawingNewLayer: state.ui.map.drawingNewLayer,
  gridCoords: state.query.granule.gridCoords,
  gridName: state.query.collection.gridName,
  keywordSearch: state.query.collection.keyword,
  lineSearch: state.query.collection.spatial.line,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon,
  selectingNewGrid: state.ui.grid.selectingNewGrid,
  shapefile: state.shapefile,
  temporalSearch: state.query.collection.temporal
})

// Export non-redux-connected component for use in tests
// Import this class as `import { SearchFormContainer } from '../SearchFormContainer'`
export const SearchFormContainer = (props) => {
  const {
    advancedSearch,
    boundingBoxSearch,
    drawingNewLayer,
    gridName,
    gridCoords,
    lineSearch,
    pointSearch,
    keywordSearch,
    polygonSearch,
    selectingNewGrid,
    shapefile,
    temporalSearch,
    onChangeQuery,
    onClearFilters,
    onChangeFocusedCollection,
    onToggleAdvancedSearchModal
  } = props

  const {
    endDate: temporalEnd,
    startDate: temporalStart
  } = temporalSearch

  const {
    shapefileError,
    shapefileLoading,
    shapefileLoaded,
    shapefileId
  } = shapefile

  const showFilterStackToggle = [
    advancedSearch,
    boundingBoxSearch,
    drawingNewLayer,
    gridName,
    gridCoords,
    lineSearch,
    pointSearch,
    keywordSearch,
    polygonSearch,
    selectingNewGrid,
    shapefileError,
    shapefileLoading,
    shapefileLoaded,
    shapefileId,
    temporalEnd,
    temporalStart
  ].some((filter) => {
    if (isPlainObject(filter)) {
      return !isEmpty(filter)
    }
    return !!filter
  })

  return (
    <SearchForm
      onChangeQuery={onChangeQuery}
      onChangeFocusedCollection={onChangeFocusedCollection}
      onClearFilters={onClearFilters}
      onToggleAdvancedSearchModal={onToggleAdvancedSearchModal}
      advancedSearch={advancedSearch}
      keywordSearch={keywordSearch}
      showFilterStackToggle={showFilterStackToggle}
    />
  )
}

SearchFormContainer.defaultProps = {
  advancedSearch: {},
  keywordSearch: '',
  boundingBoxSearch: '',
  gridName: '',
  gridCoords: '',
  lineSearch: '',
  pointSearch: '',
  polygonSearch: '',
  shapefile: {},
  temporalSearch: {}
}

SearchFormContainer.propTypes = {
  advancedSearch: PropTypes.shape({}),
  boundingBoxSearch: PropTypes.string,
  drawingNewLayer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  gridName: PropTypes.string,
  gridCoords: PropTypes.string,
  lineSearch: PropTypes.string,
  keywordSearch: PropTypes.string,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeFocusedCollection: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired,
  pointSearch: PropTypes.string,
  polygonSearch: PropTypes.string,
  selectingNewGrid: PropTypes.bool.isRequired,
  shapefile: PropTypes.shape({}),
  temporalSearch: PropTypes.shape({})
}

// Export redux-connected component for use in application
// Import this class as `import ConnectedSearchFormContainer from './SearchFormContainer'`
export default connect(mapStateToProps, mapDispatchToProps)(SearchFormContainer)
