import React from 'react'
import PropTypes from 'prop-types'
import Control from 'react-leaflet-control'

import projections from '../../util/map/projections'

import './ProjectionSwitcher.scss'

const ProjectionSwitcher = (props) => {
  const { onChangeProjection } = props

  return (
    <Control position="bottomright">
      <div className="projection-switcher leaflet-bar">
        <button
          className="project-switcher-arctic"
          onClick={() => onChangeProjection(projections.arctic)}
          title="North Polar Stereographic"
          type="button"
        >
          Arctic
        </button>
        <button
          className="project-switcher-geo"
          onClick={() => onChangeProjection(projections.geographic)}
          title="Geographic (Equirectangular)"
          type="button"
        >
          Geographic
        </button>
        <button
          className="project-switcher-antarctic"
          onClick={() => onChangeProjection(projections.antarctic)}
          title="South Polar Stereographic"
          type="button"
        >
          Antarctic
        </button>
      </div>
    </Control>
  )
}

ProjectionSwitcher.propTypes = {
  onChangeProjection: PropTypes.func.isRequired
}

export default ProjectionSwitcher
