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
import './AvailableCustomizationsTooltipIcons.scss'

/**
 * Renders tool-tip-icons indicating customization options for access methods.
 * @param {boolean} hasSpatialSubsetting
 * @param {boolean} hasVariables
 * @param {boolean} hasTransforms
 * @param {boolean} hasFormats
 * @param {boolean} hasTemporalSubsetting
 * @param {boolean} hasCombine
 */
export const AvailableCustomizationsTooltipIcons = ({
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
    <div>
      Supports customization:
    </div>
    <ul className="available-customizations-tooltip-icons__tooltip-feature-list">
      {
        hasSpatialSubsetting && (
          <li>
            <EDSCIcon
              className="available-customizations-tooltip-icons__tooltip-feature-icon"
              title="A white globe icon"
              size="0.725rem"
              icon={FaGlobe}
              inlineFlex={false}
            />
            Spatial subset
          </li>
        )
      }
      {
        hasTemporalSubsetting && (
          <li>
            <EDSCIcon
              className="available-customizations-tooltip-icons__tooltip-feature-icon"
              title="A white clock icon"
              size="0.725rem"
              icon={FaClock}
              inlineFlex={false}
            />
            Temporal subset
          </li>
        )
      }
      {
        hasVariables && (
          <li>
            <EDSCIcon
              className="available-customizations-tooltip-icons__tooltip-feature-icon"
              title="A white tags icon"
              size="0.725rem"
              icon={FaTags}
              inlineFlex={false}
            />
            Variable subset
          </li>
        )
      }
      {
        hasTransforms && (
          <li>
            <EDSCIcon
              className="available-customizations-tooltip-icons__tooltip-feature-icon"
              title="A white horizontal sliders icon"
              size="0.725rem"
              icon={Filter}
              inlineFlex={false}
            />
            Transform
          </li>
        )
      }
      {
        hasFormats && (
          <li>
            <EDSCIcon
              className="available-customizations-tooltip-icons__tooltip-feature-icon"
              title="A white file icon"
              size="0.725rem"
              icon={FileGeneric}
              inlineFlex={false}
            />
            Reformat
          </li>
        )
      }
      {
        hasCombine && (
          <li>
            <EDSCIcon
              className="available-customizations-tooltip-icons__tooltip-feature-icon"
              title="A white cubes icon"
              size="0.725rem"
              icon={FaCubes}
              inlineFlex={false}
            />
            Combine
          </li>
        )
      }
    </ul>
  </>
)

AvailableCustomizationsTooltipIcons.defaultProps = {
  hasSpatialSubsetting: false,
  hasVariables: false,
  hasTransforms: false,
  hasFormats: false,
  hasTemporalSubsetting: false,
  hasCombine: false
}

AvailableCustomizationsTooltipIcons.propTypes = {
  hasSpatialSubsetting: PropTypes.bool,
  hasVariables: PropTypes.bool,
  hasTransforms: PropTypes.bool,
  hasFormats: PropTypes.bool,
  hasTemporalSubsetting: PropTypes.bool,
  hasCombine: PropTypes.bool
}

export default AvailableCustomizationsTooltipIcons
