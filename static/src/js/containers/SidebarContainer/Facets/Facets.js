import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { camelCase } from 'lodash'

import FacetsGroup from './FacetsGroup'

import './Facets.scss'

const mapStateToProps = state => ({
  facets: state.entities.facets
})

const Facets = (props) => {
  const { facets } = props

  const featuresFacet = {
    title: 'Features',
    options: {
      isOpen: true
    },
    children: [
      {
        title: 'Map Imagery'
      },
      {
        title: 'Near Real Time'
      },
      {
        title: 'Customizable'
      }
    ]
  }

  const keywordsFacet = {
    title: 'Keywords',
    options: {
      liftSelectedFacets: true
    }
  }

  const platformsFacet = {
    title: 'Platforms'
  }

  const instrumentsFacet = {
    title: 'Instruments'
  }

  const organizationsFacet = {
    title: 'Organizations'
  }

  const projectsTemplate = {
    title: 'Projects'
  }

  const processingLevels = {
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
    const facet = facets.byId[group.title] ? facets.byId[group.title] : group

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
  facets: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps)(Facets)
