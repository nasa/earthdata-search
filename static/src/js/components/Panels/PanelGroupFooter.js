import React from 'react'
import PropTypes from 'prop-types'

import './PanelGroupFooter.scss'

export const PanelGroupFooter = ({ footer }) => (
  <footer className="panel-group-footer">
    {footer}
  </footer>
)

PanelGroupFooter.defaultProps = {
  footer: null
}

PanelGroupFooter.propTypes = {
  footer: PropTypes.node
}

export default PanelGroupFooter
