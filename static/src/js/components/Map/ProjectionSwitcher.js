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
          aria-label="North Polar Stereographic"
          className="projection-switcher__button projection-switcher__button--arctic"
          data-test-id="projection-switcher__arctic"
          onClick={() => onChangeProjection(projections.arctic)}
          title="North Polar Stereographic"
          type="button"
        />
        <button
          aria-label="Geographic (Equirectangular)"
          className="projection-switcher__button projection-switcher__button--geo"
          data-test-id="projection-switcher__geo"
          onClick={() => onChangeProjection(projections.geographic)}
          title="Geographic (Equirectangular)"
          type="button"
        />
        <button
          aria-label="South Polar Stereographic"
          className="projection-switcher__button projection-switcher__button--antarctic"
          data-test-id="projection-switcher__antarctic"
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
