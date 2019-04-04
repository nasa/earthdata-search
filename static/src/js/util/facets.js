/**
 * Counts the selected facets in a facet group provided from CMR.
 * @param {object} groupToCheck - An object representing the facet to be checked.
 * @param {number} startingValue - A number representing the number from which to start counting.
 * @return {number} The number of selected facets within the provided facet group.
 */
export const countSelectedFacets = (groupToCheck, startingValue = 0) => {
  let totalSelectedFacets = 0
  let selected = []

  if (groupToCheck.children && groupToCheck.children.length) {
    selected = groupToCheck.children.filter(child => child.applied)
  }

  selected.forEach((selectedFacet) => {
    totalSelectedFacets = countSelectedFacets(selectedFacet, selected.length)
  })

  return startingValue + totalSelectedFacets
}


/**
 * Takes a facet and returns the arguments to be passed to it's changeHandler function.
 * @param {object} facet - The clicked facet.
 * @return {object} The arguments to be passed to the changeHandler function.
 */
export const generateFacetArgs = (facet) => {
  const link = {
    destination: null,
    title: facet.title
  }

  if (facet.type === 'group' || facet.type === 'filter') {
    link.destination = facet.links.apply ? facet.links.apply : facet.links.remove
  }

  return link
}
