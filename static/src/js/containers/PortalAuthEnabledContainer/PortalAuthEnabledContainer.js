import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  portal: state.portal
})

export const PortalAuthEnabledContainer = ({ children, portal }) => {
  const { features = {} } = portal
  const { authentication } = features

  if (authentication) {
    return (
      <>
        { children }
      </>
    )
  }

  return null
}

PortalAuthEnabledContainer.propTypes = {
  children: PropTypes.node.isRequired,
  portal: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps)(PortalAuthEnabledContainer)
