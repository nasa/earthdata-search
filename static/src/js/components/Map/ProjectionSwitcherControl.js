import EventType from 'ol/events/EventType'
import Control from 'ol/control/Control'
import projectionCodes from '../../constants/projectionCodes'
import mapButton from './mapButton'

import './ProjectionSwitcherControl.scss'

/**
 * This class class adds 3 buttons to the map to switch between projections
 */
class ProjectionSwitcherControl extends Control {
  constructor(options) {
    // Create the element for this control
    const element = document.createElement('div')

    super({
      ...options,
      element
    })

    this.className = 'projection-switcher-control'
    element.className = this.className

    this.onChangeProjection = options.onChangeProjection

    // Create the North Polar Stereographic button
    const arcticButton = mapButton({
      className: `${this.className}__button ${this.className}__button--arctic`,
      title: 'North Polar Stereographic'
    })
    arcticButton.addEventListener(
      EventType.CLICK,
      this.changeProjection.bind(this, projectionCodes.arctic),
      false
    )

    // Add the button to the element
    element.appendChild(arcticButton)

    // Create the Geographic (Equirectangular) button
    const geographicButton = mapButton({
      className: `${this.className}__button ${this.className}__button--geo`,
      title: 'Geographic (Equirectangular)'
    })
    geographicButton.addEventListener(
      EventType.CLICK,
      this.changeProjection.bind(this, projectionCodes.geographic),
      false
    )

    // Add the button to the element
    element.appendChild(geographicButton)

    // Create the South Polar Stereographic button
    const antarcticButton = mapButton({
      className: `${this.className}__button ${this.className}__button--antarctic`,
      title: 'South Polar Stereographic'
    })
    antarcticButton.addEventListener(
      EventType.CLICK,
      this.changeProjection.bind(this, projectionCodes.antarctic),
      false
    )

    // Add the button to the element
    element.appendChild(antarcticButton)
  }

  /**
   * Zooms the map to the home location
   */
  changeProjection(newProjectionCode) {
    this.onChangeProjection(newProjectionCode)
  }
}

export default ProjectionSwitcherControl
