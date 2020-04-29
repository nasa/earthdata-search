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
    this.onViewAllClick = this.onViewAllClick.bind(this)
  }

  onToggle() {
    this.setState(state => ({ isOpen: !state.isOpen }))
  }

  onViewAllClick() {
    const {
      facet,
      onTriggerViewAllFacets
    } = this.props
    onTriggerViewAllFacets(facet.title)
  }

  renderHeaderInfo() {
    const { facet } = this.props

    if (!(facet.totalSelected > 0 || facet.children.length > 49)) return null

    return (
      <>
        {
          facet.totalSelected > 0 && (
            <span className="facets-group__meta">{`${facet.totalSelected} Selected`}</span>
          )
        }
        {
          (facet.totalSelected === 0 && facet.children.length > 49) && (
            <span className="facets-group__meta">Showing Top 50</span>
          )
        }
        {
          facet.children.length > 49 && (
            <button className="facets-group__view-all" type="button" onClick={this.onViewAllClick}>View All</button>
          )
        }
      </>
    )
  }

  render() {
    const {
      facet,
      facetCategory,
      facetOptions
    } = this.props
    const {
      autocompleteType,
      changeHandler,
      children,
      title
    } = facet

    const { isOpen } = this.state

    const headerInfo = this.renderHeaderInfo()

    return (
      <li className="facets-group" key={title}>
        <h3 className="facets-group__heading">
          <button
            className="btn btn-block facets-group__button"
            type="button"
            onClick={this.onToggle}
          >
            <span className="facets-group__title">
              {title}
            </span>
            <div className="facets-group__action">
              {
                !isOpen
                  ? (
                    <i className="fa fa-chevron-down">
                      <span className="visually-hidden">Open</span>
                    </i>
                  ) : (
                    <i className="fa fa-chevron-up">
                      <span className="visually-hidden">Close</span>
                    </i>
                  )
              }
            </div>
          </button>
        </h3>
        {
          isOpen && (
            <section className="facets-group__body">
              {headerInfo && (
                <header className="facets-group__header">
                  {headerInfo}
                </header>
              )}
              <FacetsList
                autocompleteType={autocompleteType}
                changeHandler={changeHandler}
                facets={children}
                facetCategory={facetCategory}
                liftSelectedFacets={facetOptions.liftSelectedFacets}
              />
            </section>
          )
        }
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
  facetOptions: PropTypes.shape({}),
  onTriggerViewAllFacets: PropTypes.func.isRequired
}

export default FacetsGroup
