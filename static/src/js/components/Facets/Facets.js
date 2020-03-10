import React from 'react'
import PropTypes from 'prop-types'
import { camelCase } from 'lodash'

import { changeFeatureFacet, changeCmrFacet } from '../../util/facets'

import FacetsGroup from './FacetsGroup'

import './Facets.scss'

const Facets = (props) => {
  const {
    facets,
    featureFacets,
    onChangeCmrFacet,
    onChangeFeatureFacet,
    onTriggerViewAllFacets
  } = props

  const featureFacetHandler = (e, facetLinkInfo) => {
    changeFeatureFacet(e, facetLinkInfo, onChangeFeatureFacet)
  }

  const cmrFacetHandler = (e, facetLinkInfo) => {
    changeCmrFacet(e, facetLinkInfo, onChangeCmrFacet)
  }

  const featuresFacet = {
    title: 'Features',
    options: {
      isOpen: true
    },
    changeHandler: featureFacetHandler,
    children: [
      {
        applied: featureFacets.mapImagery,
        title: 'Map Imagery',
        type: 'feature'
      },
      {
        applied: featureFacets.nearRealTime,
        title: 'Near Real Time',
        type: 'feature'
      },
      {
        applied: featureFacets.customizable,
        title: 'Customizable',
        type: 'feature'
      }
    ]
  }

  const cmrFacetDefaults = {
    changeHandler: cmrFacetHandler,
    children: []
  }

  const keywordsFacet = {
    ...cmrFacetDefaults,
    title: 'Keywords',
    options: {
      liftSelectedFacets: true
    }
  }

  const platformsFacet = {
    ...cmrFacetDefaults,
    title: 'Platforms'
  }

  const instrumentsFacet = {
    ...cmrFacetDefaults,
    title: 'Instruments'
  }

  const organizationsFacet = {
    ...cmrFacetDefaults,
    title: 'Organizations'
  }

  const projectsTemplate = {
    ...cmrFacetDefaults,
    title: 'Projects'
  }

  const processingLevels = {
    ...cmrFacetDefaults,
    title: 'Processing levels'
  }

  const formats = {
    ...cmrFacetDefaults,
    title: 'Granule Data Format'
  }

  const facetsTemplate = [
    featuresFacet,
    keywordsFacet,
    platformsFacet,
    instrumentsFacet,
    organizationsFacet,
    projectsTemplate,
    processingLevels,
    formats
  ]

  const facetsGroups = facetsTemplate.map((group) => {
    const { options } = group
    const facet = {
      ...group,
      ...facets.byId[group.title]
    }

    return (
      <FacetsGroup
        key={facet.title}
        facet={facet}
        facetCategory={camelCase(facet.title)}
        facetOptions={options}
        onTriggerViewAllFacets={onTriggerViewAllFacets}
      />
    )
  })

  return (
    <>
      <ul className="facets">
        {facetsGroups}
      </ul>
    </>
  )
}

Facets.propTypes = {
  facets: PropTypes.shape({}).isRequired,
  featureFacets: PropTypes.shape({}).isRequired,
  onChangeCmrFacet: PropTypes.func.isRequired,
  onChangeFeatureFacet: PropTypes.func.isRequired,
  onTriggerViewAllFacets: PropTypes.func.isRequired
}

export default Facets
