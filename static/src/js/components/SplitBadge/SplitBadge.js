import React from 'react'
import { PropTypes } from 'prop-types'
import { Badge } from 'react-bootstrap'

import './SplitBadge.scss'

const SplitBadge = ({ primary, secondary, variant }) => (
  <Badge className="split-badge" variant={variant}>
    {primary}
    <span className="split-badge__inner">
      {secondary}
    </span>
  </Badge>
)

SplitBadge.defaultProps = {
  variant: 'primary'
}

SplitBadge.propTypes = {
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
  variant: PropTypes.string
}

export default SplitBadge
