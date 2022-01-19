import React from 'react'
import PropTypes from 'prop-types'
import { camelCase } from 'lodash'

import { changeFeatureFacet, changeCmrFacet } from '../../util/facets'

import FacetsGroup from './FacetsGroup'

import './Facets.scss'

const Facets = (props) => {
  const {
    facetsById,
    featureFacets,
    portal,
    onChangeCmrFacet,
    onChangeFeatureFacet,
    onTriggerViewAllFacets
  } = props

  const featureFacetHandler = (e, facetLinkInfo) => {
    changeFeatureFacet(e, facetLinkInfo, onChangeFeatureFacet)
  }

  const cmrFacetHandler = (e, facetLinkInfo, facet, applied) => {
    changeCmrFacet(e, facetLinkInfo, onChangeCmrFacet, facet, applied)
  }

  const { features = {} } = portal
  const { featureFacets: portalFeatureFacets = {} } = features
  const {
    showMapImagery,
    showNearRealTime,
    showCustomizable,
    showAvailableFromAwsCloud
  } = portalFeatureFacets

  const featuresFacet = {
    title: 'Features',
    options: {
      isOpen: true
    },
    changeHandler: featureFacetHandler,
    children: []
  }

  if (showAvailableFromAwsCloud) {
    featuresFacet.children.push({
      applied: featureFacets.availableFromAwsCloud,
      title: 'Available from AWS Cloud',
      type: 'feature'
    })
  }
  if (showCustomizable) {
    featuresFacet.children.push({
      applied: featureFacets.customizable,
      title: 'Customizable',
      type: 'feature'
    })
  }
  if (showMapImagery) {
    featuresFacet.children.push({
      applied: featureFacets.mapImagery,
      title: 'Map Imagery',
      type: 'feature'
    })
  }
  if (showNearRealTime) {
    featuresFacet.children.push({
      applied: featureFacets.nearRealTime,
      title: 'Near Real Time',
      type: 'feature'
    })
  }

  const cmrFacetDefaults = {
    changeHandler: cmrFacetHandler,
    children: []
  }

  const keywordsFacet = {
    ...cmrFacetDefaults,
    title: 'Keywords',
    autocompleteType: 'science_keywords',
    options: {
      liftSelectedFacets: true
    }
  }

  const platformsFacet = {
    ...cmrFacetDefaults,
    title: 'Platforms',
    autocompleteType: 'platform'
  }

  const instrumentsFacet = {
    ...cmrFacetDefaults,
    title: 'Instruments',
    autocompleteType: 'instrument'
  }

  const organizationsFacet = {
    ...cmrFacetDefaults,
    title: 'Organizations',
    autocompleteType: 'organization'
  }

  const projectsTemplate = {
    ...cmrFacetDefaults,
    title: 'Projects',
    autocompleteType: 'project'
  }

  const processingLevels = {
    ...cmrFacetDefaults,
    title: 'Processing Levels',
    autocompleteType: 'processing_level_id'
  }

  const formats = {
    ...cmrFacetDefaults,
    title: 'Data Format',
    autocompleteType: 'granule_data_format'
  }

  const tilingSystem = {
    ...cmrFacetDefaults,
    title: 'Tiling System',
    autocompleteType: 'two_d_coordinate_system_name'
  }

  const horizontalDataResolution = {
    ...cmrFacetDefaults,
    title: 'Horizontal Data Resolution',
    autocompleteType: 'horizontal_data_resolution'
  }

  const facetsTemplate = [
    featuresFacet,
    keywordsFacet,
    platformsFacet,
    instrumentsFacet,
    organizationsFacet,
    projectsTemplate,
    processingLevels,
    formats,
    tilingSystem,
    horizontalDataResolution
  ]

  // If all feature facets were disabled, don't show the featuresFacet group
  if (!featuresFacet.children.length) {
    facetsTemplate.shift()
  }

  const facetsGroups = facetsTemplate.map((group) => {
    const facet = {
      ...group,
      ...facetsById[group.title]
    }

    return (
      <FacetsGroup
        key={facet.title}
        facet={facet}
        facetCategory={camelCase(facet.title)}
        onTriggerViewAllFacets={onTriggerViewAllFacets}
      />
    )
  })

  return (
    <ul className="facets">
      {facetsGroups}
    </ul>
  )
}

Facets.propTypes = {
  facetsById: PropTypes.shape({}).isRequired,
  featureFacets: PropTypes.shape({
    availableFromAwsCloud: PropTypes.bool,
    customizable: PropTypes.bool,
    mapImagery: PropTypes.bool,
    nearRealTime: PropTypes.bool
  }).isRequired,
  portal: PropTypes.shape({
    features: PropTypes.shape({})
  }).isRequired,
  onChangeCmrFacet: PropTypes.func.isRequired,
  onChangeFeatureFacet: PropTypes.func.isRequired,
  onTriggerViewAllFacets: PropTypes.func.isRequired
}

export default Facets
