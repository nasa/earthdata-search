import React from 'react'
import PropTypes from 'prop-types'
import { TooltipRenderProps } from 'react-joyride'

const TourTooltip = (props) => {
  const {
    backProps, closeProps, continuous, index, primaryProps, skipProps, step, tooltipProps
  } = props

  return (
    <div className="custom-tooltip__body" {...tooltipProps}>
      <button className="custom-tooltip__close" {...closeProps}>
        &times;
      </button>
      {step.title && <h4 className="custom-tooltip__title">{step.title}</h4>}
      <div className="custom-tooltip__content">{step.content}</div>
      <div className="custom-tooltip__footer">
        <button className="custom-tooltip__button" {...skipProps}>
          {skipProps.title || 'Skip'}
        </button>
        <div className="custom-tooltip__spacer">
          {
            index > 0 && (
              <button className="custom-tooltip__button" {...backProps}>
                {backProps.title || 'Back'}
              </button>
            )
          }
          {
            continuous && (
              <button className="custom-tooltip__button custom-tooltip__button--primary" {...primaryProps}>
                {primaryProps.title || 'Next'}
              </button>
            )
          }
        </div>
      </div>
    </div>
  )
}

TourTooltip.propTypes = {
  backProps: PropTypes.object.isRequired,
  closeProps: PropTypes.object.isRequired,
  continuous: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  primaryProps: PropTypes.object.isRequired,
  skipProps: PropTypes.object.isRequired,
  step: PropTypes.object.isRequired,
  tooltipProps: PropTypes.object.isRequired
}

export default TourTooltip
