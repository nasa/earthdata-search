import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FacetsList from './FacetsList'

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
      <li className="facets__facet" key={facet.title}>
        <h3 className="facets__facet-heading">
          <button
            className="btn btn-block facets__facet-button"
            type="button"
            onClick={this.onToggle}
          >
            <span className="facets__facet-title">{facet.title}</span>
            <div className="facets__facet-action">
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
        <section className={`facets__facet-group
          ${isOpen ? ' facets__facet-group--is-open' : ''}`}
        >
          { facet.totalSelected
            ? (
              <header>
                <span className="facets__selected">{`${facet.totalSelected} Selected`}</span>
              </header>
            )
            : null
          }
          <FacetsList
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
