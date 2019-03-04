import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Link,
  withRouter
} from 'react-router-dom'
import queryString from 'query-string'

import './CollectionResults.scss'

const mapStateToProps = state => ({
  collections: state.entities.collections
})

class CollectionResults extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {
      collections,
      location
    } = this.props

    const collectionHits = collections.hits

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
        <li className="coll-res__item" key={collection.id}>
          <div className="coll-res__item-thumb">
            <img src="https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/datasets/C179003620-ORNL_DAAC?h=75&w=75" alt="Thumbnail" />
          </div>
          <div className="coll-res__item-body">
            <div className="coll-res__item-body-primary">
              <h3 className="coll-res__item-title">
                <Link
                  className="coll-res__item-title-link"
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
              <p className="coll-res__item-desc">
                <strong>{`${collection.granule_count} Granules`}</strong>
                <strong> &bull; </strong>
                <strong>{timeRange}</strong>
                <strong> &bull; </strong>
                <span>{collection.summary}</span>
              </p>
            </div>
            <div className="coll-res__item-body-secondary">
              <p>
                <span className="badge coll-res__item-attribution">
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
      <section className="coll-res inner-panel">
        <header className="container-fluid p-3 coll-res__header">
          <div className="row">
            <div className="col">
              <form action="/">
                <span>
                  Sort by:
                  <select id="input__sort-relevance">
                    <option value="">Relevance</option>
                    <option value="">Usage</option>
                    <option value="">End Date</option>
                  </select>
                </span>
                <label
                  className="m-0"
                  htmlFor="input__only-granules"
                >
                  <input
                    id="input__only-granules"
                    type="checkbox"
                    defaultChecked
                  />
                   Only include collections with granules
                </label>
                <label
                  className="m-0"
                  htmlFor="input__non-eosdis"
                >
                  <input
                    id="input__non-eosdis"
                    type="checkbox"
                    defaultChecked
                  />
                   Only include collections with granules
                </label>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <span>
                <strong>Tip:</strong>
                 Add
                <i className="fa fa-plus" />
                 collections to your project to compare and download their data.
                <a href="/">
                  <i className="fa fa-question-circle" />
                    Learn More
                </a>
              </span>
            </div>
          </div>
          <span className="coll-res__tab">
            <h2 className="coll-res__tab-heading">
              {`${collectionHits} Matching Collections`}
            </h2>
          </span>
        </header>
        <ul className="coll-res__list">
          { !collections.isLoading ? collectionResults : 'Loading...' }
        </ul>
      </section>
    )
  }
}

CollectionResults.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(CollectionResults)
)
