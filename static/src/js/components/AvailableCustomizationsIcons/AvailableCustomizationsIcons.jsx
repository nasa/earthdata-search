import React from 'react'
import PropTypes from 'prop-types'

import { FileGeneric, Filter } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import {
  FaClock,
  FaCubes,
  FaGlobe,
  FaTags
} from 'react-icons/fa'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './AvailableCustomizationsIcons.scss'

/**
 * Renders icons indicating customization options for access methods.
 * @param {boolean} hasSpatialSubsetting
 * @param {boolean} hasVariables
 * @param {boolean} hasTransforms
 * @param {boolean} hasFormats
 * @param {boolean} hasTemporalSubsetting
 * @param {boolean} hasCombine
 */
export const AvailableCustomizationsIcons = ({
  hasSpatialSubsetting,
  hasVariables,
  hasTransforms,
  hasFormats,
  hasTemporalSubsetting,
  hasCombine
}) => (
  hasSpatialSubsetting
      || hasVariables
      || hasTransforms
      || hasFormats
      || hasTemporalSubsetting
      || hasCombine
) && (
  <>
    {
      hasSpatialSubsetting && (
        <EDSCIcon
          className="available-customizations-icons__icon"
          title="A white globe icon"
          icon={FaGlobe}
          size="0.675rem"
          inlineFlex={false}
        />
      )
    }
    {
      hasTemporalSubsetting && (
        <EDSCIcon
          className="available-customizations-icons__icon"
          title="A white clock icon"
          icon={FaClock}
          size="0.675rem"
          inlineFlex={false}
        />
      )
    }
    {
      hasVariables && (
        <EDSCIcon
          className="available-customizations-icons__icon"
          title="A white tags icon"
          icon={FaTags}
          size="0.675rem"
          inlineFlex={false}
        />
      )
    }
    {
      hasTransforms && (
        <EDSCIcon
          className="available-customizations-icons__icon"
          title="A white horizontal sliders icon"
          icon={Filter}
          size="0.675rem"
          inlineFlex={false}
        />
      )
    }
    {
      hasFormats && (
        <EDSCIcon
          className="available-customizations-icons__icon"
          title="A white file icon"
          icon={FileGeneric}
          size="0.675rem"
          inlineFlex={false}
        />
      )
    }
    {
      hasCombine && (
        <EDSCIcon
          className="available-customizations-icons__icon"
          title="A white cubes icon"
          icon={FaCubes}
          size="0.675rem"
          inlineFlex={false}
        />
      )
    }
  </>
)

AvailableCustomizationsIcons.defaultProps = {
  hasSpatialSubsetting: false,
  hasVariables: false,
  hasTransforms: false,
  hasFormats: false,
  hasTemporalSubsetting: false,
  hasCombine: false
}

AvailableCustomizationsIcons.propTypes = {
  hasSpatialSubsetting: PropTypes.bool,
  hasVariables: PropTypes.bool,
  hasTransforms: PropTypes.bool,
  hasFormats: PropTypes.bool,
  hasTemporalSubsetting: PropTypes.bool,
  hasCombine: PropTypes.bool
}

export default AvailableCustomizationsIcons
