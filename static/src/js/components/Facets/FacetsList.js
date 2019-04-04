import React from 'react'
import PropTypes from 'prop-types'
import { uniqueId } from 'lodash'

import FacetsItem from './FacetsItem'

const FacetsList = (props) => {
  const {
    facets,
    facetCategory,
    liftSelectedFacets,
    changeHandler
  } = props

  let orderedFacets = []

  if (liftSelectedFacets) {
    // https://stackoverflow.com/questions/17387435/javascript-sort-array-of-objects-by-a-boolean-property#comment25241651_17387454
    orderedFacets = facets.sort((a, b) => b.applied - a.applied)
  } else {
    orderedFacets = [...facets]
  }

  const list = orderedFacets.map((child, i) => {
    if (i < 50) {
      const uid = uniqueId('facet-item_')
      const startingLevel = 0
      return (
        <FacetsItem
          key={uid}
          uid={uid}
          facet={child}
          level={startingLevel}
          facetCategory={facetCategory}
          changeHandler={changeHandler}
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
  liftSelectedFacets: PropTypes.bool,
  changeHandler: PropTypes.func.isRequired
}

export default FacetsList
