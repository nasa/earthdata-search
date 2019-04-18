import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FacetsList from './FacetsList'

import './FacetsGroup.scss'

class FacetsGroup extends Component {
  constructor(props) {
    super(props)

    const {
      facet,
      facetOptions
    } = props

    this.state = {
      isOpen: facet.applied || facetOptions.isOpen
    }

    this.onToggle = this.onToggle.bind(this)
  }

  onToggle() {
    this.setState(state => ({ isOpen: !state.isOpen }))
  }

  render() {
    const {
      facet,
      facetCategory,
      facetOptions
    } = this.props

    const { isOpen } = this.state

    return (
      <li className="facets-group" key={facet.title}>
        <h3 className="facets-group__heading">
          <button
            className="btn btn-block facets-group__button"
            type="button"
            onClick={this.onToggle}
          >
            <span className="facets-group__title">{facet.title}</span>
            <div className="facets-group__action">
              {
                !isOpen
                  ? (
                    <i className="fa fa-chevron-left">
                      <span className="visually-hidden">Open</span>
                    </i>
                  ) : (
                    <i className="fa fa-chevron-down">
                      <span className="visually-hidden">Close</span>
                    </i>
                  )
              }
            </div>
          </button>
        </h3>
        <section className={`facets-group__body
          ${isOpen ? ' facets-group__body--is-open' : ''}`}
        >
          { facet.totalSelected
            ? (
              <header>
                <span className="facets-group__selected">{`${facet.totalSelected} Selected`}</span>
              </header>
            )
            : null
          }
          <FacetsList
            changeHandler={facet.changeHandler}
            facets={facet.children}
            facetCategory={facetCategory}
            liftSelectedFacets={facetOptions.liftSelectedFacets}
          />
        </section>
      </li>
    )
  }
}

FacetsGroup.defaultProps = {
  facetOptions: {}
}

FacetsGroup.propTypes = {
  facet: PropTypes.shape({}).isRequired,
  facetCategory: PropTypes.string.isRequired,
  facetOptions: PropTypes.shape({})
}

export default FacetsGroup
