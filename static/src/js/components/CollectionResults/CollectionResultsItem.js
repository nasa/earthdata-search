import React from 'react'
import PropTypes from 'prop-types'
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Waypoint } from 'react-waypoint'

import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'
import { getApplicationConfig } from '../../../../../sharedUtils/config'

import Button from '../Button/Button'

import './CollectionResultsItem.scss'

export const CollectionResultsListItem = ({
  collection,
  onViewCollectionGranules,
  onViewCollectionDetails,
  isLast,
  waypointEnter
}) => {
  let displayOrganization = ''

  if (collection.organizations && collection.organizations.length) {
    [displayOrganization] = collection.organizations
  }

  let timeRange = ''

  if (collection.time_start || collection.time_end) {
    if (collection.time_start && collection.time_end) {
      const dateStart = new Date(collection.time_start).toISOString().split('T')[0]
      const dateEnd = new Date(collection.time_end).toISOString().split('T')[0]

      timeRange = `${dateStart} to ${dateEnd}`
    }
    if (collection.time_start) {
      const dateStart = new Date(collection.time_start).toISOString().split('T')[0]

      timeRange = `${dateStart} ongoing`
    }
    if (collection.time_end) {
      const dateEnd = new Date(collection.time_end).toISOString().split('T')[0]

      timeRange = `Up to ${dateEnd}`
    }
  }

  const summary = collection.summary.length > 280 ? `${collection.summary.substring(0, 280)}...` : collection.summary
  const thumbnailHeight = getApplicationConfig().thumbnailSize.height
  const thumbnailWidth = getApplicationConfig().thumbnailSize.width

  return (
    <li className="collection-results-item" key={collection.id}>
      <div
        role="button"
        tabIndex="0"
        className="collection-results-item__link"
        onKeyPress={(e) => {
          onViewCollectionGranules(collection.id)
          e.stopPropagation()
        }}
        onClick={(e) => {
          onViewCollectionGranules(collection.id)
          e.stopPropagation()
        }}
      >
        <div className="collection-results-item__thumb">
          {/* eslint-disable-next-line max-len */}
          {
            collection.thumbnail && (
              <img
                className="collection-results-item__thumb-image"
                src={collection.thumbnail}
                alt={`Thumbnail for ${collection.dataset_id}`}
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
                {collection.dataset_id}
              </h3>
              <p className="collection-results-item__desc">
                {
                  collection.is_cwic && (
                    <strong>Int&apos;l / Interagency</strong>
                  )
                }
                {
                  !collection.is_cwic && (
                    <strong>{`${commafy(collection.granule_count)} ${pluralize('Granule', collection.granule_count)}`}</strong>
                  )
                }
                <strong> &bull; </strong>
                <strong>{timeRange}</strong>
                <strong> &bull; </strong>
                {summary}
              </p>
            </div>
            <div className="collection-results-item__actions">
              <Button
                className="collection-results-item__action"
                onClick={(e) => {
                  onViewCollectionDetails(collection.id)
                  e.stopPropagation()
                }}
                label="View collection details"
                title="View collection details"
                bootstrapVariant="light"
                icon="info-circle"
              />
            </div>
          </div>
          <div className="collection-results-item__body-secondary">
            {
              collection.is_cwic && (
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip id="tooltip__quic-badge" className="collection-results-item__badge-tooltip">Int&apos;l / Interagency Data</Tooltip>
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
              collection.has_map_imagery && (
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip id="tooltip__map-imagery-badge" className="collection-results-item__badge-tooltip">
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
              collection.is_nrt && (
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip id="tooltip__near-real-time-badge" className="collection-results-item__badge-tooltip">
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
              collection.short_name && (
                <Badge
                  className="badge collection-results-item__badge collection-results-item__badge--attribution"
                >
                  {
                    `${collection.short_name}
                        v${collection.version_id} -
                        ${displayOrganization}`
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
            />
          )
        }
      </div>
    </li>
  )
}

CollectionResultsListItem.propTypes = {
  collection: PropTypes.shape({}).isRequired,
  isLast: PropTypes.bool.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  waypointEnter: PropTypes.func.isRequired
}

export default CollectionResultsListItem
