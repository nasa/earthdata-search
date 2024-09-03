import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ArrowChevronDown,
  ArrowChevronUp
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { kebabCase } from 'lodash-es'

import FacetsList from './FacetsList'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './FacetsGroup.scss'

class FacetsGroup extends Component {
  constructor(props) {
    super(props)

    const { facet } = props
    const { options = {} } = facet

    this.state = {
      isOpen: facet.applied || options.isOpen
    }

    this.onToggle = this.onToggle.bind(this)
    this.onViewAllClick = this.onViewAllClick.bind(this)
  }

  onToggle() {
    this.setState((state) => ({ isOpen: !state.isOpen }))
  }

  onViewAllClick() {
    const {
      facet,
      onTriggerViewAllFacets
    } = this.props
    onTriggerViewAllFacets(facet.title)
  }

  render() {
    const {
      facet,
      facetCategory
    } = this.props

    const {
      autocompleteType,
      changeHandler,
      children,
      options = {},
      title,
      totalSelected = 0
    } = facet

    const { isOpen } = this.state

    let buttonTitleText = title

    if (totalSelected > 0) {
      buttonTitleText += ` (${totalSelected} Filters Selected)`
    }

    if (facet.children.length === 0) {
      buttonTitleText += ' (0 Filters Available)'
    }

    return (
      <li className="facets-group" key={title} data-testid={`facet_group-${kebabCase(title)}`}>
        <h3 className="facets-group__heading">
          <button
            className="btn btn-block facets-group__button"
            type="button"
            label={buttonTitleText}
            title={buttonTitleText}
            onClick={this.onToggle}
            disabled={facet.children.length === 0}
          >
            <div className="facets-group__heading-primary">
              <span className="facets-group__title">
                {title}
              </span>
              {
                totalSelected > 0 && (
                  <span className="facets-group__selected-count">
                    {`${totalSelected} Selected`}
                  </span>
                )
              }
            </div>
            <div className="facets-group__action">
              {
                !isOpen
                  ? (
                    <EDSCIcon icon={ArrowChevronDown}>
                      <span className="visually-hidden">Open</span>
                    </EDSCIcon>
                  ) : (
                    <EDSCIcon icon={ArrowChevronUp}>
                      <span className="visually-hidden">Close</span>
                    </EDSCIcon>
                  )
              }
            </div>
          </button>
        </h3>
        {
          isOpen && (
            <section className="facets-group__body" data-testid={`facet-${kebabCase(title)}`}>
              {
                facet.children.length > 49 && (
                  <header className="facets-group__header">
                    <span className="facets-group__meta">Showing Top 50</span>
                    <button className="facets-group__view-all" type="button" onClick={this.onViewAllClick}>View All</button>
                  </header>
                )
              }
              <FacetsList
                autocompleteType={autocompleteType}
                changeHandler={changeHandler}
                facets={children}
                facetCategory={facetCategory}
                liftSelectedFacets={options.liftSelectedFacets}
              />
            </section>
          )
        }
      </li>
    )
  }
}

FacetsGroup.propTypes = {
  facet: PropTypes.shape({
    applied: PropTypes.bool,
    autocompleteType: PropTypes.string,
    changeHandler: PropTypes.func,
    children: PropTypes.arrayOf(PropTypes.shape({})),
    options: PropTypes.shape({}),
    title: PropTypes.string,
    totalSelected: PropTypes.number
  }).isRequired,
  facetCategory: PropTypes.string.isRequired,
  onTriggerViewAllFacets: PropTypes.func.isRequired
}

export default FacetsGroup
