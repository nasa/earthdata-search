import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { kebabCase, uniqueId } from 'lodash'
import classNames from 'classnames'

import { generateFacetArgs } from '../../util/facets'

import './FacetsItem.scss'

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
    const {
      autocompleteType,
      changeHandler,
      facet,
      level
    } = this.props

    const { title: facetValue } = facet
    const { applied } = this.state

    this.setState({
      applied: !applied
    })

    changeHandler(e, changeHandlerArgs, {
      level,
      type: autocompleteType,
      value: facetValue
    }, !applied)
  }

  render() {
    const {
      autocompleteType,
      changeHandler,
      facet,
      facetCategory,
      level,
      uid
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
            autocompleteType={autocompleteType}
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

    const className = classNames(
      'facets-item',
      `facets-item--level-${level}`
    )

    return (
      <li className={className}>
        <label
          className="facets-item__label"
          htmlFor={uid}
          title={facet.title}
        >
          <input
            id={uid}
            className="facets-item__checkbox"
            data-test-id={`facet_item-${kebabCase(facet.title)}`}
            type="checkbox"
            checked={applied}
            onChange={this.onFacetChange.bind(this, changeHandlerArgs)}
          />
          <span className="facets-item__title">{facet.title}</span>
          { (!applied || !children) && <span className="facets-item__total">{facet.count}</span> }
        </label>
        { children && <ul className="facets-list">{children}</ul> }
      </li>
    )
  }
}

FacetsItem.defaultProps = {
  autocompleteType: null,
  uid: ''
}

FacetsItem.propTypes = {
  autocompleteType: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
  facet: PropTypes.shape({
    applied: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.node),
    count: PropTypes.number,
    title: PropTypes.string
  }).isRequired,
  facetCategory: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  uid: PropTypes.string
}

export default FacetsItem
