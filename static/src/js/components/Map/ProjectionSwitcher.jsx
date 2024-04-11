import L from 'leaflet'
import { createControlComponent } from '@react-leaflet/core'

import projections from '../../util/map/projections'

class ProjectionSwitcherControl extends L.Control {
  initialize(props) {
    const { onChangeProjection } = props

    this.onChangeProjection = onChangeProjection
  }

  options = {
    position: 'bottomright'
  }

  onAdd() {
    this.container = L.DomUtil.create('div', '')
    const switcher = L.DomUtil.create('div', 'projection-switcher leaflet-bar', this.container)

    const arcticButton = L.DomUtil.create(
      'button',
      'projection-switcher__button projection-switcher__button--arctic',
      switcher
    )
    arcticButton.ariaLabel = 'North Polar Stereographic'
    arcticButton.title = 'North Polar Stereographic'
    arcticButton.setAttribute('data-testid', 'projection-switcher__arctic')
    arcticButton.onclick = () => this.onChangeProjection(projections.arctic)

    const geographicButton = L.DomUtil.create(
      'button',
      'projection-switcher__button projection-switcher__button--geo',
      switcher
    )
    geographicButton.ariaLabel = 'Geographic (Equirectangular)'
    geographicButton.title = 'Geographic (Equirectangular)'
    geographicButton.setAttribute('data-testid', 'projection-switcher__geo')
    geographicButton.onclick = () => this.onChangeProjection(projections.geographic)

    const antarcticButton = L.DomUtil.create(
      'button',
      'projection-switcher__button projection-switcher__button--antarctic',
      switcher
    )
    antarcticButton.ariaLabel = 'South Polar Stereographic'
    antarcticButton.title = 'South Polar Stereographic'
    antarcticButton.setAttribute('data-testid', 'projection-switcher__antarctic')
    antarcticButton.onclick = () => this.onChangeProjection(projections.antarctic)

    return this.container
  }
}

const ProjectionSwitcher = (props) => new ProjectionSwitcherControl(props)

export default createControlComponent(ProjectionSwitcher)
