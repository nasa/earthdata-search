import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { kebabCase, uniqueId } from 'lodash-es'
import classNames from 'classnames'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { FaQuestionCircle } from 'react-icons/fa'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import { generateFacetArgs } from '../../util/facets'
import { commafy } from '../../util/commafy'

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

    const { iconProps } = facet

    return (
      <li className={className}>
        <label
          className="facets-item__label"
          htmlFor={uid}
          title={facet.title}
        >
          <input
            id={uid}
            className="facets-item__checkbox form-check-input mt-0"
            data-testid={`facet_item-${kebabCase(facet.title)}`}
            type="checkbox"
            name={facet.title}
            aria-label={facet.title}
            checked={applied}
            onChange={this.onFacetChange.bind(this, changeHandlerArgs)}
          />
          <div className="facets-item__title-container">
            {
              iconProps?.icon && (
                <EDSCIcon
                  className="facets-item__icon"
                  icon={iconProps.icon}
                  variant="facet"
                  ariaLabel={iconProps.ariaLabel}
                />
              )
            }
            <span className="facets-item__title">
              {facet.title}
            </span>
            {
              facet.description
              && (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    (
                      <Tooltip style={{ width: '20rem' }}>
                        {facet.description}
                      </Tooltip>
                    )
                  }
                >
                  <EDSCIcon
                    icon={FaQuestionCircle}
                    size="10"
                    variant="more-info"
                    ariaLabel="A question mark icon indicating there is more information"
                    data-testid={`facet_item-${kebabCase(facet.title)}-info`}
                  />
                </OverlayTrigger>
              )
            }
          </div>
          { (!applied || !children) && (facet.count != null) && <span className="facets-item__total">{commafy(facet.count)}</span> }
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
    children: PropTypes.arrayOf(PropTypes.shape({})),
    count: PropTypes.number,
    title: PropTypes.string,
    value: PropTypes.string,
    description: PropTypes.string,
    iconProps: PropTypes.shape({
      icon: PropTypes.elementType,
      ariaLabel: PropTypes.string
    })
  }).isRequired,
  facetCategory: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  uid: PropTypes.string
}

export default FacetsItem
