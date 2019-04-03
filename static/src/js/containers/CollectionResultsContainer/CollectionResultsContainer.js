import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Link,
  withRouter
} from 'react-router-dom'
import queryString from 'query-string'
import $ from 'jquery'
import _ from 'lodash'

import actions from '../../actions/index'

import './CollectionResultsContainer.scss'

const mapDispatchToProps = dispatch => ({
  onFocusedCollectionChange: collectionId => dispatch(actions.changeFocusedCollection(collectionId)),
  onMasterOverlayHeightChange: newHeight => dispatch(actions.masterOverlayPanelResize(newHeight)),
  onMasterOverlayPanelDragStart: data => dispatch(actions.masterOverlayPanelDragStart(data)),
  onMasterOverlayPanelDragEnd: () => dispatch(actions.masterOverlayPanelDragEnd())
})

const mapStateToProps = state => ({
  collections: state.entities.collections,
  masterOverlayPanel: state.ui.masterOverlayPanel
})

class CollectionResultsContainer extends Component {
  constructor(props) {
    super(props)
    this.handleClickCollection = this.handleClickCollection.bind(this)
    this.onMasterOverlayHeightChange = props.onMasterOverlayHeightChange.bind(this)
    this.onMasterOverlayPanelDragStart = props.onMasterOverlayPanelDragStart.bind(this)
    this.onMasterOverlayPanelDragEnd = props.onMasterOverlayPanelDragEnd.bind(this)
    this.onMouseMove = _.throttle(this.onMouseMove.bind(this), 16)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
  }

  onMouseDown(e) {
    const {
      masterOverlayPanel,
      onMasterOverlayPanelDragStart
    } = this.props

    if (e.button !== 0) return

    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)

    onMasterOverlayPanelDragStart({
      clickStartY: e.pageY,
      clickStartHeight: masterOverlayPanel.height
    })

    e.stopPropagation()
    e.preventDefault()
  }

  onMouseUp(e) {
    const {
      masterOverlayPanel,
      onMasterOverlayPanelDragEnd,
      onMasterOverlayHeightChange
    } = this.props

    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    if ($(this.node).offset().top < 105) {
      onMasterOverlayHeightChange(masterOverlayPanel.height - 50)
    }

    onMasterOverlayPanelDragEnd()
    e.stopPropagation()
    e.preventDefault()
  }

  onMouseMove(e) {
    const {
      masterOverlayPanel,
      onMasterOverlayHeightChange
    } = this.props

    if (!masterOverlayPanel.dragging) return

    // This can be improved but will work for now. It currently will let the user scroll past the max height,
    // but we can just reset it when the onMouseUp fires.
    if ($(this.node).offset().top < 105) return

    const distanceScrolled = masterOverlayPanel.clickStartY - e.pageY

    onMasterOverlayHeightChange(distanceScrolled + masterOverlayPanel.clickStartHeight)
    e.stopPropagation()
    e.preventDefault()
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
                  onClick={() => this.handleClickCollection(collection.id)}
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
              <form className="form-inline mb-1" action="/">
                <div className="form-row align-items-center">
                  <div className="col-auto">
                    <div className="form-group">
                      <label
                        className="mr-1"
                        htmlFor="input__sort-relevance"
                      >
                        Sort by:
                      </label>
                      <select
                        id="input__sort-relevance"
                        className="form-control"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="usage">Usage</option>
                        <option value="end_data">End Date</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="form-group">
                      <div className="form-check">
                        <input
                          id="input__only-granules"
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked
                        />
                        <label
                          className="form-check-label"
                          htmlFor="input__only-granules"
                        >
                           Only include collections with granules
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="form-group">
                      <div className="form-check">
                        <input
                          id="input__non-eosdis"
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked
                        />
                        <label
                          className="form-check-label"
                          htmlFor="input__non-eosdis"
                        >
                          Include non-EOSDIS collections
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
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
            <span
              className="coll-res__tab-handle"
              role="button"
              tabIndex="0"
              ref={(node) => {
                this.node = node
              }}
              onMouseDown={this.onMouseDown}
            />
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

CollectionResultsContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  masterOverlayPanel: PropTypes.shape({}).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onMasterOverlayHeightChange: PropTypes.func.isRequired,
  onMasterOverlayPanelDragStart: PropTypes.func.isRequired,
  onMasterOverlayPanelDragEnd: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionResultsContainer)
)
