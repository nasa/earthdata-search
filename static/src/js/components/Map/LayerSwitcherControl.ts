import React from 'react'
import ReactDOM from 'react-dom'
import Control from 'ol/control/Control'
import EventType from 'ol/events/EventType'

import { baseLayerIds } from '../../constants/mapLayers'
import mapButton from './mapButton'

import './LayerSwitcherControl.scss'

/** The options for the layer switcher control */
export type LayerSwitcherControlOptions = {
  /** The layer options to display */
  layerOptions?: Array<{ id: string; label: string; checked?: boolean }>
  /** The icon for the layers control */
  LayersIcon?: React.ReactNode
  /** Is the layer control open */
  isLayerSwitcherOpen: boolean
  /** The function to call when a layer is changed */
  onChangeLayer: (layer: { id: string; checked: boolean }) => void
  /** The function to call when the layer switcher is opened or closed */
  setIsLayerSwitcherOpen: (isOpen: boolean) => void
}

/**
 * This class adds a layer switcher control to the map
 */
class LayerSwitcherControl extends Control {
  /** The class name for the control */
  className: string

  /** The options for the layer switcher */
  layerOptions?: Array<{ id: string; label: string; checked?: boolean }>

  /** The function to call when a layer is changed */
  onChangeLayer: (layer: { id: string; checked: boolean }) => void

  /** The function to call when the layer switcher is opened or closed */
  setIsLayerSwitcherOpen: (isOpen: boolean) => void

  constructor(options: LayerSwitcherControlOptions) {
    const element = document.createElement('div')

    super({
      ...options,
      element
    })

    this.className = 'layer-switcher-control'
    element.className = `${this.className} bg-white`

    const {
      layerOptions,
      LayersIcon,
      isLayerSwitcherOpen,
      onChangeLayer,
      setIsLayerSwitcherOpen
    } = options

    this.layerOptions = layerOptions
    this.onChangeLayer = onChangeLayer
    this.setIsLayerSwitcherOpen = setIsLayerSwitcherOpen

    const toggleButton = mapButton({
      className: `${this.className}__button`,
      title: 'Layer Options',
      tooltip: false
    })

    if (LayersIcon) {
      // @ts-expect-error We are still on React 17
      ReactDOM.render(
        LayersIcon,
        toggleButton
      )
    }

    element.appendChild(toggleButton)

    const panel = document.createElement('div')
    panel.className = `${this.className}__panel bg-white`

    if (isLayerSwitcherOpen) panel.className += ` ${this.className}__panel--visible`

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
  addLayerOptions(panel: HTMLElement) {
    const { className } = this

    const optionsContainer = document.createElement('div')
    optionsContainer.className = `${className}__options`

    // Track how many base layers we've added
    let baseLayersAdded = 0

    this.layerOptions?.forEach((option) => {
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

  /**
   * Get the element for this control
   * @returns {HTMLElement} The element for this control
   */
  getElement() {
    return this.element
  }
}

export default LayerSwitcherControl
