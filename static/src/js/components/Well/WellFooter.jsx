import React from 'react'
import PropTypes from 'prop-types'

export const WellFooter = ({
  children = null
}) => (
  <footer className="well__footer">
    {children}
  </footer>
)

WellFooter.propTypes = {
  children: PropTypes.node
}

export default WellFooter
