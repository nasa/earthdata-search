import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Check, Settings } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { FaQuestionCircle } from 'react-icons/fa'

import EDSCIcon from '../../EDSCIcon/EDSCIcon'
import ExternalLink from '../../ExternalLink/ExternalLink'
import AvailableCustomizationsIcons from '../../AvailableCustomizationsIcons/AvailableCustomizationsIcons'
import AvailableCustomizationsTooltipIcons from '../../AvailableCustomizationsIcons/AvailableCustomizationsTooltipIcons'
import MetaIcon from '../../MetaIcon/MetaIcon'

import './AccessMethodRadio.scss'

export const AccessMethodRadio = ({
  id,
  description,
  details,
  value,
  checked,
  onChange,
  onClick,
  title,
  subtitle,
  customizationOptions,
  isHarmony,
  disabled,
  errorMessage,
  externalLink
}) => {
  const labelClasses = [
    'access-method-radio',
    {
      'access-method-radio--is-selected': checked
    },
    {
      'access-method-radio--is-harmony': isHarmony
    },
    {
      'access-method-radio--disable-button': disabled
    }
  ]
  const [showTooltip, setShowTooltip] = useState(false)

  const labelClassName = classNames(labelClasses)

  const {
    hasSpatialSubsetting = false,
    hasVariables = false,
    hasTransforms = false,
    hasFormats = false,
    hasTemporalSubsetting = false,
    hasCombine = false
  } = customizationOptions || {}

  const availableCustomizationsIcons = (
    <AvailableCustomizationsIcons
      hasSpatialSubsetting={hasSpatialSubsetting}
      hasVariables={hasVariables}
      hasTransforms={hasTransforms}
      hasFormats={hasFormats}
      hasTemporalSubsetting={hasTemporalSubsetting}
      hasCombine={hasCombine}
    />
  )

  const availableCustomizationsTooltipIcons = (
    <AvailableCustomizationsTooltipIcons
      hasSpatialSubsetting={hasSpatialSubsetting}
      hasVariables={hasVariables}
      hasTransforms={hasTransforms}
      hasFormats={hasFormats}
      hasTemporalSubsetting={hasTemporalSubsetting}
      hasCombine={hasCombine}
    />
  )

  return (
    <label
      className={labelClassName}
      htmlFor={id}
      data-testid={id}
    >
      <input
        className="access-method-radio__input"
        id={id}
        type="radio"
        name={id}
        value={value}
        checked={checked ? 'checked' : ''}
        onChange={onChange}
        onClick={onClick}
        disabled={disabled}
      />
      <div className="access-method-radio__radio">
        { checked && <EDSCIcon icon={Check} className="access-method-radio__radio-icon" /> }
      </div>
      <div className="access-method-radio__content">
        <header className="access-method-radio__header">
          <div className="access-method-radio__header-primary">
            <span className="access-method-radio__primary-titles">
              <h4 className="access-method-radio__title">
                {title}
              </h4>
              <span className="access-method-radio__subtitle">
                {subtitle}
              </span>
            </span>
            {
              customizationOptions && (
                <MetaIcon
                  id="feature-icon-list-view__customize"
                  icon={Settings}
                  label="Customize"
                  tooltipClassName="text-align-left"
                  tooltipContent={availableCustomizationsTooltipIcons}
                  metadata={availableCustomizationsIcons}
                />
              )
            }
          </div>
          <div className="access-method-radio__header-content">
            <span className="access-method-radio__description">
              {description}
            </span>
            {
              errorMessage && (
                <div className="access-method-radio__error">
                  {errorMessage}
                </div>
              )
            }
          </div>
        </header>
        {
          details && (
            <OverlayTrigger
              show={showTooltip}
              placement="top"
              onToggle={
                (state) => {
                  setShowTooltip(state)
                }
              }
              overlay={
                (
                  <Tooltip
                    className="tooltip--ta-left"
                    onMouseEnter={() => externalLink && setShowTooltip(true)}
                    onMouseLeave={() => externalLink && setShowTooltip(false)}
                  >
                    <div className="access-method-radio__tooltip">
                      <p className="mb-0">
                        {details}
                      </p>
                      {
                        externalLink && (
                          <ExternalLink href={externalLink.link} className="d-inline-block mt-3 mb-1" variant="light">
                            {externalLink.message}
                          </ExternalLink>
                        )
                      }
                    </div>
                  </Tooltip>
                )
              }
            >
              <EDSCIcon icon={FaQuestionCircle} size="16px" variant="more-info" />
            </OverlayTrigger>
          )
        }
      </div>
    </label>
  )
}

AccessMethodRadio.defaultProps = {
  checked: null,
  details: null,
  onChange: null,
  onClick: null,
  subtitle: null,
  customizationOptions: null,
  isHarmony: false,
  disabled: false,
  errorMessage: null,
  externalLink: null
}

AccessMethodRadio.propTypes = {
  checked: PropTypes.bool,
  description: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]).isRequired,
  details: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]),
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  customizationOptions: PropTypes.shape({
    hasTemporalSubsetting: PropTypes.bool,
    hasVariables: PropTypes.bool,
    hasTransforms: PropTypes.bool,
    hasCombine: PropTypes.bool,
    hasSpatialSubsetting: PropTypes.bool,
    hasFormats: PropTypes.bool,
    hasTransform: PropTypes.bool
  }),
  isHarmony: PropTypes.bool,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  externalLink: PropTypes.shape({
    link: PropTypes.string,
    message: PropTypes.string
  })
}

export default AccessMethodRadio
