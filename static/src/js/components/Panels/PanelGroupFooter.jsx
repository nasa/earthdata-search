import React from 'react'
import PropTypes from 'prop-types'

import './PanelGroupFooter.scss'

/**
 * Renders PanelGroupFooter.
 * @param {object} props - The props passed into the component.
 * @param {node} props.footer - The element to be used as the footer. Can be overridden on an individual PanelItem.
 */
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
