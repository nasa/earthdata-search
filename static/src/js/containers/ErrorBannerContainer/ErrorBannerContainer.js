import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../../actions/index'
import { ErrorBanner } from '../../components/ErrorBanner/ErrorBanner'

const mapDispatchToProps = dispatch => ({
  onRemoveError: id => dispatch(actions.removeError(id))
})

const mapStateToProps = state => ({
  errors: state.errors
})

export const ErrorBannerContainer = ({ errors, onRemoveError }) => {
  if (!errors || errors.length === 0) return null

  const [error] = errors

  return (
    <ErrorBanner
      error={error}
      onRemoveError={onRemoveError}
    />
  )
}

ErrorBannerContainer.defaultProps = {
  errors: []
}

ErrorBannerContainer.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.shape({})),
  onRemoveError: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBannerContainer)
