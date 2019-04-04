import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { uniqueId } from 'lodash'

import { generateFacetArgs } from '../../../util/facets'

class FacetsItem extends Component {
  constructor(props) {
    super(props)

    const { facet } = props

    this.state = {
      applied: facet.applied
    }

    this.onFacetChange = this.onFacetChange.bind(this)
  }

  onFacetChange(changeHandlerArgs, e) {
    const { changeHandler } = this.props
    const { applied } = this.state

    this.setState({
      applied: !applied
    })

    changeHandler(e, changeHandlerArgs)
  }

  render() {
    const {
      facet,
      level,
      uid,
      facetCategory,
      changeHandler
    } = this.props

    const { applied } = this.state

    let children = ''

    const changeHandlerArgs = generateFacetArgs(facet)

    if (facet.children && applied) {
      children = facet.children.map((child) => {
        const nextUid = uniqueId('facet-item_')
        const nextLevel = level + 1
        return (
          <FacetsItem
            key={nextUid}
            uid={nextUid}
            facet={child}
            level={nextLevel}
            facetCategory={facetCategory}
            changeHandler={changeHandler}
          />
        )
      })
    }

    return (
      <li className={`facets__list-item facets__list-item--level-${level}`}>
        <label className="facets__item-label" htmlFor={uid}>
          <input
            id={uid}
            className="facets__item-checkbox"
            type="checkbox"
            checked={applied}
            onChange={this.onFacetChange.bind(this, changeHandlerArgs)}
          />
          <span className="facets__item-title">{facet.title}</span>
          { !applied && <span className="facets__item-total">{facet.count}</span> }
        </label>
        { children && <ul className="facets__list">{children}</ul> }
      </li>
    )
  }
}

FacetsItem.defaultProps = {
  uid: ''
}

FacetsItem.propTypes = {
  facet: PropTypes.shape({}).isRequired,
  level: PropTypes.number.isRequired,
  uid: PropTypes.string,
  facetCategory: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired
}

export default FacetsItem
