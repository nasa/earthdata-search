import React from 'react'
import PropTypes from 'prop-types'

export const WellFooter = ({
  children
}) => (
  <footer className="well__footer">
    {children}
  </footer>
)

WellFooter.defaultProps = {
  children: null
}

WellFooter.propTypes = {
  children: PropTypes.node
}

export default WellFooter
