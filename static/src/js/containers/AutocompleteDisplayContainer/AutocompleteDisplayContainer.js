import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'
import AutocompleteDisplay from '../../components/AutocompleteDisplay/AutocompleteDisplay'

export const mapDispatchToProps = (dispatch) => ({
  onRemoveAutocompleteValue:
    (data) => dispatch(actions.removeAutocompleteValue(data))
})

export const mapStateToProps = (state) => ({
  selected: state.autocomplete.selected
})

export const AutocompleteDisplayContainer = ({
  selected,
  onRemoveAutocompleteValue
}) => (
  <AutocompleteDisplay
    selected={selected}
    onRemoveAutocompleteValue={onRemoveAutocompleteValue}
  />
)

AutocompleteDisplayContainer.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onRemoveAutocompleteValue: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(AutocompleteDisplayContainer)
