import React from 'react'
import PropTypes from 'prop-types'
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Waypoint } from 'react-waypoint'

import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'
import { getApplicationConfig } from '../../../../../sharedUtils/config'

import Button from '../Button/Button'
import SplitBadge from '../SplitBadge/SplitBadge'

import './CollectionResultsItem.scss'

export const CollectionResultsItem = ({
  collection,
  onAddProjectCollection,
  onRemoveCollectionFromProject,
  onViewCollectionDetails,
  onViewCollectionGranules,
  waypointEnter,
  scrollContainer
}) => {
  const {
    collectionId,
    datasetId,
    description,
    displayOrganization,
    granuleCount,
    hasFormats,
    hasSpatialSubsetting,
    hasTemporalSubsetting,
    hasTransforms,
    hasVariables,
    hasMapImagery,
    isCwic,
    isNrt,
    temporalRange,
    thumbnail,
    isLast,
    isCollectionInProject
  } = collection

  const thumbnailHeight = getApplicationConfig().thumbnailSize.height
  const thumbnailWidth = getApplicationConfig().thumbnailSize.width

  const customizeBadges = []

  if (hasSpatialSubsetting) {
    customizeBadges.push((
      <OverlayTrigger
        key="badge-icon__spatial-subsetting"
        placement="top"
        overlay={(
          <Tooltip
            id="tooltip_customize-spatial-subsetting"
            className="collection-results-item__badge-tooltip collection-results-item__badge-tooltip--icon"
          >
            Spatial customizable options available
          </Tooltip>
        )}
      >
        <i className="fa fa-globe collection-results-item__badge-icon" />
      </OverlayTrigger>
    ))
  }

  if (hasVariables) {
    customizeBadges.push((
      <OverlayTrigger
        key="badge-icon__variables"
        placement="top"
        overlay={(
          <Tooltip
            id="tooltip_customize-variables"
            className="collection-results-item__badge-tooltip collection-results-item__badge-tooltip--icon"
          >
            Variable customizable options available
          </Tooltip>
        )}
      >
        <i className="fa fa-tags collection-results-item__badge-icon" />
      </OverlayTrigger>
    ))
  }

  if (hasTransforms) {
    customizeBadges.push((
      <OverlayTrigger
        key="badge-icon__transforms"
        placement="top"
        overlay={(
          <Tooltip
            id="tooltip_customize-transforms"
            className="collection-results-item__badge-tooltip collection-results-item__badge-tooltip--icon"
          >
            Data transformation options available
          </Tooltip>
        )}
      >
        <i className="fa fa-sliders collection-results-item__badge-icon" />
      </OverlayTrigger>
    ))
  }

  if (hasFormats) {
    customizeBadges.push((
      <OverlayTrigger
        key="badge-icon__formats"
        placement="top"
        overlay={(
          <Tooltip
            id="tooltip_customize-formats"
            className="collection-results-item__badge-tooltip collection-results-item__badge-tooltip--icon"
          >
            Reformatting options available
          </Tooltip>
        )}
      >
        <i className="fa fa-file-text-o collection-results-item__badge-icon" />
      </OverlayTrigger>
    ))
  }

  if (hasTemporalSubsetting) {
    customizeBadges.push((
      <OverlayTrigger
        key="badge-icon__temporal-subsetting"
        placement="top"
        overlay={(
          <Tooltip
            id="tooltip_customize-temporal-subsetting"
            className="collection-results-item__badge-tooltip collection-results-item__badge-tooltip--icon"
          >
            Temporal subsetting options available
          </Tooltip>
        )}
      >
        <i className="fa fa-clock-o collection-results-item__badge-icon" />
      </OverlayTrigger>
    ))
  }

  const addToProjectButton = (
    <Button
      className="collection-results-item__action collection-results-item__action--add"
      onClick={(e) => {
        onAddProjectCollection(collectionId)
        e.stopPropagation()
      }}
      variant="light"
      bootstrapVariant="light"
      icon="plus"
      label="Add collection to the current project"
      title="Add collection to the current project"
    />
  )

  const removeFromProjectButton = (
    <Button
      className="collection-results-item__action collection-results-item__action--remove"
      onClick={(e) => {
        onRemoveCollectionFromProject(collectionId)
        e.stopPropagation()
      }}
      variant="light"
      bootstrapVariant="light"
      icon="minus"
      label="Remove collection from the current project"
      title="Remove collection from the current project"
    />
  )

  return (
    <li className="collection-results-item" key={collectionId}>
      <div
        role="button"
        tabIndex="0"
        className="collection-results-item__link"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onViewCollectionGranules(collectionId)
          }
          e.stopPropagation()
        }}
        onClick={(e) => {
          onViewCollectionGranules(collectionId)
          e.stopPropagation()
        }}
        data-test-id="collection-result-item"
      >
        <div className="collection-results-item__thumb">
          {
            thumbnail && (
              <img
                className="collection-results-item__thumb-image"
                src={thumbnail}
                alt={`Thumbnail for ${datasetId}`}
                height={thumbnailHeight}
                width={thumbnailWidth}
              />
            )
          }
        </div>
        <div className="collection-results-item__body">
          <div className="collection-results-item__body-primary">
            <div className="collection-results-item__info">
              <h3 className="collection-results-item__title">
                {datasetId}
              </h3>
              <p className="collection-results-item__desc">
                {
                  isCwic && (
                    <strong>Int&apos;l / Interagency</strong>
                  )
                }
                {
                  !isCwic && (
                    <strong>{`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}</strong>
                  )
                }
                <strong> &bull; </strong>
                <strong>{temporalRange}</strong>
                <strong> &bull; </strong>
                {description}
              </p>
            </div>
            <div className="collection-results-item__actions">
              <Button
                className="collection-results-item__action collection-results-item__action--collection-details"
                onClick={(e) => {
                  onViewCollectionDetails(collectionId)
                  e.stopPropagation()
                }}
                label="View collection details"
                title="View collection details"
                bootstrapVariant="light"
                icon="info-circle"
              />
              {
                isCollectionInProject && removeFromProjectButton
              }
              {
                !isCollectionInProject && addToProjectButton
              }
            </div>
          </div>
          <div className="collection-results-item__body-secondary">
            {
              isCwic && (
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip
                      id="tooltip__quic-badge"
                      className="collection-results-item__badge-tooltip"
                    >
                      Int&apos;l / Interagency Data
                    </Tooltip>
                  )}
                >
                  <Badge
                    className="collection-results-item__badge collection-results-item__badge--cwic"
                  >
                    CWIC
                  </Badge>
                </OverlayTrigger>
              )
            }
            {
              hasMapImagery && (
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip
                      id="tooltip__map-imagery-badge"
                      className="collection-results-item__badge-tooltip"
                    >
                      Supports advanced map visualizations using the GIBS tile service
                    </Tooltip>
                  )}
                >
                  <Badge
                    className="collection-results-item__badge collection-results-item__badge--map-imagery"
                  >
                    Map Imagery
                  </Badge>
                </OverlayTrigger>
              )
            }
            {
              customizeBadges.length > 0 && (
                <SplitBadge
                  className="collection-results-item__badge  collection-results-item__badge--customizable"
                  primary="Customizable"
                  secondary={customizeBadges}
                />
              )
            }
            {
              isNrt && (
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip
                      id="tooltip__near-real-time-badge"
                      className="collection-results-item__badge-tooltip"
                    >
                      Near Real Time (NRT) Data
                    </Tooltip>
                  )}
                >
                  <Badge
                    className="collection-results-item__badge collection-results-item__badge--near-real-time"
                  >
                    NRT
                  </Badge>
                </OverlayTrigger>
              )
            }
            {
              (
                collection.short_name
                && collection.version_id
                && displayOrganization
              ) && (
                <Badge
                  className="badge collection-results-item__badge collection-results-item__badge--attribution"
                >
                  {
                    `${collection.short_name} v${collection.version_id} - ${displayOrganization}`
                  }
                </Badge>
              )
            }
          </div>
        </div>
        {
          isLast && (
            <Waypoint
              bottomOffset="-200px"
              onEnter={waypointEnter}
              scrollableAncestor={scrollContainer || window}
            />
          )
        }
      </div>
    </li>
  )
}

CollectionResultsItem.defaultProps = {
  scrollContainer: null
}

CollectionResultsItem.propTypes = {
  collection: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  waypointEnter: PropTypes.func.isRequired,
  scrollContainer: PropTypes.instanceOf(Element)
}

export default CollectionResultsItem
