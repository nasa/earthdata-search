import React from 'react'
import PropTypes from 'prop-types'

/**
 * Renders PanelGroupHeaderMeta.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.children - Children components.
 */
export const PanelGroupHeaderMeta = ({
  children = null
}) => (
  <div className="panel-group-header-meta">
    {children}
  </div>
)

PanelGroupHeaderMeta.propTypes = {
  children: PropTypes.node
}

export default PanelGroupHeaderMeta
