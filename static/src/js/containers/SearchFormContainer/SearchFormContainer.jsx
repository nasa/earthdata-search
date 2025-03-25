import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import SearchForm from '../../components/SearchForm/SearchForm'

export const mapDispatchToProps = (dispatch) => ({
  onChangeQuery:
    (query) => dispatch(actions.changeQuery(query)),
  onChangeFocusedCollection:
    (collectionId) => dispatch(actions.changeFocusedCollection(collectionId)),
  onClearFilters:
    () => dispatch(actions.clearFilters()),
  onToggleAdvancedSearchModal:
    (state) => dispatch(actions.toggleAdvancedSearchModal(state)),
  onCancelAutocomplete:
    () => dispatch(actions.cancelAutocomplete()),
  onClearAutocompleteSuggestions:
    () => dispatch(actions.clearAutocompleteSuggestions()),
  onFetchAutocomplete:
    (data) => dispatch(actions.fetchAutocomplete(data)),
  onSelectAutocompleteSuggestion:
    (data) => dispatch(actions.selectAutocompleteSuggestion(data))
})

export const mapStateToProps = (state) => ({
  advancedSearch: state.advancedSearch,
  autocomplete: state.autocomplete,
  boundingBoxSearch: state.query.collection.spatial.boundingBox,
  circleSearch: state.query.collection.spatial.circle,
  drawingNewLayer: state.ui.map.drawingNewLayer,
  keywordSearch: state.query.collection.keyword,
  lineSearch: state.query.collection.spatial.line,
  pointSearch: state.query.collection.spatial.point,
  polygonSearch: state.query.collection.spatial.polygon,
  shapefile: state.shapefile,
  temporalSearch: state.query.collection.temporal
})

// Export non-redux-connected component for use in tests
// Import this class as `import { SearchFormContainer } from '../SearchFormContainer'`
export const SearchFormContainer = (props) => {
  const {
    advancedSearch,
    autocomplete,
    keywordSearch,
    onCancelAutocomplete,
    onChangeQuery,
    onClearFilters,
    onChangeFocusedCollection,
    onToggleAdvancedSearchModal,
    onClearAutocompleteSuggestions,
    onFetchAutocomplete,
    onSelectAutocompleteSuggestion
  } = props

  return (
    <SearchForm
      onChangeQuery={onChangeQuery}
      onChangeFocusedCollection={onChangeFocusedCollection}
      onClearFilters={onClearFilters}
      onToggleAdvancedSearchModal={onToggleAdvancedSearchModal}
      onCancelAutocomplete={onCancelAutocomplete}
      onClearAutocompleteSuggestions={onClearAutocompleteSuggestions}
      onFetchAutocomplete={onFetchAutocomplete}
      onSelectAutocompleteSuggestion={onSelectAutocompleteSuggestion}
      advancedSearch={advancedSearch}
      keywordSearch={keywordSearch}
      autocomplete={autocomplete}
    />
  )
}

SearchFormContainer.defaultProps = {
  advancedSearch: {},
  keywordSearch: '',
  shapefile: {},
  temporalSearch: {}
}

SearchFormContainer.propTypes = {
  advancedSearch: PropTypes.shape({
    regionSearch: PropTypes.shape({})
  }),
  autocomplete: PropTypes.shape({}).isRequired,
  keywordSearch: PropTypes.string,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeFocusedCollection: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired,
  onCancelAutocomplete: PropTypes.func.isRequired,
  onClearAutocompleteSuggestions: PropTypes.func.isRequired,
  onFetchAutocomplete: PropTypes.func.isRequired,
  onSelectAutocompleteSuggestion: PropTypes.func.isRequired,
  shapefile: PropTypes.shape({
    shapefileError: PropTypes.string,
    shapefileId: PropTypes.string,
    shapefileLoaded: PropTypes.bool,
    shapefileLoading: PropTypes.bool
  }),
  temporalSearch: PropTypes.shape({
    endDate: PropTypes.string,
    startDate: PropTypes.string
  })
}

// Export redux-connected component for use in application
// Import this class as `import ConnectedSearchFormContainer from './SearchFormContainer'`
export default connect(mapStateToProps, mapDispatchToProps)(SearchFormContainer)
