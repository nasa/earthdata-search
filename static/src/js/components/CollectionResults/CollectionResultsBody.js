import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Waypoint } from 'react-waypoint'

import { getConfig } from '../../../../../sharedUtils/config'

/**
 * Renders CollectionResultsBody.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collections - Collections passed from redux store.
 * @param {object} props.location - Locations passed from react router.
 * @param {function} props.onFocusedCollectionChange - Fired when a new collection is focused.
 */
class CollectionResultsBody extends PureComponent {
  constructor(props) {
    super(props)
    this.handleClickCollection = this.handleClickCollection.bind(this)
  }

  handleClickCollection = (collectionId) => {
    const { onFocusedCollectionChange } = this.props
    onFocusedCollectionChange(collectionId)
  }

  render() {
    const {
      collections,
      location,
      waypointEnter
    } = this.props

    const collectionIds = collections.allIds

    const collectionResults = collectionIds.map((id, index) => {
      const collection = collections.byId[id]

      let displayOrganization = ''

      // This should be moved into a some sort of normalization of the collections response
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

      const isLast = collectionIds.length > 0 && index === collectionIds.length - 1

      return (
        <li className="collection-results__item" key={collection.id}>
          <div className="collection-results__item-thumb">
            {/* eslint-disable-next-line max-len */}
            <img src={`${getConfig('prod').cmrHost}/browse-scaler/browse_images/datasets/C179003620-ORNL_DAAC?h=75&w=75`} alt="Thumbnail" />
          </div>
          <div className="collection-results__item-body">
            <div className="collection-results__item-body-primary">
              <h3 className="collection-results__item-title">
                <Link
                  onClick={() => this.handleClickCollection(collection.id)}
                  className="collection-results__item-title-link"
                  to={{
                    pathname: '/search/granules',
                    search: queryString
                      .stringify(
                        Object.assign(
                          {},
                          queryString.parse(location.search),
                          { p: collection.id }
                        )
                      )
                  }}
                >
                  {collection.dataset_id}
                </Link>
              </h3>
              <p className="collection-results__item-desc">
                {
                  collection.is_cwic && (
                    <strong>Int&apos;l / Interagency</strong>
                  )
                }
                {
                  !collection.is_cwic && (
                    <strong>{`${collection.granule_count} Granules`}</strong>
                  )
                }
                <strong> &bull; </strong>
                <strong>{timeRange}</strong>
                <strong> &bull; </strong>
                <span>{collection.summary}</span>
              </p>
            </div>
            <div className="collection-results__item-body-secondary">
              <p>
                {
                  collection.is_cwic && (
                    <OverlayTrigger
                      placement="top"
                      overlay={(
                        <Tooltip id="tooltip__quic-badge" className="collection-results__item-badge-tooltip">Int&apos;l / Interagency Data</Tooltip>
                      )}
                    >
                      <span className="badge collection-results__item-badge collection-results__item-badge--cwic">CWIC</span>
                    </OverlayTrigger>
                  )
                }
                {
                  collection.short_name && (
                    <span className="badge collection-results__item-badge collection-results__item-badge--attribution">
                      {
                        `${collection.short_name}
                        v${collection.version_id} -
                        ${displayOrganization}`
                      }
                    </span>
                  )
                }
              </p>
            </div>
          </div>
          {
            isLast && (
              <Waypoint
                bottomOffset="-400px"
                onEnter={waypointEnter}
              />
            )
          }
        </li>
      )
    })

    return (
      <ul className="collection-results__list">
        {collectionResults}
        {collections.isLoading && (
          <li>
            Loading...
          </li>
        )}
      </ul>
    )
  }
}

CollectionResultsBody.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  waypointEnter: PropTypes.func.isRequired
}

export default CollectionResultsBody
