import React, {} from 'react'
import PropTypes from 'prop-types'
import { uniqueId } from 'lodash'

import actions from '../../../actions'

const FacetsItem = ({
  dispatch,
  facet,
  level,
  uid,
  facetCategory,
  facetApplyLink,
  facetRemoveLink
}) => {
  let children = ''
  const facetActions = { facetApplyLink, facetRemoveLink }

  if (facet.children && facet.applied) {
    children = facet.children.map((child) => {
      const nextUid = uniqueId('facet-item_')
      const nextLevel = level + 1
      const nextFacetApplyLink = child.links && child.links.apply ? child.links.apply : undefined
      const nextFacetRemoveLink = child.links && child.links.remove ? child.links.remove : undefined
      return (
        <FacetsItem
          key={nextUid}
          uid={nextUid}
          facet={child}
          level={nextLevel}
          dispatch={dispatch}
          facetCategory={facetCategory}
          facetApplyLink={nextFacetApplyLink}
          facetRemoveLink={nextFacetRemoveLink}
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
          checked={facet.applied}
          onChange={e => dispatch(actions.toggleFacet(e, facetActions))}
        />
        <span className="facets__item-title">{facet.title}</span>
        { !facet.applied && <span className="facets__item-total">{facet.count}</span> }
      </label>
      { children && <ul className="facets__list">{children}</ul> }
    </li>
  )
}


FacetsItem.defaultProps = {
  uid: '',
  facetApplyLink: undefined,
  facetRemoveLink: undefined
}

FacetsItem.propTypes = {
  facet: PropTypes.shape({}).isRequired,
  level: PropTypes.number.isRequired,
  uid: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  facetCategory: PropTypes.string.isRequired,
  facetApplyLink: PropTypes.string,
  facetRemoveLink: PropTypes.string
}

export default FacetsItem
