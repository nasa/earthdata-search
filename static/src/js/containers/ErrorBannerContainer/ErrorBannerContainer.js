import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../../actions/index'
import { Banner } from '../../components/Banner/Banner'

export const mapDispatchToProps = (dispatch) => ({
  onRemoveError: (id) => dispatch(actions.removeError(id))
})

export const mapStateToProps = (state) => ({
  errors: state.errors
})

export const ErrorBannerContainer = ({ errors, onRemoveError }) => {
  if (!errors || errors.length === 0) return null

  const [error] = errors

  const {
    id,
    message,
    title
  } = error

  const onClose = () => {
    onRemoveError(id)
  }

  return (
    <Banner
      message={message}
      onClose={onClose}
      title={title}
      type="error"
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
