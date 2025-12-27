import React from 'react'
import { camelCase } from 'lodash-es'

import { FaMap } from 'react-icons/fa'
import { CloudFill, Settings } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { changeFeatureFacet, changeCmrFacet } from '../../util/facets'

import FacetsGroup from './FacetsGroup'

import useEdscStore from '../../zustand/useEdscStore'

import './Facets.scss'

const Facets = () => {
  const facetsById = useEdscStore((state) => state.facets.facets.byId)

  const {
    featureFacets,
    setCmrFacets,
    setFeatureFacets,
    portal
  } = useEdscStore((state) => ({
    featureFacets: state.facetParams.featureFacets,
    setCmrFacets: state.facetParams.setCmrFacets,
    setFeatureFacets: state.facetParams.setFeatureFacets,
    portal: state.portal
  }))

  const featureFacetHandler = (event, facetLinkInfo) => {
    changeFeatureFacet(event, facetLinkInfo, setFeatureFacets)
  }

  const cmrFacetHandler = (event, facetLinkInfo) => {
    changeCmrFacet(event, facetLinkInfo, setCmrFacets)
  }

  const { features = {} } = portal
  const { featureFacets: portalFeatureFacets = {} } = features
  const {
    showAvailableInEarthdataCloud,
    showCustomizable,
    showMapImagery
  } = portalFeatureFacets

  const featuresFacet = {
    title: 'Features',
    options: {
      isOpen: true
    },
    changeHandler: featureFacetHandler,
    children: []
  }

  if (showAvailableInEarthdataCloud) {
    featuresFacet.children.push({
      applied: featureFacets.availableInEarthdataCloud,
      title: 'Available in Earthdata Cloud',
      value: 'availableInEarthdataCloud',
      iconProps: {
        icon: CloudFill,
        ariaLabel: 'A cloud icon'
      },
      type: 'feature'
    })
  }

  if (showCustomizable) {
    featuresFacet.children.push({
      applied: featureFacets.customizable,
      title: 'Customizable',
      value: 'customizable',
      iconProps: {
        icon: Settings,
        ariaLabel: 'A gear icon'
      },
      description: 'Include only collections that support customization (temporal, spatial, or variable subsetting, reformatting, etc.)',
      type: 'feature'
    })
  }

  if (showMapImagery) {
    featuresFacet.children.push({
      applied: featureFacets.mapImagery,
      value: 'mapImagery',
      iconProps: {
        icon: FaMap,
        ariaLabel: 'A map icon'
      },
      title: 'Map Imagery',
      type: 'feature'
    })
  }

  const cmrFacetDefaults = {
    changeHandler: cmrFacetHandler,
    children: []
  }

  /**
   * NOTE: If these facets are changed in the future (like new groups added), be sure
   * to update the metrics helper `computeFacets` function to ensure the
   * metrics are still being collected correctly.
   * `computeFacets` found here: static/src/js/middleware/metrics/helpers.js
   */

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
    autocompleteType: 'platforms',
    options: {
      liftSelectedFacets: true
    }
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
    autocompleteType: 'processing_level'
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

  const latencyResolution = {
    ...cmrFacetDefaults,
    title: 'Latency',
    autocompleteType: 'latency'
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
    horizontalDataResolution,
    latencyResolution
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
      />
    )
  })

  return (
    <ul className="facets">
      {facetsGroups}
    </ul>
  )
}

export default Facets
