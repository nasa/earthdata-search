import React from 'react'
import PropTypes from 'prop-types'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

const MetaLayerControl = ({
  tooltipContent,
  tooltipClassName,
  id
}) => (
  <div style={{ display: 'inline-block' }}>
    <OverlayTrigger
      placement="right"
      overlay={
        (
          <Tooltip
            id={`tooltip__${id}`}
            className={tooltipClassName}
          >
            {tooltipContent}
          </Tooltip>
        )
      }
    >
      {/* Use a div as the trigger element to wrap both checkbox and label */}
      <div style={{ display: 'inline-block' }}>
        <label style={
          {
            opacity: 0.5,
            cursor: 'not-allowed'
          }
        }
        >
          <input
            type="checkbox"
            className="leaflet-control-layers-selector"
            disabled
            checked={false}
            onChange={() => {}}
          />
          <span> Place Labels *</span>
        </label>
      </div>
    </OverlayTrigger>
  </div>
)

MetaLayerControl.defaultProps = {
  tooltipClassName: ''
}

MetaLayerControl.propTypes = {
  tooltipContent: PropTypes.node.isRequired,
  tooltipClassName: PropTypes.string,
  id: PropTypes.string.isRequired
}

export default MetaLayerControl
