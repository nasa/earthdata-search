import React from 'react'
import PropTypes from 'prop-types'
import { uniqueId } from 'lodash'
import { connect } from 'react-redux'

import FacetsItem from './FacetsItem'

const FacetsList = (props) => {
  const {
    facets,
    facetCategory,
    dispatch,
    liftSelectedFacets
  } = props

  let orderedFacets = []

  if (liftSelectedFacets) {
    // https://stackoverflow.com/questions/17387435/javascript-sort-array-of-objects-by-a-boolean-property#comment25241651_17387454
    orderedFacets = facets.sort((a, b) => b.applied - a.applied)
  } else {
    orderedFacets = facets.map(facet => facet)
  }

  const list = orderedFacets.map((child, i) => {
    if (i < 50) {
      const uid = uniqueId('facet-item_')
      const startingLevel = 0
      const facetApplyLink = child.links && child.links.apply ? child.links.apply : undefined
      const facetRemoveLink = child.links && child.links.remove ? child.links.remove : undefined
      return (
        <FacetsItem
          key={uid}
          uid={uid}
          facet={child}
          level={startingLevel}
          dispatch={dispatch}
          facetCategory={facetCategory}
          facetApplyLink={facetApplyLink}
          facetRemoveLink={facetRemoveLink}
        />
      )
    }
    return null
  })

  return (
    <ul className="facets__list facets__list--level-0">
      {list}
    </ul>
  )
}

FacetsList.defaultProps = {
  facets: [],
  liftSelectedFacets: false
}

FacetsList.propTypes = {
  facets: PropTypes.arrayOf(PropTypes.shape({})),
  facetCategory: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  liftSelectedFacets: PropTypes.bool
}

export default connect()(FacetsList)
