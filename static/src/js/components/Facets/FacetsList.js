import React from 'react'
import PropTypes from 'prop-types'
import { uniqueId } from 'lodash'
import classNames from 'classnames'

import { buildOrganizedFacets } from '../../util/facets'

import FacetsItem from './FacetsItem'
import FacetsSectionHeading from './FacetsSectionHeading'

import './FacetsList.scss'

const FacetsList = (props) => {
  const {
    autocompleteType,
    facets,
    facetCategory,
    liftSelectedFacets,
    changeHandler,
    sortBy,
    variation
  } = props

  // Return a list of facet components to be displayed
  const buildFacetList = (facets, limit = null) => facets.map((child, i) => {
    if (i < limit || limit === null) {
      const uid = uniqueId('facet-item_')
      const startingLevel = 0

      return (
        <FacetsItem
          autocompleteType={autocompleteType}
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

  // Create the list that is ultimately displayed in the component
  let list = []

  // If we are looking at feature facets, display them as provided
  if (facetCategory === 'features') {
    list = buildFacetList(facets)
  } else {
    // Start by creating arrays to sort lifted and non-lifted facets
    const { alphabetizedList, facetsToLift } = buildOrganizedFacets(facets, { liftSelectedFacets })

    // If we have any facets to lift, append them to the list first
    if (facetsToLift.length) {
      list = buildFacetList(facetsToLift)
    }

    // Here we loop through the keys of the alphabetized list and return the facets
    // depending on which style of list is needed
    const sortedFacets = Object.keys(alphabetizedList).map((letter, i) => {
      const sortedList = []
      const key = `sorted-list_${i}`

      // If the current key has facets, return the corresponding elements
      if (alphabetizedList[letter].length) {
        // If we want to sort by alpha, we return each set of facets with a header item.
        // Otherwaise we just return the facet items
        if (sortBy === 'alpha') {
          const id = letter === '#' ? 'number' : letter
          sortedList.push((
            <FacetsSectionHeading
              key={`alpha-item_${id}`}
              id={`facet-modal__${id}`}
              letter={letter}
            />))
        }
        sortedList.push(buildFacetList(alphabetizedList[letter]))
      }
      // If we have passed in a sortBy property, we want to wrap each section in its own <ul>
      return sortBy ? <ul key={key} className="facets-list">{sortedList}</ul> : sortedList
    })

    // Combine the current list of lifted facets with the sorted facets. The list will still be empty
    // at this point if liftSelected facets is not set
    list = [...list, ...sortedFacets]
  }

  const className = classNames({
    'facets-list': true,
    'facets-list--light': variation === 'light'
  })

  return (
    <ul className={className}>
      {list}
    </ul>
  )
}

FacetsList.defaultProps = {
  autocompleteType: null,
  facets: [],
  liftSelectedFacets: false,
  sortBy: null,
  variation: ''
}

FacetsList.propTypes = {
  autocompleteType: PropTypes.string,
  facets: PropTypes.arrayOf(PropTypes.shape({})),
  facetCategory: PropTypes.string.isRequired,
  liftSelectedFacets: PropTypes.bool,
  changeHandler: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
  variation: PropTypes.string
}

export default FacetsList
