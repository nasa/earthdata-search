import React from 'react'
import Tooltip, { TooltipProps } from 'react-bootstrap/Tooltip'

/**
 * Renders a Bootstrap Tooltip with the given props. This function ensures that a ref gets
 * passed correctly onto the Tooltip component to avoid the screen 'jumping' when drawing
 * the tooltip.
 * @param tooltipProps Props to be passed to a Bootstrap Tooltip
 * @returns A Bootstrap Tooltip component
 */
const renderTooltip = (tooltipProps: TooltipProps) => (
  <Tooltip {...tooltipProps}>
    {tooltipProps.children}
  </Tooltip>
)

export default renderTooltip
