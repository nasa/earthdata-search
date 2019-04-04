import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { camelCase } from 'lodash'
import qs from 'qs'

import { queryParamsFromUrlString } from '../../../util/url'
import actions from '../../../actions/index'

import FacetsGroup from './FacetsGroup'

import './Facets.scss'

const mapDispatchToProps = dispatch => ({
  onChangeFeatureFacet: (e, facetLinkInfo) => dispatch(actions.changeFeatureFacet(e, facetLinkInfo)),
  onChangeCmrFacet: (e, facetLinkInfo) => dispatch(actions.changeCmrFacet(e, facetLinkInfo))
})


const mapStateToProps = state => ({
  facets: state.entities.facets,
  featureFacets: state.facetsParams.feature
})

const Facets = (props) => {
  const {
    facets,
    onChangeFeatureFacet,
    onChangeCmrFacet,
    featureFacets
  } = props

  const changeFeatureFacet = (e, facetLinkInfo) => {
    onChangeFeatureFacet(e, facetLinkInfo)
  }

  const changeCmrFacet = (e, facetLinkInfo) => {
    const newParams = qs.parse(queryParamsFromUrlString(facetLinkInfo.destination))

    const paramsToSend = {
      science_keywords_h: newParams.science_keywords_h,
      platform_h: newParams.platform_h,
      instrument_h: newParams.instrument_h,
      data_center_h: newParams.data_center_h,
      project_h: newParams.project_h,
      processing_level_id_h: newParams.processing_level_id_h
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
        title: 'Map Imagery',
        applied: featureFacets.mapImagery,
        type: 'feature'
      },
      {
        title: 'Near Real Time',
        applied: featureFacets.nearRealTime,
        type: 'feature'
      },
      {
        title: 'Customizable',
        applied: featureFacets.customizable,
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
    title: 'Platforms',
    changeHandler: changeCmrFacet
  }

  const instrumentsFacet = {
    title: 'Instruments',
    changeHandler: changeCmrFacet
  }

  const organizationsFacet = {
    title: 'Organizations',
    changeHandler: changeCmrFacet
  }

  const projectsTemplate = {
    title: 'Projects',
    changeHandler: changeCmrFacet
  }

  const processingLevels = {
    title: 'Processing levels',
    changeHandler: changeCmrFacet
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
  onChangeFeatureFacet: PropTypes.func.isRequired,
  onChangeCmrFacet: PropTypes.func.isRequired,
  featureFacets: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Facets)
