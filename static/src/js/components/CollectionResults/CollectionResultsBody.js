import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import queryString from 'query-string'
import {
  Link,
  withRouter
} from 'react-router-dom'

import actions from '../../actions'

const mapStateToProps = state => ({
  collections: state.entities.collections
})

const mapDispatchToProps = dispatch => ({
  onFocusedCollectionChange:
    collectionId => dispatch(actions.changeFocusedCollection(collectionId))
})

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
      location
    } = this.props

    const collectionResults = collections.allIds.map((id) => {
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

      return (
        <li className="collection-results__item" key={collection.id}>
          <div className="collection-results__item-thumb">
            {/* eslint-disable-next-line max-len */}
            <img src="https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/datasets/C179003620-ORNL_DAAC?h=75&w=75" alt="Thumbnail" />
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
                <strong>{`${collection.granule_count} Granules`}</strong>
                <strong> &bull; </strong>
                <strong>{timeRange}</strong>
                <strong> &bull; </strong>
                <span>{collection.summary}</span>
              </p>
            </div>
            <div className="collection-results__item-body-secondary">
              <p>
                <span className="badge collection-results__item-attribution">
                  {`${collection.short_name} v${collection.version_id} -
                  ${displayOrganization}`
                  }
                </span>
              </p>
            </div>
          </div>
        </li>
      )
    })

    return (
      <ul className="collection-results__list">
        {!collections.isLoading ? collectionResults : 'Loading...'}
      </ul>
    )
  }
}

CollectionResultsBody.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionResultsBody)
)
