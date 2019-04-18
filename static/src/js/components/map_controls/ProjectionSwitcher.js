import React from 'react'
import PropTypes from 'prop-types'
import Control from 'react-leaflet-control'

import './ProjectionSwitcher.scss'

const ProjectionSwitcher = (props) => {
  const { onChangeProjection } = props

  return (
    <Control position="bottomright">
      <div className="projection-switcher leaflet-bar">
        <button
          className="project-switcher-arctic"
          onClick={() => onChangeProjection('epsg3413')}
          title="North Polar Stereographic"
          type="button"
        >
          Arctic
        </button>
        <button
          className="project-switcher-geo"
          onClick={() => onChangeProjection('epsg4326')}
          title="Geographic (Equirectangular)"
          type="button"
        >
          Geographic
        </button>
        <button
          className="project-switcher-antarctic"
          onClick={() => onChangeProjection('epsg3031')}
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
