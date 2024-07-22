import React from 'react'
import PropTypes from 'prop-types'

/**
 * Renders PanelGroupHeaderMeta.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.children - Children components.
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
