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
          className="projection-switcher-arctic"
          onClick={() => onChangeProjection(projections.arctic)}
          title="North Polar Stereographic"
          type="button"
        />
        <button
          className="projection-switcher-geo"
          onClick={() => onChangeProjection(projections.geographic)}
          title="Geographic (Equirectangular)"
          type="button"
        />
        <button
          className="projection-switcher-antarctic"
          onClick={() => onChangeProjection(projections.antarctic)}
          title="South Polar Stereographic"
          type="button"
        />
      </div>
    </Control>
  )
}

ProjectionSwitcher.propTypes = {
  onChangeProjection: PropTypes.func.isRequired
}

export default ProjectionSwitcher
