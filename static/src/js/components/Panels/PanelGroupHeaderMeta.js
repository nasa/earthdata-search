import React from 'react'
import PropTypes from 'prop-types'

/**
 * Renders PanelGroupHeaderMeta.
 * @param {object} props - The props passed into the component.
 * @param {string} props.children - Children components.
 */
export const PanelGroupHeaderMeta = ({
  children
}) => (
  <div className="panel-group-header-meta">
    {children}
  </div>
)

PanelGroupHeaderMeta.defaultProps = {
  children: null
}

PanelGroupHeaderMeta.propTypes = {
  children: PropTypes.node
}

export default PanelGroupHeaderMeta
