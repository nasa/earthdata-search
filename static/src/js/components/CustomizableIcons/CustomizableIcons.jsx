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

import './CustomizableIcons.scss'

/**
 * Renders icons indicating customization options for access methods.
 * Used by CollectionResultsItem and AccessMethodRadio.
 * @param {boolean} hasSpatialSubsetting
 * @param {boolean} hasVariables
 * @param {boolean} hasTransforms
 * @param {boolean} hasFormats
 * @param {boolean} hasTemporalSubsetting
 * @param {boolean} hasCombine
 * @param {boolean} forAccessMethodRadio - indicates usage for AccessMethodRadio
 */
export const CustomizableIcons = ({
  hasSpatialSubsetting,
  hasVariables,
  hasTransforms,
  hasFormats,
  hasTemporalSubsetting,
  hasCombine,
  iconClassname
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
          className="customizable-icons__icon"
          title="A white globe icon"
          icon={FaGlobe}
          size="0.675rem"
        />
      )
    }
    {
      hasTemporalSubsetting && (
        <EDSCIcon
          className="customizable-icons__icon"
          title="A white clock icon"
          icon={FaClock}
          size="0.675rem"
        />
      )
    }
    {
      hasVariables && (
        <EDSCIcon
          className="customizable-icons__icon"
          title="A white tags icon"
          icon={FaTags}
          size="0.675rem"
        />
      )
    }
    {
      hasTransforms && (
        <EDSCIcon
          className="customizable-icons__icon"
          title="A white horizontal sliders icon"
          icon={Filter}
          size="0.675rem"
        />
      )
    }
    {
      hasFormats && (
        <EDSCIcon
          className="customizable-icons__icon"
          title="A white file icon"
          icon={FileGeneric}
          size="0.675rem"
        />
      )
    }
    {
      hasCombine && (
        <EDSCIcon
          className="customizable-icons__icon"
          title="A white cubes icon"
          icon={FaCubes}
          size="0.675rem"
        />
      )
    }
  </>
)

CustomizableIcons.defaultProps = {
  hasSpatialSubsetting: false,
  hasVariables: false,
  hasTransforms: false,
  hasFormats: false,
  hasTemporalSubsetting: false,
  hasCombine: false
}

CustomizableIcons.propTypes = {
  hasSpatialSubsetting: PropTypes.bool,
  hasVariables: PropTypes.bool,
  hasTransforms: PropTypes.bool,
  hasFormats: PropTypes.bool,
  hasTemporalSubsetting: PropTypes.bool,
  hasCombine: PropTypes.bool
}

export default CustomizableIcons
