import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Check } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { FaQuestionCircle } from 'react-icons/fa'

import EDSCIcon from '../../EDSCIcon/EDSCIcon'
import ExternalLink from '../../ExternalLink/ExternalLink'
import CustomizableIcons from '../../CustomizableIcons/CustomizableIcons'

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
  console.log('🚀 ~ file: AccessMethodRadio.jsx:31 ~ externalLink:', externalLink)
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
  const overlayTriggers = ['hover', 'click']

  const labelClassName = classNames(labelClasses)

  /** Renders an external link for the access method.
    * @param {Object} externalLink - The external link optionally passed for the access method type
    * @param {Object} externalLink.link - The href and destination for the link
    * @param {Object} externalLink.message - The text of the link the user sees
  */
  const generateExternalLink = ({ link, message }) => (
    <ExternalLink href={link}>
      {message}
    </ExternalLink>
  )

  const {
    hasSpatialSubsetting = false,
    hasVariables = false,
    hasTransforms = false,
    hasFormats = false,
    hasTemporalSubsetting = false,
    hasCombine = false
  } = customizationOptions || {}

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
      {
        customizationOptions && (
          <CustomizableIcons
            hasSpatialSubsetting={hasSpatialSubsetting}
            hasVariables={hasVariables}
            hasTransforms={hasTransforms}
            hasFormats={hasFormats}
            hasTemporalSubsetting={hasTemporalSubsetting}
            hasCombine={hasCombine}
            forAccessMethodRadio
          />
        )
      }
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
              placement="top"
              delay={1000}
              overlay={
                (
                  <Tooltip>
                    <div className="access-method-radio__tool-tip">
                      {details}
                      <br />
                      {externalLink && generateExternalLink(externalLink)}
                    </div>
                  </Tooltip>
                )
              }
              trigger={overlayTriggers}
            >
              <EDSCIcon icon={FaQuestionCircle} size="16px" variant="details" />
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
