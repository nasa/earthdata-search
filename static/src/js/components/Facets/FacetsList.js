import React from 'react'
import PropTypes from 'prop-types'
import { pure } from 'recompose'
import { uniqueId } from 'lodash'
import classNames from 'classnames'

import { isNumber } from '../../util/is-number'
import { alphabet, createEmptyAlphabeticListObj } from '../../util/alphabetic-list'

import FacetsItem from './FacetsItem'
import FacetsSectionHeading from './FacetsSectionHeading'

import './FacetsList.scss'

const FacetsList = (props) => {
  const {
    facets,
    facetCategory,
    liftSelectedFacets,
    changeHandler,
    sortBy,
    variation
  } = props

  // Start by creating arrays to sort lifted and non-lifted facets
  let facetsToLift = []
  let facetsToSort = []

  // Populate the arrays based on the applied property if liftSelectedFacets is set,
  // otherwise put all facets on facetsToSort
  if (liftSelectedFacets) {
    facetsToLift = facets.filter(facet => facet.applied)
    facetsToSort = facets.filter(facet => !facet.applied)
  } else {
    facetsToSort = [...facets]
  }

  let current = '#'

  // Set alphabetizedList to an object where each property is an array for a given letter
  const alphabetizedList = createEmptyAlphabeticListObj()

  // Sort remaining 'non-lifted' facets into their respective arrays based on the first letter
  facetsToSort.forEach((facet) => {
    const firstLetter = facet.title[0].toUpperCase()
    const firstIsNumber = isNumber(firstLetter)

    // If the first letter is not the current letter, set the current letter to the first letter of
    // the selected letters facet. This relies on CMR returning the facets in alpabetical order
    if (firstLetter !== current) {
      current = firstIsNumber ? '#' : alphabet[alphabet.indexOf(facet.title[0])]
    }

    // If the first letter matches the current letter, push it onto the list. We also need to account
    // for the first letter being a number, in which case it's added to the '#' list
    if (firstLetter === current || (current === '#' && firstIsNumber)) {
      alphabetizedList[current].push(facet)
    }
  })

  // Create the list that is ultimately displayed in the component
  let list = []

  // This function returns a list of facet components to be displayed
  const buildFacetList = (facets, limit = null) => facets.map((child, i) => {
    if (i < limit || limit === null) {
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
  facets: [],
  liftSelectedFacets: false,
  sortBy: null,
  variation: ''
}

FacetsList.propTypes = {
  facets: PropTypes.arrayOf(PropTypes.shape({})),
  facetCategory: PropTypes.string.isRequired,
  liftSelectedFacets: PropTypes.bool,
  changeHandler: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
  variation: PropTypes.string
}

export default pure(FacetsList)
