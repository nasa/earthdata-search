import React from 'react'
import PropTypes from 'prop-types'
import { camelCase } from 'lodash'
import qs from 'qs'

import { queryParamsFromUrlString } from '../../util/url'

import FacetsGroup from './FacetsGroup'

import './Facets.scss'

const Facets = (props) => {
  const {
    facets,
    featureFacets,
    onChangeCmrFacet,
    onChangeFeatureFacet
  } = props

  const changeFeatureFacet = (e, facetLinkInfo) => {
    onChangeFeatureFacet(e, facetLinkInfo)
  }

  const changeCmrFacet = (e, facetLinkInfo) => {
    const newParams = qs.parse(queryParamsFromUrlString(facetLinkInfo.destination))

    const paramsToSend = {
      data_center_h: newParams.data_center_h,
      instrument_h: newParams.instrument_h,
      platform_h: newParams.platform_h,
      processing_level_id_h: newParams.processing_level_id_h,
      project_h: newParams.project_h,
      science_keywords_h: newParams.science_keywords_h
    }

    onChangeCmrFacet(e, paramsToSend)
  }

  const featuresFacet = {
    title: 'Features',
    options: {
      isOpen: true
    },
    changeHandler: changeFeatureFacet,
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

  const keywordsFacet = {
    title: 'Keywords',
    changeHandler: changeCmrFacet,
    options: {
      liftSelectedFacets: true
    }
  }

  const platformsFacet = {
    changeHandler: changeCmrFacet,
    title: 'Platforms'
  }

  const instrumentsFacet = {
    changeHandler: changeCmrFacet,
    title: 'Instruments'
  }

  const organizationsFacet = {
    changeHandler: changeCmrFacet,
    title: 'Organizations'
  }

  const projectsTemplate = {
    changeHandler: changeCmrFacet,
    title: 'Projects'
  }

  const processingLevels = {
    changeHandler: changeCmrFacet,
    title: 'Processing levels'
  }

  const facetsTemplate = [
    featuresFacet,
    keywordsFacet,
    platformsFacet,
    instrumentsFacet,
    organizationsFacet,
    projectsTemplate,
    processingLevels
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
  facets: PropTypes.shape({}).isRequired,
  featureFacets: PropTypes.shape({}).isRequired,
  onChangeCmrFacet: PropTypes.func.isRequired,
  onChangeFeatureFacet: PropTypes.func.isRequired
}

export default Facets
