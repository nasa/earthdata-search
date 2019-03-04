import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { uniqueId } from 'underscore'

import './Facets.scss'

const mapStateToProps = state => ({
  facets: state.entities.facets
})

const FacetsList = (props) => {
  const { facets } = props
  const list = facets.map((child, i) => {
    if (i < 50) {
      const uid = uniqueId('facet-item_')
      return (
        <li className="facets__list-item" key={child.title}>
          <label className="facets__item-label" htmlFor={uid}>
            <input id={uid} className="facets__item-checkbox" type="checkbox" />
            <span className="facets__item-title">{child.title}</span>
            <span className="facets__item-total">{child.count}</span>
          </label>
        </li>
      )
    }
    return null
  })

  return (
    <ul className="facets__list">
      {list}
    </ul>
  )
}

class FacetsGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
    this.onToggle = this.onToggle.bind(this)
  }

  onToggle() {
    this.setState(state => ({ isOpen: !state.isOpen }))
  }

  render() {
    const { facet } = this.props
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
        <div className={`facets__facet-group
          ${isOpen ? ' facets__facet-group--is-open' : ''}`}
        >
          <FacetsList facets={facet.children} />
        </div>
      </li>
    )
  }
}

const Facets = (props) => {
  const { facets } = props

  const facetsGroup = facets.allIds.map((id) => {
    const facet = facets.byId[id]

    return (
      <FacetsGroup key={facet.title} facet={facet} />
    )
  })

  const featuresFacet = {
    title: 'Features',
    children: [
      {
        title: 'Map Imagery'
      },
      {
        title: 'Near Real Time'
      },
      {
        title: 'Customizable'
      }
    ]
  }

  return (
    <ul className="facets">
      <FacetsGroup facet={featuresFacet} />
      {facetsGroup}
    </ul>
  )
}

Facets.propTypes = {
  facets: PropTypes.shape({}).isRequired
}

FacetsList.propTypes = {
  facets: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired
}

FacetsGroup.propTypes = {
  facet: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, null)(Facets)
