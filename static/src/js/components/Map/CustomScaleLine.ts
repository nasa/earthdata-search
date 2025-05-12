import ScaleLine from 'ol/control/ScaleLine'

/**
 * CustomScaleLine class extends the OpenLayers ScaleLine control to allow for accessing
 * the `element` property through the `getElement` function.
 */
class CustomScaleLine extends ScaleLine {
  getElement() {
    return this.element
  }
}

export default CustomScaleLine
