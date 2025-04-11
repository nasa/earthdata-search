import ReactDOM from 'react-dom'
import Control from 'ol/control/Control'
import EventType from 'ol/events/EventType'
import { baseLayerIds } from '../../constants/mapLayers'
import mapButton from './mapButton'

import './LayerSwitcherControl.scss'

/**
 * This class adds a layer switcher control to the map
 */
class LayerSwitcherControl extends Control {
  constructor(options) {
    const element = document.createElement('div')

    super({
      ...options,
      element
    })

    this.className = 'layer-switcher-control'
    element.className = `${this.className} bg-white`

    this.options = options
    this.onChangeLayer = options.onChangeLayer
    this.setIsLayerSwitcherOpen = options.setIsLayerSwitcherOpen

    const toggleButton = mapButton({
      className: `${this.className}__button`,
      title: 'Layer Options',
      tooltip: false
    })

    if (options.LayersIcon) {
      ReactDOM.render(
        options.LayersIcon,
        toggleButton
      )
    }

    element.appendChild(toggleButton)

    const panel = document.createElement('div')
    panel.className = `${this.className}__panel bg-white`

    if (options.isLayerSwitcherOpen) panel.className += ` ${this.className}__panel--visible`

    this.addLayerOptions(panel)
    element.appendChild(panel)

    element.addEventListener('mouseenter', () => {
      this.setIsLayerSwitcherOpen(true)
    })

    element.addEventListener('mouseleave', () => {
      this.setIsLayerSwitcherOpen(false)
    })

    // When hovering over the panel, prevent the hover event from firing on the map
    panel.addEventListener('hover', (event) => {
      event.stopPropagation()
      event.preventDefault()
    })
  }

  /**
   * Adds layer options to the panel
   */
  addLayerOptions(panel) {
    const { className } = this
    const { layerOptions } = this.options

    const optionsContainer = document.createElement('div')
    optionsContainer.className = `${className}__options`

    // Track how many base layers we've added
    let baseLayersAdded = 0

    layerOptions.forEach((option) => {
      const optionContainer = document.createElement('div')
      optionContainer.className = `${className}__option`

      const isBaseLayer = baseLayerIds.includes(option.id)

      const input = document.createElement('input')
      input.type = isBaseLayer ? 'radio' : 'checkbox'
      input.name = isBaseLayer ? 'base-layer' : option.id
      input.id = `layer-${option.id}`
      input.checked = option.checked || false

      input.addEventListener(EventType.CHANGE, () => {
        this.onChangeLayer({
          id: option.id,
          checked: input.checked
        })
      })

      const label = document.createElement('label')
      label.htmlFor = `layer-${option.id}`
      label.textContent = option.label

      optionContainer.appendChild(input)
      optionContainer.appendChild(label)
      optionsContainer.appendChild(optionContainer)

      // If this is a base layer, increment our counter
      if (isBaseLayer) {
        baseLayersAdded += 1

        // If this was the last base layer, add a separator after it
        if (baseLayersAdded === baseLayerIds.length) {
          const separator = document.createElement('hr')
          separator.className = `${className}__separator`
          optionsContainer.appendChild(separator)
        }
      }
    })

    // Add the attribution footnote for OpenStreetMap
    const attribution = document.createElement('div')
    attribution.className = `${className}__attribution`
    attribution.innerHTML = '&ast; &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'

    panel.appendChild(optionsContainer)
    panel.appendChild(attribution)
  }
}

export default LayerSwitcherControl
