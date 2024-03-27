import React from 'react'
import PropTypes from 'prop-types'

import {
  FaClock,
  FaCogs,
  FaCubes,
  FaFileAlt,
  FaGlobe,
  FaSlidersH,
  FaTags
} from 'react-icons/fa'

import MetaIcon from '../MetaIcon/MetaIcon'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

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
  forAccessMethodRadio
}) => {
  let metaIconClasses = 'collection-results-item__meta-icon collection-results-item__meta-icon--customizable'
  if (forAccessMethodRadio) {
    metaIconClasses += ' meta-icon__accessMethod'
  }

  return (
    (
      hasSpatialSubsetting
      || hasVariables
      || hasTransforms
      || hasFormats
      || hasTemporalSubsetting
      || hasCombine
    ) && (
      <MetaIcon
        className={metaIconClasses}
        id="feature-icon-list-view__customize"
        icon={FaCogs}
        label="Customize"
        tooltipClassName="collection-results-item__tooltip text-align-left"
        metadata={
          (
            <>
              {
                hasSpatialSubsetting && (
                  <EDSCIcon
                    className="collection-results-item__icon svg fa-globe-svg"
                    title="A white globe icon"
                    icon={FaGlobe}
                    size="0.675rem"
                  />
                )
              }
              {
                hasTemporalSubsetting && (
                  <EDSCIcon
                    className="collection-results-item__icon svg fa-clock-svg"
                    title="A white clock icon"
                    icon={FaClock}
                    size="0.675rem"
                  />
                )
              }
              {
                hasVariables && (
                  <EDSCIcon
                    className="collection-results-item__icon svg fa-tags-svg"
                    title="A white tags icon"
                    icon={FaTags}
                    size="0.675rem"
                  />
                )
              }
              {
                hasTransforms && (
                  <EDSCIcon
                    className="collection-results-item__icon svg fa-sliders-svg"
                    title="A white horizontal sliders icon"
                    icon={FaSlidersH}
                    size="0.675rem"
                  />
                )
              }
              {
                hasFormats && (
                  <EDSCIcon
                    className="collection-results-item__icon svg fa-file-svg"
                    title="A white file icon"
                    icon={FaFileAlt}
                    size="0.675rem"
                  />
                )
              }
              {
                hasCombine && (
                  <EDSCIcon
                    className="collection-results-item__icon svg fa-file-svg"
                    title="A white cubes icon"
                    icon={FaCubes}
                    size="0.675rem"
                  />
                )
              }
            </>
          )
        }
        tooltipContent={
          (
            <>
              <div>
                Supports customization:
              </div>
              <ul className="collection-results-item__tooltip-feature-list">
                {
                  hasSpatialSubsetting && (
                    <li>
                      <EDSCIcon
                        className="collection-results-item__tooltip-feature-icon"
                        title="A white globe icon"
                        size="0.725rem"
                        icon={FaGlobe}
                      />
                      Spatial subset
                    </li>
                  )
                }
                {
                  hasTemporalSubsetting && (
                    <li>
                      <EDSCIcon
                        className="collection-results-item__tooltip-feature-icon"
                        title="A white clock icon"
                        size="0.725rem"
                        icon={FaClock}
                      />
                      Temporal subset
                    </li>
                  )
                }
                {
                  hasVariables && (
                    <li>
                      <EDSCIcon
                        className="collection-results-item__tooltip-feature-icon"
                        title="A white tags icon"
                        size="0.725rem"
                        icon={FaTags}
                      />
                      Variable subset
                    </li>
                  )
                }
                {
                  hasTransforms && (
                    <li>
                      <EDSCIcon
                        className="collection-results-item__tooltip-feature-icon"
                        title="A white horizontal sliders icon"
                        size="0.725rem"
                        icon={FaSlidersH}
                      />
                      Transform
                    </li>
                  )
                }
                {
                  hasFormats && (
                    <li>
                      <EDSCIcon
                        className="collection-results-item__tooltip-feature-icon"
                        title="A white file icon"
                        size="0.725rem"
                        icon={FaFileAlt}
                      />
                      Reformat
                    </li>
                  )
                }
                {
                  hasCombine && (
                    <li>
                      <EDSCIcon
                        className="collection-results-item__tooltip-feature-icon"
                        title="A white boxes icon"
                        size="0.725rem"
                        icon={FaCubes}
                      />
                      Combine
                    </li>
                  )
                }
              </ul>
            </>
          )
        }
      />
    )
  )
}

CustomizableIcons.defaultProps = {
  forAccessMethodRadio: false
}

CustomizableIcons.propTypes = {
  hasSpatialSubsetting: PropTypes.bool.isRequired,
  hasVariables: PropTypes.bool.isRequired,
  hasTransforms: PropTypes.bool.isRequired,
  hasFormats: PropTypes.bool.isRequired,
  hasTemporalSubsetting: PropTypes.bool.isRequired,
  hasCombine: PropTypes.bool.isRequired,
  forAccessMethodRadio: PropTypes.bool
}

export default CustomizableIcons
